import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function analisarDocumento(texto) {
  try {
    // Usando o modelo estável mais recente
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um especialista em análise de inteligência militar e gestão de crises.
      Analise o texto abaixo, extraído de um relatório operacional, e extraia os dados exatamente no formato JSON abaixo.
      
      IMPORTANTE: Retorne APENAS o JSON, sem textos explicativos, sem crases de código (markdown).
      
      Estrutura esperada:
      {
        "missao": { "nome_missao": "", "tipo_operacao": "", "teatro_local": "", "status": "" },
        "relato": { "titulo_relato": "", "descricao_evento": "", "pontuacao_friccao": 0, "nivel_decisorio_afetado": "", "severidade_percebida": "", "natureza_impacto": [] },
        "licao": { "titulo_licao": "", "categoria_licao": "", "descricao": "", "relevancia_estrategica": "", "aplicabilidade": [] },
        "atores": [ { "nome_ator": "", "tipo_ator": "", "nivel_institucional": "" } ],
        "decisoes": [ { "descricao_decisao": "", "quem_decidiu": "", "impacto_imediato": "" } ]
      }

      Texto para análise:
      ${texto}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Limpeza de segurança caso a IA mande aspas de markdown ```json
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return text;
  } catch (error) {
    console.error("Erro detalhado no Gemini:", error);
    throw new Error("Falha na análise da IA: " + error.message);
  }
}
