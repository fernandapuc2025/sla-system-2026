export async function analisarDocumento(texto) {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  
  if (!apiKey) throw new Error("A chave GOOGLE_API_KEY não foi encontrada.");

  // Mantendo o modelo gemini-2.5-flash que funcionou na sua conta
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Você é um analista militar de alto nível. Analise o relatório abaixo e extraia os dados rigorosamente no formato JSON.

        TEXTO PARA ANÁLISE:
        ${texto}

        REGRAS DE OURO PARA O BANCO DE DADOS (SIGA À RISCA):
        1. "status" da missão: Use APENAS 'Ativa' ou 'Concluída'.
        2. "pontuacao_friccao": Deve ser obrigatoriamente um NÚMERO entre 1 e 10.
        3. "nivel_decisorio_afetado": Use apenas 'Tático', 'Operacional' ou 'Estratégico'.
        4. "severidade_percebida": Use apenas 'Baixa', 'Média', 'Alta' ou 'Crítica'.
        5. "natureza_impacto": Deve ser um ARRAY de strings (ex: ["Logística", "Comunicações"]).

        ESTRUTURA DO JSON:
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
      temperature: 0.1, // Mantém a resposta precisa e menos criativa
      responseMimeType: "application/json" // Força o Gemini a falar apenas JSON
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
      console.error("ERRO DETALHADO GEMINI:", data);
      throw new Error(data.error?.message || "Erro na API do Gemini 2.5");
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Resposta da IA vazia.");
    }

    let resultText = data.candidates[0].content.parts[0].text;
    
    // Limpeza de segurança caso o modelo ignore o mimeType e envie markdown
    return resultText.replace(/```json/g, "").replace(/```/g, "").trim();

  } catch (error) {
    console.error("DEBUG GEMINI 2.5:", error.message);
    throw new Error("Falha na análise: " + error.message);
  }
}
