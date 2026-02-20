import { NextResponse } from 'next/server';
import { analisarDocumento } from '../../../lib/gemini';
import { supabase } from '../../../lib/supabaseClient';
import pdf from 'pdf-parse/lib/pdf-parse.js';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const pdfData = await pdf(buffer);
    
    const analiseBruta = await analisarDocumento(pdfData.text);
    
    const { error } = await supabase.from('analises').insert([{ 
      nome_arquivo: file.name,
      conteudo_original: pdfData.text.substring(0, 3000),
      insight_ia: analiseBruta,
      sentimento: analiseBruta.includes('Crítico') ? 'Crítico' : 'Neutro'
    }]);

    if (error) throw error;
    return NextResponse.json({ analysis: analiseBruta });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
