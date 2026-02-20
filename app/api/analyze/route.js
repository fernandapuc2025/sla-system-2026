import { NextResponse } from 'next/server';
import { analisarDocumento } from '../../../lib/gemini';
import { supabase } from '../../../lib/supabaseClient'; // Importando seu cliente Supabase
import pdf from 'pdf-parse/lib/pdf-parse.js';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });

    // 1. Extração de texto
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const pdfData = await pdf(buffer);
    const textoExtraido = pdfData.text;

    // 2. Análise da IA
    const analiseBruta = await analisarDocumento(textoExtraido);

    // 3. Organização simplificada dos dados (Parse manual do prompt)
    const sentimento = analiseBruta.match(/SENTIMENTO:\s*(.*)/)?.[1] || "Neutro";
    const categoria = analiseBruta.match(/CATEGORIA:\s*(.*)/)?.[1] || "Geral";

    // 4. Gravação no Supabase
    const { data, error } = await supabase
      .from('analises')
      .insert([
        { 
          nome_arquivo: file.name,
          conteudo_original: textoExtraido.substring(0, 5000), // Limite de segurança
          insight_ia: analiseBruta,
          sentimento: sentimento.trim(),
          categoria: categoria.trim(),
          usuario_email: "fernanda@exemplo.com" // Depois pegaremos do login
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ analysis: analiseBruta });

  } catch (error) {
    console.error("Erro na operação:", error);
    return NextResponse.json({ error: "Falha ao processar e salvar.", message: error.message }, { status: 500 });
  }
}
