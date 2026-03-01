import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { analisarDocumento } from '../../../lib/gemini';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { texto } = await request.json();
    const dadosExtraidos = await analisarDocumento(texto);

    // CÁLCULO DE SEGURANÇA (Para o site NUNCA mais dar erro de JSON)
    const somaNiveis = dadosExtraidos.atores.reduce((acc, a) => acc + (a.nivel_institucional || 5), 0);
    const qtdAtores = dadosExtraidos.atores.length || 1;
    const icmCalculado = (somaNiveis / qtdAtores) + (dadosExtraidos.relato.pontuacao_friccao * 0.1);

    // SALVANDO NO SUPABASE
    const { data: missaoObj } = await supabase
      .from('missoes')
      .upsert({ nome: dadosExtraidos.missao.nome_missao, status: 'Ativa' })
      .select().single();

    const { data: relatoObj } = await supabase
      .from('relatos_operacionais')
      .insert({ 
        missao_id: missaoObj.id, 
        titulo: dadosExtraidos.relato.titulo_relato,
        texto_bruto: texto 
      }).select().single();

    await supabase.from('indicadores_missao').insert({
      relato_id: relatoObj.id,
      icm_valor: parseFloat(icmCalculado.toFixed(2)),
      momentum_valor: icmCalculado > 5 ? 1.0 : 0.0,
      friccao_total: dadosExtraidos.relato.pontuacao_friccao
    });

    return NextResponse.json({ 
      success: true, 
      icm: icmCalculado.toFixed(2),
      missao: dadosExtraidos.missao.nome_missao
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}