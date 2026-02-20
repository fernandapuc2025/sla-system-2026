import { NextResponse } from 'next/server';
import { analisarDocumento } from '../../../lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    console.log("Iniciando teste de diagnóstico...");
    
    // Texto simples para testar a conexão
    const textoTeste = "Olá Gemini, responda apenas 'CONEXAO_OK' se você estiver me ouvindo.";
    
    const analise = await analisarDocumento(textoTeste);
    
    return NextResponse.json({ 
      analysis: "SUCESSO! A IA respondeu: " + analise 
    });

  } catch (error) {
    // Aqui pegamos o "segredo" do erro
    console.error("ERRO COMPLETO CAPTURADO:", error);
    
    return NextResponse.json({ 
      error: "ERRO DE CHAVE OU IA", 
      mensagem_real: error.message, // O que o Google disse
      causa: error.cause ? String(error.cause) : "Causa não especificada",
      dica: "Verifique se a API Key no Vercel está sem espaços e se você aceitou os termos no Google AI Studio."
    }, { status: 500 });
  }
}
