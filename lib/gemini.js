import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analisarDocumento(textoPDF) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    VOCÊ É UM ANALISTA DE INTELIGÊNCIA MILITAR E PESQUISADOR ACADÊMICO.
    Sua tarefa é processar um Relato Operacional e extrair dados estruturados para um Sistema de Apoio à Decisão.

    --- DIRETRIZES DE ANÁLISE ---
    1. COMPLEXIDADE: Identifique a densidade de atores (militares, ONGs, órgãos governamentais) e níveis de comando envolvidos.
    2. FRICÇÃO: Identifique fenômenos emergentes que impediram a fluidez da missão (atrasos, falhas de comunicação, conflitos de mandato).
    3. NÍVEL DECISÓRIO: Classifique se o evento teve impacto Estratégico, Operacional ou Tático.

    --- FORMATO DE SAÍDA (OBRIGATÓRIO) ---
    Retorne a análise em um formato técnico, utilizando o seguinte esquema:

    - TÍTULO SINTÉTICO: (Nome curto do evento)
    - SUMÁRIO EXECUTIVO: (Máximo 3 linhas com linguagem doutrinária)
    - INDICADOR DE FRICÇÃO (0-10): (Atribua uma nota baseada na severidade do impedimento)
    - INDICADOR DE COMPLEXIDADE (0-10): (Baseado na quantidade de interações entre atores)
    - CATEGORIA DE LIÇÃO APRENDIDA: (Doutrina, Logística, Comando e Controle, ou Inteligência)
    - PARECER TÉCNICO: (Análise detalhada sobre por que a fricção ocorreu e como afetou a governança)
    - RECOMENDAÇÃO: (Ação prática para mitigar este risco em missões futuras)

    --- DOCUMENTO PARA ANÁLISE ---
    ${textoPDF}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro no motor Gemini:", error);
    return "Falha na extração de dados operacionais.";
  }
}
