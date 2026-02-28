export async function analisarDocumento(texto) {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) throw new Error("A chave GOOGLE_API_KEY não foi encontrada.");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Você é um motor de inteligência ontológica para o sistema SEAG. Sua tarefa é converter relatórios de missões em dados estruturados.

        TEXTO PARA ANÁLISE:
        ${texto}

        DIRETRIZES TÉCNICAS ADICIONAIS PARA HEATMAP:
        1. Identifique pares de atores que tiveram conflitos, divergências ou falta de coordenação.
        2. Atribua um nível de intensidade de 1 a 10 para cada conflito.

        ESTRUTURA JSON DE SAÍDA:
        {
          "missao": { "nome_missao": "", "tipo_operacao": "", "teatro_local": "", "status": "Ativa" },
          "relato": { "titulo_relato": "", "descricao_evento": "", "pontuacao_friccao": 5 },
          "atores": [ { "nome_ator": "", "nivel_institucional": "Estratégico" } ],
          "conflitos": [ { "ator_a_nome": "", "ator_b_nome": "", "nivel": 7, "causa": "" } ],
          "licao": { "titulo_licao": "", "descricao": "" },
          "decisoes": [ { "descricao_decisao": "", "quem_decidiu": "" } ]
        }`
      }]
    }],
    generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  const resultText = data.candidates[0].content.parts[0].text;
  return JSON.parse(resultText);
}
