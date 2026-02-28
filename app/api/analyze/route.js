import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (certifique-se de ter essas variáveis no seu .env)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// URL do seu Codespaces (Mude para a sua URL da aba 'Ports' do GitHub)
const PYTHON_URL = "https://ideal-sniffle-4j4px4r9g5xghqxqv-8000.app.github.dev/"; 

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
          "atores": [ { "id_temporario": "A1", "nome_ator": "", "nivel_institucional": "Estratégico" } ],
          "conflitos": [ { "ator_a_nome": "", "ator_b_nome": "", "nivel": 7, "causa": "" } ],
          "licao": { "titulo_licao": "", "descricao": "" },
          "decisoes": [ { "descricao_decisao": "", "quem_decidiu": "" } ]
        }`
      }]
    }],
    generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
  };

  try {
    // 1. EXTRAÇÃO VIA GEMINI
    const responseIA = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const dataIA = await responseIA.json();
    const resultText = dataIA.candidates[0].content.parts[0].text;
    const dadosExtraidos = JSON.parse(resultText);

    // 2. CÁLCULO DE ML PESADA (PYTHON NO CODESPACES)
    // Enviamos os dados para o Python calcular o ICM matemático da sua tese
    const responseML = await fetch(`${PYTHON_URL}/analyze/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        missao_id: "id_placeholder", // Será substituído após criar a missão
        atores: dadosExtraidos.atores.map(a => ({ id: a.nome_ator, nivel: a.nivel_institucional })),
        friccao_total: dadosExtraidos.relato.pontuacao_friccao
      })
    });
    
    if (!responseML.ok) throw new Error("O 'Cérebro' Python está offline ou inacessível.");
    const metricasML = await responseML.json();

    // 3. SALVAMENTO NO SUPABASE (ORDEM ONTOLÓGICA)
    
    // A. Salva/Busca a Missão
    const { data: missaoObj } = await supabase
      .from('missoes')
      .upsert({ nome: dadosExtraidos.missao.nome_missao, status: dadosExtraidos.missao.status })
      .select().single();

    // B. Salva o Relato
    const { data: relatoObj } = await supabase
      .from('relatos_operacionais')
      .insert({ 
        missao_id: missaoObj.id, 
        titulo: dadosExtraidos.relato.titulo_relato,
        texto_bruto: texto 
      }).select().single();

    // C. Salva o ICM (Tabela que você criou no SQL)
    await supabase.from('indicadores_missao').insert({
      relato_id: relatoObj.id,
      icm_valor: metricasML.icm,
      momentum_valor: (metricasML.momentum === "Estável" ? 1.0 : 2.0),
      friccao_total: dadosExtraidos.relato.pontuacao_friccao
    });

    // D. Salva Conflitos para o HEATMAP
    if (dadosExtraidos.conflitos.length > 0) {
      for (const conf of dadosExtraidos.conflitos) {
        await supabase.from('matriz_friccao_atores').insert({
          missao_id: missaoObj.id,
          fator_gerador: conf.causa,
          intensidade_conflito: conf.nivel
          // Nota: Aqui precisaríamos converter nomes de atores em IDs reais
        });
      }
    }

    return { success: true, icm: metricasML.icm, momentum: metricasML.momentum };

  } catch (error) {
    console.error("FALHA NO MOTOR INTEGRADO:", error.message);
    throw error;
  }
}
