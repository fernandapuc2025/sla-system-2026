import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { analisarDocumento } from '../../../lib/gemini';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    
    // 1. IA analisa e separa os dados conforme a nova arquitetura
    const rawAnalysis = await analisarDocumento(pdfData.text);
    const data = JSON.parse(rawAnalysis);

    // 2. Inserir Missão (ou buscar se já existir)
    const { data: missao, error: mErr } = await supabase
      .from('missoes')
      .insert([data.missao])
      .select()
      .single();

    if (mErr) throw mErr;

    // 3. Inserir Relato vinculado à Missão
    await supabase.from('relatos_operacionais').insert([
      { ...data.relato, missao_id: missao.id }
    ]);

    // 4. Inserir Lição Aprendida vinculada à Missão
    await supabase.from('licoes_aprendidas').insert([
      { ...data.licao, missao_id: missao.id }
    ]);

    // 5. Inserir Decisões Críticas vinculadas
    if (data.decisoes?.length > 0) {
      const decisoesComId = data.decisoes.map(d => ({ ...d, missao_id: missao.id }));
      await supabase.from('decisoes_criticas').insert(decisoesComId);
    }

    return NextResponse.json({ success: true, message: "Arquitetura alimentada com sucesso!" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
