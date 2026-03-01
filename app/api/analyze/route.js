import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { analisarDocumento } from '../../../lib/gemini';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// URL limpa (Sem a barra "/" no final)
const PYTHON_URL = "https://seag-python-brain.onrender.com";

export async function POST(request) {
  try {
    const { texto } = await request.json();
    if (!texto) return NextResponse.json({ error: "Nenhum texto fornecido" }, { status: 400 });

    // 1. FASE DE INTELIGÊNCIA: Gemini extrai os dados
    console.log("--- FASE 1: GEMINI ---");
    const dadosExtraidos = await analisarDocumento(texto);
    
    let icmFinal = 0;
    let momentumFinal = "Analisando";

    // 2. FASE DE CÁLCULO: Tentativa no Python (Motor de ML)
    console.log("--- FASE 2: MOTOR PYTHON ---");
    try {
      const responseML = await fetch(`${PYTHON_URL}/analyze/metrics`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-github-token': 'true',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0' 
        },
        body: JSON.stringify({
          missao_id: "temp",
          atores: dadosExtraidos.atores.map(a => ({ 
            id: a.nome_ator, 
            nivel: a.nivel_institucional 
          })),
          friccao_total: dadosExtraidos.relato.pontuacao_friccao
        }),
        signal: AbortSignal.timeout(5000) // Desiste após 5 segundos para não travar o site
      });

      const contentType = responseML.headers.get("content-type");

      if (responseML.ok && contentType && contentType.includes("application/json")) {
        const metricasML = await responseML.json();
        icmFinal = metricasML.icm;
        momentumFinal = metricasML.momentum || "Estável";
        console.log("Sucesso: Cálculo realizado pelo motor Python.");
      } else {
        throw new Error("Resposta não-JSON ou erro de conexão.");
      }
    } catch (err) {
      console.warn("AVISO: Motor Python inacessível. Ativando cálculo de contingência JS.");
      // Lógica de Contingência: O sistema calcula localmente se o Python falhar
      const somaNiveis = dadosExtraidos.atores.reduce((acc, a) => acc + a.nivel_institucional, 0);
      const qtdAtores = dadosExtraidos.atores.length || 1;
      icmFinal = (somaNiveis / qtdAtores) + (dadosExtraidos.relato.pontuacao_friccao * 0.1);
      momentumFinal = icmFinal > 5 ? "Alerta" : "Estável";
    }

    // 3. FASE DE PERSISTÊNCIA: Supabase (Governança de Dados)
    console.log("--- FASE 3: SUPABASE ---");
    
    // A. Salva a Missão
    const { data: missaoObj, error: errMissao } = await supabase
      .from('missoes')
      .upsert({ 
        nome: dadosExtraidos.missao.nome_missao, 
        status: dadosExtraidos.missao.status || 'Ativa' 
      })
      .select().single();

    if (errMissao) throw new Error(`Erro Supabase (Missão): ${errMissao.message}`);

    // B. Salva o Relato
    const { data: relatoObj, error: errRelato } = await supabase
      .from('relatos_operacionais')
      .insert({ 
        missao_id: missaoObj.id, 
        titulo: dadosExtraidos.relato.titulo_relato,
        texto_bruto: texto 
      }).select().single();

    if (errRelato) throw new Error(`Erro Supabase (Relato): ${errRelato.message}`);

    // C. Salva Indicadores (ICM)
    await supabase.from('indicadores_missao').insert({
      relato_id: relatoObj.id,
      icm_valor: parseFloat(icmFinal.toFixed(2)),
      momentum_valor: (momentumFinal === "Crítico" || momentumFinal === "Alerta" ? 1.0 : 0.0),
      friccao_total: dadosExtraidos.relato.pontuacao_friccao
    });

    return NextResponse.json({ 
      success: true, 
      icm: icmFinal.toFixed(2),
      momentum: momentumFinal,
      missao: dadosExtraidos.missao.nome_missao
    });

  } catch (error) {
    console.error("ERRO CRÍTICO NO SISTEMA:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
