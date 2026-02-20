'use client';

export default function Dashboard() {
  // Dados fictícios para visualização do design
  const stats = [
    { label: 'Total de Análises', value: '124', icon: '📈', color: '#6366f1' },
    { label: 'SLA Cumprido', value: '92%', icon: '✅', color: '#22c55e' },
    { label: 'Atrasos Críticos', value: '12', icon: '⚠️', color: '#ef4444' },
    { label: 'Tempo Médio IA', value: '4.2s', icon: '⚡', color: '#eab308' },
  ];

  const recentActivities = [
    { id: 1, doc: 'Projeto_Alpha_V1.pdf', status: 'Concluído', date: 'Há 10 min' },
    { id: 2, doc: 'Relatorio_TI_Maio.pdf', status: 'Erro', date: 'Há 1 hora' },
    { id: 3, doc: 'SLA_Fornecedor_ABC.pdf', status: 'Concluído', date: 'Ontem' },
  ];

  return (
    <div style={{ padding: '40px', color: '#1e293b' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Bem-vinda, Fernanda 👋</h1>
        <p style={{ color: '#64748b' }}>Aqui está o que aconteceu no seu sistema de SLA hoje.</p>
      </header>

      {/* GRID DE CARDS DE STATUS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>{stat.icon}</div>
            <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '4px', color: '#1e293b' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ÁREA DE CONTEÚDO DUPLO */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* TABELA DE ATIVIDADES RECENTES */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Atividades Recentes</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ paddingBottom: '12px', fontWeight: '500' }}>Documento</th>
                <th style={{ paddingBottom: '12px', fontWeight: '500' }}>Status</th>
                <th style={{ paddingBottom: '12px', fontWeight: '500' }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((act) => (
                <tr key={act.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '16px 0', fontSize: '14px', color: '#334155' }}>{act.doc}</td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: act.status === 'Concluído' ? '#dcfce7' : '#fee2e2',
                      color: act.status === 'Concluído' ? '#166534' : '#991b1b'
                    }}>
                      {act.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 0', fontSize: '14px', color: '#64748b' }}>{act.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CARD LATERAL DE INSIGHTS */}
        <div style={{
          backgroundColor: '#6366f1',
          padding: '24px',
          borderRadius: '16px',
          color: 'white',
          backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)'
        }}>
          <h3 style={{ marginTop: 0 }}>Insight da IA 💡</h3>
          <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.6' }}>
            A maioria dos atrasos analisados nesta semana está relacionada a **falhas na infraestrutura de TI**. Considere revisar os SLAs de hardware.
          </p>
          <button style={{
            marginTop: '20px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            width: '100%'
          }}>
            Ver Relatório Completo
          </button>
        </div>

      </div>
    </div>
  );
}
