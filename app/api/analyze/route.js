import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse-fork';
import { analisarDocumento } from '../../../lib/gemini';
import { supabase } from '../../../lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // 1. Extração do Texto do PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    
    // 2. Chamada à IA (Gemini) - Certifique-se que o prompt no lib/gemini.js retorna o JSON estruturado
    const rawAnalysis = await analisarDocumento(pdfData.text);
    const data = JSON.parse(rawAnalysis);

    // --- OPERAÇÃO DE BANCO DE DATA EM CADEIA ---

    // 3. Inserir ou Vincular a Missão
    // Usamos o nome da missão para evitar duplicados ou criar uma nova
    const { data: missao, error: mErr } = await supabase
      .from('missoes')
      .upsert({ 
        nome_missao: data.missao.nome_missao,
        tipo_operacao: data.missao.tipo_operacao,
        teatro_local: data.missao.teatro_local,
        status: data.missao.status 
      }, { onConflict: 'nome_missao' })
      .select()
      .single();

    if (mErr) throw new Error(`Erro na Missão: ${mErr.message}`);

    // 4. Inserir Relato Operacional (Fricção) vinculado à Missão
    const { error: rErr } = await supabase.from('relatos_operacionais').insert([{
      missao_id: missao.id,
      titulo_relato: data.relato.titulo_relato,
      descricao_evento: data.relato.descricao_evento,
      pontuacao_friccao: data.relato.pontuacao_friccao,
      nivel_decisorio_afetado: data.relato.nivel_decisorio_afetado,
      severidade_percebida: data.relato.severidade_percebida,
      natureza_impacto: data.relato.natureza_impacto || []
    }]);

    if (rErr) throw new Error(`Erro no Relato: ${rErr.message}`);

    // 5. Inserir Lição Aprendida vinculada à Missão
    const { error: lErr } = await supabase.from('licoes_aprendidas').insert([{
      missao_id: missao.id,
      titulo_licao: data.licao.titulo_licao,
      categoria_licao: data.licao.categoria_licao,
      descricao: data.licao.descricao,
      relevancia_estrategica: data.licao.relevancia_estrategica,
      aplicabilidade: data.licao.aplicabilidade || []
    }]);

    // 6. Inserir Decisões Críticas (se houver no JSON)
    if (data.decisoes && data.decisoes.length > 0) {
      const decisoesComId = data.decisoes.map(d => ({
        ...d,
        missao_id: missao.id
      }));
      await supabase.from('decisoes_criticas').insert(decisoesComId);
    }

    // 7. Inserir Atores e Vincular (Muitos para Muitos)
    if (data.atores && data.atores.length > 0) {
      for (const ator of data.atores) {
        // Insere o ator e pega o ID
        const { data: atorData } = await supabase
          .from('atores')
          .upsert({ nome_ator: ator.nome_ator, tipo_ator: ator.tipo_ator, nivel_institucional: ator.nivel_institucional }, { onConflict: 'nome_ator' })
          .select()
          .single();
        
        if (atorData) {
          // Cria o vínculo na tabela de ligação
          await supabase.from('missao_atores').upsert({
            missao_id: missao.id,
            ator_id: atorData.id
          });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Inteligência distribuída com sucesso!",
      missao_detectada: missao.nome_missao 
    });

  } catch (error) {
    console.error("Erro na Rota de Análise:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
