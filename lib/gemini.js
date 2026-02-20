import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analisarDocumento(textoPDF) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    VOCÊ É UM ANALISTA DE ESTADO-MAIOR ESPECIALISTA EM DOUTRINA E GOVERNANÇA.
    Sua missão é processar o texto bruto e transformá-lo em dados estruturados para 5 tabelas relacionais.

    --- ESTRUTURA DE SAÍDA OBRIGATÓRIA (JSON) ---
    Retorne APENAS o objeto JSON abaixo:

    {
      "missao": {
        "nome_missao": "Título da Operação/Missão encontrada",
        "tipo_operacao": "Escolha: Operação Humanitária, Peacekeeping, Peacebuilding, Peacemaking, Peace Enforcement, Desastre Natural ou Crise Climática",
        "teatro_local": "Localização geográfica",
        "status": "Em andamento"
      },
      "atores": [
        { "nome_ator": "Nome", "tipo_ator": "Ex: Força Armada, ONG, etc", "nivel_institucional": "Estratégico, Operacional ou Tático" }
      ],
      "decisoes": [
        { "nome_decisao": "Título", "tipo_evento": "Decisão Estratégica, Evento Crítico, Incidente Operacional ou Crise Institucional", "nivel_decisorio": "Estratégico, Operacional ou Tático", "impacto_operacional": "Baixo, Médio, Alto ou Crítico" }
      ],
      "relato": {
        "titulo_relato": "Título",
        "pontuacao_friccao": 0, // Inteiro de 1 a 10 (Variável Crítica Clausewitziana)
        "nivel_decisorio_afetado": "Estratégico, Operacional ou Tático",
        "severidade_percebida": "Baixa, Média ou Alta",
        "descricao_evento": "Resumo técnico"
      },
      "licao": {
        "titulo_licao": "Título",
        "categoria_licao": "Coordenação, Logística, Governança, Comunicação, Doutrina ou Relações Civis-Militares",
        "relevancia_estrategica": "Baixa, Média ou Alta",
        "descricao": "O que deve ser aprendido"
      }
    }

    --- DOCUMENTO PARA ANÁLISE ---
    ${textoPDF}
  `;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    return responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  } catch (error) {
    throw new Error("Erro na análise da IA: " + error.message);
  }
}
