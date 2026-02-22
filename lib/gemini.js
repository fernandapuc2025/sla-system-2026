import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicialização segura
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function analisarDocumento(texto) {
  try {
    // Usar 'gemini-1.5-flash-latest' é mais estável para chamadas via API v1
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
      Você é um especialista em análise de inteligência militar. 
      Analise o texto operacional abaixo e extraia os dados estritamente no formato JSON.
      Não adicione comentários, apenas o objeto JSON.

      Estrutura:
      {
        "missao": { "nome_missao": "", "tipo_operacao": "", "teatro_local": "", "status": "" },
        "relato": { "titulo_relato": "", "descricao_evento": "", "pontuacao_friccao": 0, "nivel_decisorio_afetado": "", "severidade_percebida": "", "natureza_impacto": [] },
        "licao": { "titulo_licao": "", "categoria_licao": "", "descricao": "", "relevancia_estrategica": "", "aplicabilidade": [] },
        "atores": [ { "nome_ator": "", "tipo_ator": "", "nivel_institucional": "" } ],
        "decisoes": [ { "descricao_decisao": "", "quem_decidiu": "", "impacto_imediato": "" } ]
      }

      Texto: ${texto}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    
    // Limpeza de Markdown de forma agressiva
    return rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
  } catch (error) {
    console.error("Erro na integração Gemini:", error);
    throw new Error(`Falha na IA: ${error.message}`);
  }
}
