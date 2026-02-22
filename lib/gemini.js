import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analisarDocumento(texto) {
  try {
    // Trocamos para 'gemini-1.5-flash' puro (o mais compatível com v1beta e v1)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um analista de inteligência. 
      Analise o texto e retorne APENAS um JSON:
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
    
    return rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
  } catch (error) {
    // Este log aparecerá no painel da Vercel (Logs) para te ajudar
    console.error("DEBUG GEMINI:", error.message);
    throw new Error("Falha na IA: " + error.message);
  }
}
