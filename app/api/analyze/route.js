import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse-fork';
import { analisarDocumento } from '@/lib/gemini';
import { supabase } from '@/lib/supabaseClient';

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
    
    // 2. Chamada à IA (Gemini)
    const rawAnalysis = await analisarDocumento(pdfData.text);
    
    // Limpeza de Markdown para garantir que o JSON seja lido corretamente
    const cleanAnalysis = rawAnalysis.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanAnalysis);

    // --- OPERAÇÃO DE BANCO DE DADOS EM CADEIA ---

    // 3. Lógica para Missão (Busca ou Criação)
    let missao;
    const { data: existente } = await supabase
      .from('missoes')
      .select('*')
      .eq('nome_missao', data.missao.nome_missao)
      .maybeSingle();

    if (existente) {
      missao = existente;
    } else {
      const { data: nova, error: mErr } = await supabase
        .from('missoes')
        .insert([{ 
          nome_missao: data.missao.nome_missao,
          tipo_operacao: data.missao.tipo_operacao,
          teatro_local: data.missao.teatro_local,
          status: data.missao.status 
        }])
        .select()
        .single();
      
      if (mErr) throw new Error(`Erro na Missão: ${mErr.message}`);
      missao = nova;
    }

    // 4. Inserir Relato Operacional (Base do IFO)
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

    // 5. Inserir Lição Aprendida
    const { error: lErr } = await supabase.from('licoes_aprendidas').insert([{
      missao_id: missao.id,
      titulo_licao: data.licao.titulo_licao,
      categoria_licao: data.licao.categoria_licao,
      descricao: data.licao.descricao,
      relevancia_estrategica: data.licao.relevancia_estrategica,
      aplicabilidade: data.licao.aplicabilidade || []
    }]);
    if (lErr) console.error("Erro Lição:", lErr.message);

    // 6. Inserir Decisões Críticas
    if (data.decisoes && data.decisoes.length > 0) {
      const decisoesComId = data.decisoes.map(d => ({
        ...d,
        missao_id: missao.id
      }));
      await supabase.from('decisoes_criticas').insert(decisoesComId);
    }

    // 7. Inserir Atores e Vincular (Cálculo de ICM/Complexidade)
    if (data.atores && data.atores.length > 0) {
      for (const ator of data.atores) {
        let atorFinal;
        const { data: atorExistente } = await supabase
          .from('atores')
          .select('*')
          .eq('nome_ator', ator.nome_ator)
          .maybeSingle();

        if (atorExistente) {
          atorFinal = atorExistente;
        } else {
          const { data: novoAtor, error: aErr } = await supabase
            .from('atores')
            .insert([{ 
              nome_ator: ator.nome_ator, 
              tipo_ator: ator.tipo_ator, 
              nivel_institucional: ator.nivel_institucional 
            }])
            .select()
            .maybeSingle(); // Usando maybeSingle para evitar erro se falhar
          
          if (!aErr) atorFinal = novoAtor;
        }
        
        // Vínculo Muitos-para-Muitos
        if (atorFinal) {
          await supabase.from('missao_atores').insert([{
            missao_id: missao.id,
            ator_id: atorFinal.id
          }]);
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
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Erro interno no processamento do PDF" 
    }, { status: 500 });
  }
}
