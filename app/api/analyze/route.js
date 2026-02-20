import { NextResponse } from 'next/server';
import { analisarDocumento } from '../../../lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    console.log("Testando comunicação direta com a IA...");
    
    // TESTE: Ignoramos o PDF por um momento e enviamos um texto fixo
    const textoParaTeste = "O projeto atrasou porque a equipe de TI não recebeu os acessos a tempo.";
    
    const analise = await analisarDocumento(textoParaTeste);
    
    return NextResponse.json({ 
      analysis: "TESTE DE CONEXÃO OK! A IA disse: " + analise 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: "ERRO DE CHAVE OU IA", 
      message: error.message 
    }, { status: 500 });
  }
}
