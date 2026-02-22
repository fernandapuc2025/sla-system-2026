export async function analisarDocumento(texto) {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  
  if (!apiKey) {
    throw new Error("A chave GOOGLE_API_KEY não foi encontrada.");
  }

  // Mudamos para o endpoint estável v1
  // E usamos o modelo 'gemini-1.5-flash-8b' ou apenas 'gemini-1.5-flash'
  // O segredo aqui é usar o endpoint v1 (sem o beta) com a ação correta
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Analise o texto militar abaixo e extraia em JSON puro: ${texto}
        
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
      temperature: 0.1
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Se o erro 404 persistir aqui, tentaremos o modelo alternativo abaixo
    if (!response.ok) {
      console.error("DEBUG Erro API:", data);
      throw new Error(data.error?.message || "Erro na API do Google");
    }

    return data.candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, "").trim();

  } catch (error) {
    throw new Error("Falha na análise: " + error.message);
  }
}
