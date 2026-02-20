'use client';

export default function AnalyticsMatrix() {
  // Dados simulando o cruzamento da sua tese
  const dataPoints = [
    { name: 'Missão A', x: 80, y: 75, size: 20, color: '#ef4444', label: 'Zona Caótica' },
    { name: 'Missão B', x: 90, y: 20, size: 15, color: '#3b82f6', label: 'Complexo Estável' },
    { name: 'Missão C', x: 30, y: 85, size: 12, color: '#f59e0b', label: 'Instabilidade Tática' },
    { name: 'Missão D', x: 20, y: 15, size: 10, color: '#10b981', label: 'Zona de Rotina' },
  ];

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b' }}>📊 Matriz Complexidade × Fricção</h1>
        <p style={{ color: '#64748b' }}>Análise comparada de perfis operacionais e detecção de padrões estruturais.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
        
        {/* ÁREA DO GRÁFICO */}
        <div style={{ 
          backgroundColor: 'white', 
          height: '500px', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0',
          position: 'relative',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* EIXO Y - FRICÇÃO */}
          <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'rotate(-90deg) translateY(-50%)', fontWeight: 'bold', fontSize: '12px', color: '#64748b' }}>
            ▲ FRICÇÃO EMERGENTE (IFR)
          </div>

          {/* EIXO X - COMPLEXIDADE */}
          <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', fontSize: '12px', color: '#64748b' }}>
            COMPLEXIDADE ESTRUTURAL (ICM) ►
          </div>

          {/* GRID DO GRÁFICO */}
          <div style={{ 
            flex: 1, 
            borderLeft: '2px solid #cbd5e1', 
            borderBottom: '2px solid #cbd5e1',
            position: 'relative',
            backgroundSize: '50px 50px',
            backgroundImage: 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to top, #f1f5f9 1px, transparent 1px)'
          }}>
            {dataPoints.map((point, i) => (
              <div 
                key={i}
                style={{
                  position: 'absolute',
                  left: `${point.x}%`,
                  bottom: `${point.y}%`,
                  width: `${point.size}px`,
                  height: `${point.size}px`,
                  backgroundColor: point.color,
                  borderRadius: '50%',
                  transform: 'translate(-50%, 50%)',
                  cursor: 'pointer',
                  boxShadow: `0 0 15px ${point.color}66`
                }}
                title={`${point.name}: ${point.label}`}
              />
            ))}
          </div>
        </div>

        {/* LEGENDA E INSIGHTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>Perfis Identificados</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><span style={{ color: '#ef4444' }}>●</span> <strong>Caótico:</strong> Alta densidade e atrito.</li>
              <li><span style={{ color: '#3b82f6' }}>●</span> <strong>Institucional:</strong> Complexo mas gerível.</li>
              <li><span style={{ color: '#f59e0b' }}>●</span> <strong>Volátil:</strong> Baixa estrutura, alto atrito.</li>
              <li><span style={{ color: '#10b981' }}>●</span> <strong>Estável:</strong> Operação de baixa intensidade.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '20px', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Conclusão da IA</h4>
            <p style={{ fontSize: '13px', lineHeight: '1.5' }}>
              Padrões estruturais indicam que missões com <strong>ICM > 7.5</strong> tendem a apresentar <strong>Fricção Exponencial</strong> quando o número de Atores Governamentais excede 5 unidades.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
