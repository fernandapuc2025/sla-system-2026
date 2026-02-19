import { GoogleGenerativeAI } from "@google/generative-ai";

// Configura a conexão com a chave que você colocou no Vercel
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

export async function analisarDocumento(textoDoPDF) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analise o texto abaixo extraído de um relatório de projeto.
    Siga estas diretrizes:
    1. Identifique lições aprendidas explícitas (o que está escrito) e implícitas (o que se lê nas entrelinhas sobre falhas ou sucessos).
    2. Classifique a área (Ex: Planejamento, Comunicação, Pessoas, etc).
    3. Gere uma recomendação prática do que fazer diferente no próximo projeto.
    
    Texto do PDF:
    ${textoDoPDF}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
