import { NextResponse } from 'next/server';
import { analisarDocumento } from '../../../lib/gemini';
import pdf from 'pdf-parse';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // Convertemos o arquivo para um formato que o sistema consegue ler
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extraímos o texto do PDF
    const data = await pdf(buffer);
    const textoExtraido = data.text;

    if (!textoExtraido || textoExtraido.trim().length === 0) {
      return NextResponse.json({ error: "Não foi possível extrair texto deste PDF." }, { status: 400 });
    }

    // Enviamos o texto para a nossa IA no arquivo lib/gemini.js
    const analise = await analisarDocumento(textoExtraido);

    return NextResponse.json({ analysis: analise });
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json({ error: "Erro ao processar a análise." }, { status: 500 });
  }
}
