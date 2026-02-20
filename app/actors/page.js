'use client';

export default function ActorsGovernance() {
  const actors = [
    { id: 1, name: 'Exército Brasileiro', type: 'Força Armada', level: 'Operacional/Tático', missions: 5, power: 'Alto' },
    { id: 2, name: 'ACNUR (ONU)', type: 'Org. Internacional', level: 'Estratégico/Operacional', missions: 8, power: 'Crítico' },
    { id: 3, name: 'Médicos Sem Fronteiras', type: 'ONG', level: 'Tático', missions: 12, power: 'Médio' },
    { id: 4, name: 'Defesa Civil Estaduais', type: 'Governo Local', level: 'Tático/Operacional', missions: 3, power: 'Médio' },
  ];

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: 0 }}>🏛️ Atores & Governança</h1>
        <p style={{ color: '#64748b', marginTop: '5px' }}>Mapeamento de Redes Institucionais e Densidade de Comando.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        
        {/* LISTA DE ATORES */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '15px', fontSize: '12px', color: '#64748b' }}>ATOR</th>
                <th style={{ padding: '15px', fontSize: '12px', color: '#64748b' }}>TIPO</th>
                <th style={{ padding: '15px', fontSize: '12px', color: '#64748b' }}>NÍVEL</th>
                <th style={{ padding: '15px', fontSize: '12px', color: '#64748b' }}>MISSÕES</th>
              </tr>
            </thead>
            <tbody>
              {actors.map((actor) => (
                <tr key={actor.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#0f172a' }}>{actor.name}</td>
                  <td style={{ padding: '15px', fontSize: '13px' }}>{actor.type}</td>
                  <td style={{ padding: '15px', fontSize: '13px', color: '#6366f1' }}>{actor.level}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>
                      {actor.missions}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* COLUNA LATERAL - INSIGHTS DE REDE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '25px', borderRadius: '16px' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px', color: '#94a3b8' }}>Análise de Rede</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              A <strong>Densidade Institucional</strong> atual é alta. Identificamos 12 pontos de intersecção entre atores militares e civis no nível Tático.
            </p>
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6366f1' }}>RISCO DE GOVERNANÇA</p>
              <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>Sobreposição de Mandatos (Médio)</p>
            </div>
          </div>

          <div style={{ padding: '20px', borderRadius: '16px', border: '2px dashed #cbd5e1', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '13px' }}>
              [Espaço para Gráfico de Grafo / Network Map]
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
