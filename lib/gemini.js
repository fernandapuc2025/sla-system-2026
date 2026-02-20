import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

export async function analisarDocumento(texto) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Analise este documento de SLA e identifique a causa raiz e o sentimento (Crítico ou Neutro): ${texto}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
