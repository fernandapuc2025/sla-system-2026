import { NextResponse } from 'next/server';
import { analisarDocumento } from '../../../lib/gemini';
import pdf from 'pdf-parse';

export async function POST(request) {
  try {
    console.log("--- Iniciando processamento da API ---");

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error("Erro: Nenhum arquivo foi recebido no servidor.");
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    console.log("Arquivo recebido:", file.name);

    // Convertemos o arquivo para buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extraímos o texto do PDF
    // Usamos uma configuração padrão para evitar erros de renderização
    const data = await pdf(buffer);
    const textoExtraido = data.text;

    // RASTREADOR 1: Verificando se o PDF tem texto
    if (!textoExtraido || textoExtraido.trim().length === 0) {
      console.error("Erro: O PDF parece estar vazio ou é apenas imagem.");
      return NextResponse.json({ error: "O PDF não contém texto legível." }, { status: 400 });
    }

    console.log("Texto extraído com sucesso! Tamanho:", textoExtraido.length, "caracteres.");
    console.log("Início do texto:", textoExtraido.substring(0, 100));

    // RASTREADOR 2: Chamando a IA
    console.log("Enviando texto para o Gemini...");
    const analise = await analisarDocumento(textoExtraido);

    console.log("IA respondeu com sucesso!");
    return NextResponse.json({ analysis: analise });

  } catch (error) {
    // Esse bloco captura o erro exato e mostra no log do Vercel
    console.error("DETALHE DO ERRO NA API:", error.message);
    return NextResponse.json({ 
      error: "Erro interno no servidor.", 
      details: error.message 
    }, { status: 500 });
  }
}
