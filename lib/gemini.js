import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa o cliente do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analisarDocumento(textoPDF) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    VOCÊ É UM OFICIAL DE INTELIGÊNCIA DE ESTADO-MAIOR E PESQUISADOR ACADÊMICO (DOUTOR EM CIÊNCIAS MILITARES E GOVERNANÇA).
    Sua missão é processar um Relato Operacional bruto e extrair a teleologia do evento, quantificando os níveis de Fricção e Complexidade para alimentar um Sistema de Apoio à Decisão (SAD).

    --- DIRETRIZES DOUTRINÁRIAS E ACADÊMICAS ---
    1. COMPLEXIDADE ESTRUTURAL: Avalie a multiplicidade de atores (interagências, ONGs, Forças Armadas), a densidade institucional e os níveis de comando sobrepostos.
    2. FRICÇÃO OPERACIONAL (Fator Clausewitziano): Identifique os atritos, a "névoa da guerra", falhas de Comando e Controle (C2), gargalos logísticos e dissonâncias táticas que impediram o fluxo ideal da missão.
    3. NÍVEL DECISÓRIO: Especifique categoricamente se o centro de gravidade do evento foi Estratégico, Operacional ou Tático.

    --- FORMATO DE SAÍDA OBRIGATÓRIO (JSON PURO) ---
    Você deve retornar EXCLUSIVAMENTE um objeto JSON válido. Não inclua formatação markdown (como \`\`\`json), apenas o objeto puro. O JSON deve seguir exatamente esta estrutura:

    {
      "titulo_sintetico": "Nome curto e militarizado do evento (ex: Incidente Logístico na Zona Alpha)",
      "sumario_executivo": "Resumo denso e acadêmico em no máximo 3 linhas focando no impacto para a governança.",
      "nivel_decisorio": "Estratégico, Operacional ou Tático",
      "atores_envolvidos": ["Lista", "de", "Atores", "Identificados"],
      "indicador_complexidade": <número inteiro de 1 a 10>,
      "indicador_friccao": <número inteiro de 1 a 10>,
      "categoria_licao": "Comando e Controle (C2), Logística, Assuntos Civis, Inteligência ou Doutrina",
      "parecer_tecnico": "Análise acadêmica detalhada sobre a correlação entre a complexidade estrutural encontrada e a fricção gerada.",
      "recomendacao_mitigacao": "Diretriz doutrinária ou operacional acionável para prevenir a reincidência desta fricção em missões futuras.",
      "sentimento": "Crítico, Atenção ou Normal"
    }

    --- DOCUMENTO PARA ANÁLISE ---
    ${textoPDF}
  `;

  try {
    const result = await model.generateContent(prompt);
    let textoResposta = result.response.text();
    
    // Limpeza de segurança caso a IA insira blocos de markdown no JSON
    textoResposta = textoResposta.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return textoResposta; // Retorna a string em formato JSON estruturado
  } catch (error) {
    console.error("Erro no motor Gemini:", error);
    throw new Error("Falha na extração de dados operacionais.");
  }
}
