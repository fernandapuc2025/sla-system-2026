export async function analisarDocumento(texto) {
  const apiKey = process.env.GOOGLE_API_KEY;
  // Mantemos a v1 que é a mais estável para o modelo Flash
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Você é um especialista em análise de inteligência militar. Analise o texto abaixo e extraia os dados estritamente no formato JSON. 
        IMPORTANTE: Retorne APENAS o objeto JSON puro, sem crases, sem a palavra 'json' e sem comentários.
        
        Texto para análise: ${texto}

        Estrutura do JSON:
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
      temperature: 0.1
      // Removemos o responseMimeType para garantir compatibilidade com a v1
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

    if (!data.candidates || !data.candidates[0]) {
      throw new Error("A IA não retornou resultados válidos.");
    }

    let resultText = data.candidates[0].content.parts[0].text;
    
    // Limpeza manual caso a IA insira blocos de código markdown
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();

    return resultText;

  } catch (error) {
    console.error("DEBUG GEMINI:", error.message);
    throw new Error("Falha na análise: " + error.message);
  }
}
