export async function analisarDocumento(texto) {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  
  if (!apiKey) {
    throw new Error("A chave GOOGLE_API_KEY não foi encontrada.");
  }

  // Mudamos de v1 para v1beta para garantir que o modelo seja encontrado
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Você é um analista militar. Analise o texto e extraia em JSON puro: ${texto}
        
        Estrutura:
        {
          "missao": { "nome_missao": "", "tipo_operacao": "", "teatro_local": "", "status": "" },
          "relato": { "titulo_relato": "", "descricao_evento": "", "pontuacao_friccao": 0, "nivel_decisorio_afetado": "", "severidade_percebida": "", "natureza_impacto": [] },
          "licao": { "titulo_licao": "", "categoria_licao": "", "descricao": "", "relevancia_estrategica": "", "aplicabilidade": [] },
          "atores": [ { "nome_ator": "", "tipo_ator": "", "nivel_institucional": "" } ],
          "decisoes": [ { "descricao_decisao": "", "quem_decidiu": "", "impacto_imediato": "" } ]
        }`
      }]
    }]
    // Removido o responseMimeType e generationConfig para máxima compatibilidade
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro detalhado:", data);
      throw new Error(data.error?.message || "Erro na API do Google");
    }

    let resultText = data.candidates[0].content.parts[0].text;
    
    // Limpeza de markdown se a IA colocar
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();

    return resultText;

  } catch (error) {
    console.error("DEBUG GEMINI:", error.message);
    throw new Error("Falha na análise: " + error.message);
  }
}
