import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

export async function analisarDocumento(texto) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  // Pedimos para a IA responder em um formato fácil de "quebrar" depois
  const prompt = `Analise o seguinte texto de SLA/Lições Aprendidas e responda EXATAMENTE neste formato:
  RESUMO: (um parágrafo sobre o erro)
  SENTIMENTO: (escolha entre: Crítico, Atenção, Positivo ou Neutro)
  CATEGORIA: (escolha entre: TI, Logística, Jurídico ou Operações)
  
  Texto: ${texto}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
