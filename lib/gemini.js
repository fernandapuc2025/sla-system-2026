import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

export async function analisarDocumento(texto) {
  // Usando a versão mais estável do modelo
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(texto);
  const response = await result.response;
  return response.text();
}
