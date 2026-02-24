export async function analisarDocumento(texto) {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  
  if (!apiKey) throw new Error("A chave GOOGLE_API_KEY não foi encontrada.");

  // Modelo Gemini 2.5 Flash - Alta velocidade e precisão para JSON
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Você é um motor de inteligência ontológica para o sistema SEAG. Sua tarefa é converter relatórios de missões em dados estruturados para análise de MOMENTUM e MATRIZ DE EFICIÊNCIA.

        TEXTO PARA ANÁLISE:
        ${texto}

        DIRETRIZES TÉCNICAS (ESTRITAMENTE OBRIGATÓRIAS):
        1. "missao": Identifique o nome da operação. Status deve ser 'Ativa' ou 'Concluída'.
        2. "pontuacao_friccao": Analise a resistência institucional, gargalos e falhas. Atribua um valor INTEIRO de 1 a 10 (onde 10 é paralisia total).
        3. "atores": Extraia todos os órgãos, entidades ou grupos mencionados. 
           - "nivel_institucional": Classifique como 'Estratégico' (Governo/Comando), 'Operacional' (Coordenação) ou 'Tático' (Execução em campo).
        4. "decisoes": Identifique decisões críticas que alteraram o curso da missão.
        5. "licao": Resuma o aprendizado principal para evitar repetição de erros.

        ESTRUTURA JSON DE SAÍDA:
        {
          "missao": { 
            "nome_missao": "", 
            "tipo_operacao": "", 
            "teatro_local": "", 
            "status": "" 
          },
          "relato": { 
            "titulo_relato": "", 
            "descricao_evento": "", 
            "pontuacao_friccao": 5, 
            "nivel_decisorio_afetado": "Operacional", 
            "severidade_percebida": "Média", 
            "natureza_impacto": [] 
          },
          "licao": { 
            "titulo_licao": "", 
            "categoria_licao": "", 
            "descricao": "", 
            "relevancia_estrategica": "Alta", 
            "aplicabilidade": [] 
          },
          "atores": [ 
            { "nome_ator": "", "tipo_ator": "", "nivel_institucional": "" } 
          ],
          "decisoes": [ 
            { "descricao_decisao": "", "quem_decidiu": "", "impacto_imediato": "" } 
          ]
        }`
      }]
    }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ERRO API GEMINI:", data);
      throw new Error(data.error?.message || "Erro na comunicação com Gemini 2.5");
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("A IA não gerou conteúdo para este documento.");
    }

    let resultText = data.candidates[0].content.parts[0].text;
    
    // Limpeza redundante para garantir a validade do JSON
    return resultText.replace(/```json/g, "").replace(/```/g, "").trim();

  } catch (error) {
    console.error("FALHA NO MOTOR GEMINI:", error.message);
    throw new Error("Erro na extração de inteligência: " + error.message);
  }
}
