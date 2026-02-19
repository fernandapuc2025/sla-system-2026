import { GoogleGenerativeAI } from "@google/generative-ai";

// Aqui o site pega a chave secreta que você salvou no Vercel
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
