import { NextResponse } from 'next/server';
import { analisarDocumento } from '../../../lib/gemini';
import pdf from 'pdf-parse/lib/pdf-parse.js'; // Caminho direto para evitar erros no Vercel

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extração com tratamento de erro específico
    let textoExtraido = "";
    try {
      const data = await pdf(buffer);
      textoExtraido = data.text;
    } catch (pdfError) {
      console.error("Erro no PDF-Parse:", pdfError);
      return NextResponse.json({ error: "Falha ao ler o conteúdo do PDF." }, { status: 422 });
    }

    if (!textoExtraido || textoExtraido.trim().length < 5) {
      return NextResponse.json({ error: "O PDF parece estar sem texto legível." }, { status: 400 });
    }

    const analise = await analisarDocumento(textoExtraido);
    return NextResponse.json({ analysis: analise });

  } catch (error) {
    console.error("Erro Geral API:", error);
    return NextResponse.json({ error: "Erro na análise", details: error.message }, { status: 500 });
  }
}
