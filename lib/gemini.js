export async function analisarDocumento(texto) {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  
  if (!apiKey) {
    throw new Error("A chave GOOGLE_API_KEY não foi encontrada.");
  }

  // Usando o alias 'latest' que força o Google a redirecionar para a versão disponível
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Analise o texto militar e extraia em JSON: ${texto}
        
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

    if (!response.ok) {
      console.error("ERRO GOOGLE:", data);
      // Se ainda der 404, o erro virá detalhado aqui
      throw new Error(data.error?.message || "Erro na API");
    }

    let resultText = data.candidates[0].content.parts[0].text;
    return resultText.replace(/```json/g, "").replace(/```/g, "").trim();

  } catch (error) {
    throw new Error("Falha na análise: " + error.message);
  }
}
