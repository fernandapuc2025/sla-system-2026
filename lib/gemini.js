import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analisarDocumento(textoPDF) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    VOCÊ É UM ANALISTA TÁTICO DE INTELIGÊNCIA MILITAR.
    Sua tarefa é ler relatórios operacionais e extrair dados para uma arquitetura relacional de 5 bancos.

    --- REGRAS DE EXTRAÇÃO ---
    1. MISSÃO: Identifique o nome da operação e o tipo.
    2. ATORES: Liste todas as organizações citadas (ex: Cruz Vermelha, Exército, ONU).
    3. DECISÕES: Identifique eventos críticos e o nível (Estratégico, Operacional, Tático).
    4. RELATO: Extraia o incidente principal e atribua uma PONTUAÇÃO DE FRICÇÃO (1-10).
    5. LIÇÃO: Formule uma lição aprendida clara baseada no evento.

    --- FORMATO DE SAÍDA (JSON PURO) ---
    {
      "missao": {
        "nome_missao": "Título",
        "tipo_operacao": "Peacekeeping", 
        "teatro_local": "Local",
        "status": "Em andamento"
      },
      "atores": [
        { "nome_ator": "Nome", "tipo_ator": "ONG", "nivel_institucional": "Estratégico" }
      ],
      "decisoes": [
        { "nome_decisao": "Título", "tipo_evento": "Evento Crítico", "nivel_decisorio": "Operacional", "impacto_operacional": "Alto" }
      ],
      "relato": {
        "titulo_relato": "Título",
        "pontuacao_friccao": 8,
        "nivel_decisorio_afetado": "Tático",
        "severidade_percebida": "Alta",
        "descricao_evento": "Resumo técnico",
        "natureza_impacto": ["Logístico", "Diplomático"]
      },
      "licao": {
        "titulo_licao": "Título",
        "categoria_licao": "Logística",
        "relevancia_estrategica": "Alta",
        "descricao": "Texto da lição",
        "aplicabilidade": ["Operações Futuras"]
      }
    }

    Documento para análise:
    ${textoPDF}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Limpeza de possíveis formatações markdown da IA
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
  } catch (error) {
    console.error("Erro no Gemini:", error);
    throw error;
  }
}
