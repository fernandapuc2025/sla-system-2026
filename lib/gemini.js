import { GoogleGenerativeAI } from "@google/generative-ai";

// Verifique se aqui não tem nenhum erro de digitação no nome da variável
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

export async function analisarDocumento(texto) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(texto);
  const response = await result.response;
  return response.text();
}
