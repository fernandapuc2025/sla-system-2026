import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { analisarDocumento } from '../../../lib/gemini';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PYTHON_URL = "https://ideal-sniffle-4j4px4r9g5xghqxqv-8000.app.github.dev/";

export async function POST(request) {
  try {
    const { texto } = await request.json();

    // 1. Chama o Especialista (Gemini)
    const dadosExtraidos = await analisarDocumento(texto);

    // 2. Chama o Cérebro (Python no Codespaces)
    const responseML = await fetch(`${PYTHON_URL}/analyze/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        missao_id: "temp",
        atores: dadosExtraidos.atores.map(a => ({ id: a.nome_ator, nivel: a.nivel_institucional })),
        friccao_total: dadosExtraidos.relato.pontuacao_friccao
      })
    });

    if (!responseML.ok) throw new Error("O servidor Python está offline.");
    const metricasML = await responseML.json();

    // 3. Salva no Supabase (Fluxo de Governança)
    
    // A. Missão
    const { data: missaoObj } = await supabase
      .from('missoes')
      .upsert({ nome: dadosExtraidos.missao.nome_missao, status: dadosExtraidos.missao.status })
      .select().single();

    // B. Relato
    const { data: relatoObj } = await supabase
      .from('relatos_operacionais')
      .insert({ 
        missao_id: missaoObj.id, 
        titulo: dadosExtraidos.relato.titulo_relato,
        texto_bruto: texto 
      }).select().single();

    // C. Indicadores (ICM)
    await supabase.from('indicadores_missao').insert({
      relato_id: relatoObj.id,
      icm_valor: metricasML.icm,
      momentum_valor: (metricasML.momentum === "Estável" ? 1.0 : 2.0),
      friccao_total: dadosExtraidos.relato.pontuacao_friccao
    });

    // D. Conflitos (Matriz)
    if (dadosExtraidos.conflitos.length > 0) {
      for (const conf of dadosExtraidos.conflitos) {
        await supabase.from('matriz_friccao_atores').insert({
          missao_id: missaoObj.id,
          fator_gerador: conf.causa,
          intensidade_conflito: conf.nivel
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      icm: metricasML.icm, 
      momentum: metricasML.momentum 
    });

  } catch (error) {
    console.error("ERRO NO PROCESSAMENTO:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
