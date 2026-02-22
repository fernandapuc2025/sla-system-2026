export async function analisarDocumento(texto) {
  const apiKey = process.env.GEMINI_API_KEY;
  // Usamos a v1 (estável) e o modelo flash direto na URL
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Você é um especialista em análise de inteligência. Analise o texto abaixo e extraia os dados estritamente no formato JSON sugerido. Retorne APENAS o JSON, sem markdown.
        
        Texto: ${texto}

        Estrutura:
        {
          "missao": { "nome_missao": "", "tipo_operacao": "", "teatro_local": "", "status": "" },
          "relato": { "titulo_relato": "", "descricao_evento": "", "pontuacao_friccao": 0, "nivel_decisorio_afetado": "", "severidade_percebida": "", "natureza_impacto": [] },
          "licao": { "titulo_licao": "", "categoria_licao": "", "descricao": "", "relevancia_estrategica": "", "aplicabilidade": [] },
          "atores": [ { "nome_ator": "", "tipo_ator": "", "nivel_institucional": "" } ],
          "decisoes": [ { "descricao_decisao": "", "quem_decidiu": "", "impacto_imediato": "" } ]
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
      console.error("Erro Google API:", data);
      throw new Error(data.error?.message || "Erro na chamada da API");
    }

    // O Gemini retorna o texto dentro dessa estrutura de candidatos
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("DEBUG GEMINI:", error.message);
    throw new Error("Falha na análise: " + error.message);
  }
}
