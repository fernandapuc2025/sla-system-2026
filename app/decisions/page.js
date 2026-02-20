'use client';

export default function DecisionsEvents() {
  const events = [
    { 
      id: 1, 
      date: '12/02/2026', 
      title: 'Bloqueio de comboio humanitário', 
      level: 'Tático', 
      impact: 'Alto', 
      nature: 'Segurança',
      desc: 'Comboio da ONU retido por milícias locais na entrada da Zona Norte.' 
    },
    { 
      id: 2, 
      date: '14/02/2026', 
      title: 'Mudança nas Regras de Engajamento (ROE)', 
      level: 'Estratégico', 
      impact: 'Crítico', 
      nature: 'Político/Militar',
      desc: 'Conselho de Segurança autoriza uso de força proporcional para proteção de civis.' 
    },
    { 
      id: 3, 
      date: '15/02/2026', 
      title: 'Estabelecimento de Corredor de Saúde', 
      level: 'Operacional', 
      impact: 'Médio', 
      nature: 'Logístico',
      desc: 'Coordenação entre Exército e ONGs para evacuação médica.' 
    },
  ];

  const getLevelColor = (level) => {
    if (level === 'Estratégico') return '#6366f1';
    if (level === 'Operacional') return '#f59e0b';
    return '#64748b';
  };

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: 0 }}>⚙️ Decisões & Eventos Críticos</h1>
        <p style={{ color: '#64748b', marginTop: '5px' }}>Rastreabilidade de Fluxos Decisórios e Impactos Institucionais.</p>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        {/* LINHA CENTRAL DA TIMELINE */}
        <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', backgroundColor: '#e2e8f0' }}></div>

        {events.map((event) => (
          <div key={event.id} style={{ position: 'relative', paddingLeft: '60px', marginBottom: '40px' }}>
            {/* PONTO NA LINHA */}
            <div style={{ 
              position: 'absolute', left: '11px', top: '0', width: '20px', height: '20px', 
              borderRadius: '50%', backgroundColor: 'white', border: `4px solid ${getLevelColor(event.level)}`,
              zIndex: 2
            }}></div>

            <div style={{ 
              backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>{event.date}</span>
                <span style={{ 
                  fontSize: '10px', padding: '2px 8px', borderRadius: '4px', color: 'white', 
                  backgroundColor: getLevelColor(event.level), fontWeight: 'bold' 
                }}>
                  {event.level.toUpperCase()}
                </span>
              </div>
              
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a' }}>{event.title}</h3>
              <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{event.desc}</p>
              
              <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}><strong>Impacto:</strong> {event.impact}</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}><strong>Natureza:</strong> {event.nature}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
