import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { analisarDocumento } from '../../../lib/gemini';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Nenhum ficheiro fornecido.' }, { status: 400 });
    }

    // 1. Converter o ficheiro para Buffer e extrair o texto
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    const textoPDF = pdfData.text;

    // 2. Enviar para o Gemini processar (Agora retorna JSON)
    const iaResponseRaw = await analisarDocumento(textoPDF);
    
    // 3. Tentar fazer o parse do JSON para garantir que está estruturado
    let analiseEstruturada;
    try {
      analiseEstruturada = JSON.parse(iaResponseRaw);
    } catch (parseError) {
      console.error("A IA não devolveu um JSON válido:", iaResponseRaw);
      return NextResponse.json({ error: 'Falha ao estruturar os dados da IA.' }, { status: 500 });
    }

    // 4. Guardar no Supabase
    // Guardamos o JSON completo formatado na coluna "insight_ia" para manter toda a riqueza de detalhes
    // e extraímos o "sentimento" para a coluna dedicada que criámos anteriormente.
    const { data, error } = await supabase
      .from('analises')
      .insert([
        { 
          nome_arquivo: file.name,
          insight_ia: JSON.stringify(analiseEstruturada, null, 2),
          sentimento: analiseEstruturada.sentimento || 'Normal'
        }
      ])
      .select();

    if (error) {
      console.error("Erro ao inserir no Supabase:", error);
      return NextResponse.json({ error: 'Erro ao guardar na base de dados.' }, { status: 500 });
    }

    // 5. Retornar o parecer técnico para o ecrã do utilizador
    return NextResponse.json({ 
      success: true, 
      analysis: analiseEstruturada.parecer_tecnico,
      dados_completos: analiseEstruturada
    });

  } catch (error) {
    console.error('Erro no processamento do documento:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
