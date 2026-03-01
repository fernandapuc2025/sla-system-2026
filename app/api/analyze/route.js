import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { analisarDocumento } from '../../../lib/gemini';

// Inicialização do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// URL do seu Codespaces (Certifique-se de que a porta 8000 está PUBLIC)
const PYTHON_URL = "https://ideal-sniffle-4j4px4r9g5xghqxqv-8000.app.github.dev";

export async function POST(request) {
  try {
    const { texto } = await request.json();

    if (!texto) {
      return NextResponse.json({ error: "Nenhum texto fornecido" }, { status: 400 });
    }

    // 1. Fase de Inteligência: Chama o Gemini para extrair dados ontológicos
    console.log("Iniciando análise com Gemini...");
    const dadosExtraidos = await analisarDocumento(texto);

    // 2. Fase de Cálculo: Envia para o Python (Codespaces) calcular o ICM
    console.log("Enviando para o motor Python...");
    const responseML = await fetch(`${PYTHON_URL}/analyze/metrics`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-github-token': 'true' // Pula a tela de aviso do GitHub
      },
      body: JSON.stringify({
        missao_id: "temp",
        atores: dadosExtraidos.atores.map(a => ({ 
          id: a.nome_ator, 
          nivel: a.nivel_institucional 
        })),
        friccao_total: dadosExtraidos.relato.pontuacao_friccao
      })
    });

    if (!responseML.ok) {
      const errorText = await responseML.text();
      console.error("Erro no Python:", errorText);
      throw new Error("O servidor Python está offline ou retornou erro.");
    }

    // Lendo o resultado do cálculo (ICM) vindo do Python
    const metricasML = await responseML.json();

    // 3. Fase de Persistência: Salva no Supabase (Fluxo de Governança)
    
    // A. Registra ou atualiza a Missão
    const { data: missaoObj, error: errMissao } = await supabase
      .from('missoes')
      .upsert({ 
        nome: dadosExtraidos.missao.nome_missao, 
        status: dadosExtraidos.missao.status || 'Ativa' 
      })
      .select().single();

    if (errMissao) throw new Error(`Erro Supabase (Missão): ${errMissao.message}`);

    // B. Salva o Relato Operacional bruto
    const { data: relatoObj, error: errRelato } = await supabase
      .from('relatos_operacionais')
      .insert({ 
        missao_id: missaoObj.id, 
        titulo: dadosExtraidos.relato.titulo_relato,
        texto_bruto: texto 
      }).select().single();

    if (errRelato) throw new Error(`Erro Supabase (Relato): ${errRelato.message}`);

    // C. Salva os Indicadores calculados pelo Python (ICM)
    const { error: errInd } = await supabase.from('indicadores_missao').insert({
      relato_id: relatoObj.id,
      icm_valor: metricasML.icm,
      momentum_valor: (metricasML.status === "calculado" ? 1.0 : 0.0), // Lógica simplificada de momentum
      friccao_total: dadosExtraidos.relato.pontuacao_friccao
    });

    if (errInd) throw new Error(`Erro Supabase (Indicadores): ${errInd.message}`);

    // D. Registra Conflitos na Matriz de Fricção (para o Heatmap)
    if (dadosExtraidos.conflitos && dadosExtraidos.conflitos.length > 0) {
      for (const conf of dadosExtraidos.conflitos) {
        await supabase.from('matriz_friccao_atores').insert({
          missao_id: missaoObj.id,
          fator_gerador: conf.causa || "Divergência Operacional",
          intensidade_conflito: conf.nivel || 5
        });
      }
    }

    // Retorno final para o Frontend (Sucesso total)
    return NextResponse.json({ 
      success: true, 
      icm: metricasML.icm,
      missao: dadosExtraidos.missao.nome_missao
    });

  } catch (error) {
    console.error("ERRO NO FLUXO SEAG:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
