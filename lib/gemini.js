export async function analisarDocumento(texto) {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  
  if (!apiKey) throw new Error("A chave GOOGLE_API_KEY não foi encontrada.");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Você é um motor de inteligência ontológica para o sistema SEAG. Converta o texto em dados estruturados.

        TEXTO PARA ANÁLISE:
        ${texto}

        DIRETRIZES TÉCNICAS:
        1. "missao": Identifique nome e status.
        2. "relato": Título e pontuação de friccao (1-10).
        3. "atores": Extraia órgãos e nível (Estratégico, Operacional, Tático).
        4. "conflitos": Identifique pares de atores que tiveram divergências (Obrigatório para o Heatmap).

        ESTRUTURA JSON DE SAÍDA:
        {
          "missao": { "nome_missao": "", "status": "Ativa" },
          "relato": { "titulo_relato": "", "pontuacao_friccao": 5 },
          "atores": [ { "nome_ator": "", "nivel_institucional": "" } ],
          "conflitos": [ { "ator_a": "", "ator_b": "", "nivel": 5, "causa": "" } ],
          "licao": { "titulo_licao": "", "descricao": "" },
          "decisoes": [ { "descricao_decisao": "", "quem_decidiu": "" } ]
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

    if (!response.ok) throw new Error("Erro na comunicação com Gemini");

    let resultText = data.candidates[0].content.parts[0].text;
    
    // A MUDANÇA ESTÁ AQUI: Convertendo o texto em Objeto JSON real
    const jsonLimpo = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonLimpo); 

  } catch (error) {
    console.error("FALHA NO MOTOR GEMINI:", error.message);
    throw new Error("Erro na extração: " + error.message);
  }
}
