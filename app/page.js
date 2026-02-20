'use client';
export default function CommandCenter() {
  return (
    <div style={{ padding: '30px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>🧭 Centro de Comando Operacional</h1>
        <p style={{ color: '#64748b' }}>Monitoramento de Governança e Dinâmicas de Fricção em Tempo Real.</p>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Missões Ativas', val: '08', color: '#2563eb' },
          { label: 'Atores Institucionais', val: '34', color: '#1e293b' },
          { label: 'Eventos de Fricção', val: '12', color: '#ef4444' },
          { label: 'Lições Validadas', val: '89', color: '#10b981' }
        ].map((kpi, i) => (
          <div key={i} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>{kpi.label}</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '32px', fontWeight: '800', color: kpi.color }}>{kpi.val}</p>
          </div>
        ))}
      </div>

      {/* VISÃO RESUMIDA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0 }}>📊 Status do Ambiente Operacional</h3>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Análise baseada no cruzamento de Complexidade (ICM) vs Fricção Relativa.</p>
          <div style={{ height: '200px', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1' }}>
            [Espaço para o Gráfico de Dispersão Global]
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', color: 'white' }}>
          <h3 style={{ marginTop: 0, color: '#94a3b8' }}>🚨 Alertas Críticos</h3>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #334155' }}>
              ⚠️ <strong>Missão UNIFIL:</strong> Fricção Nível 9 detectada no setor logístico.
            </li>
            <li style={{ padding: '10px 0' }}>
              🧩 <strong>Operação Sul:</strong> Aumento de 40% na densidade de Atores.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
