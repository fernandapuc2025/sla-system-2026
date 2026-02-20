import { NextResponse } from 'next/server';
import { analisarDocumento } from '../../../lib/gemini';
import pdf from 'pdf-parse/lib/pdf-parse.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let textoExtraido = "";
    try {
      const data = await pdf(buffer);
      textoExtraido = data.text;
    } catch (pdfError) {
      return NextResponse.json({ error: "Erro ao ler PDF.", details: pdfError.message }, { status: 422 });
    }

    if (!textoExtraido || textoExtraido.trim().length < 5) {
      return NextResponse.json({ error: "PDF sem texto legível." }, { status: 400 });
    }

    const analise = await analisarDocumento(textoExtraido);
    return NextResponse.json({ analysis: analise });

  } catch (error) {
    console.error("ERRO NA API:", error);
    return NextResponse.json({ 
      error: "Erro na análise", 
      message: error.message 
    }, { status: 500 });
  }
}
