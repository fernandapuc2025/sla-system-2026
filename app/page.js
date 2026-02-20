'use client';
export default function Dashboard() {
  return (
    <div>
      <h1 style={{ color: '#1e293b' }}>Bem-vinda, Fernanda 👋</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3>Total de Análises</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>124</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#6366f1', color: 'white', borderRadius: '12px' }}>
          <h3>IA Insight</h3>
          <p>Falhas de TI são a maior causa de atrasos hoje.</p>
        </div>
      </div>
    </div>
  );
}
