'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AnalyticsMatrix() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChartData() {
      const { data, error } = await supabase
        .from('analises')
        .select('id, nome_arquivo, insight_ia');

      if (!error && data) {
        const mappedPoints = data.map(item => {
          try {
            const parsed = JSON.parse(item.insight_ia);
            return {
              id: item.id,
              name: parsed.titulo_sintetico || item.nome_arquivo,
              x: parsed.indicador_complexidade || 0, // Complexidade
              y: parsed.indicador_friccao || 0,      // Fricção
              size: 15,
              category: parsed.categoria_licao
            };
          } catch (e) {
            return null;
          }
        }).filter(p => p !== null);
        
        setPoints(mappedPoints);
      }
      setLoading(false);
    }
    loadChartData();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b' }}>📊 Matriz de Correlação: Complexidade vs Fricção</h1>
        <p style={{ color: '#64748b' }}>Visualização em tempo real da dispersão de incidentes baseada na análise da IA.</p>
      </header>

      <div style={{ 
        backgroundColor: 'white', padding: '40px', borderRadius: '20px', 
        border: '1px solid #e2e8f0', position: 'relative', height: '600px',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
      }}>
        
        {/* EIXOS DO GRÁFICO */}
        <div style={{ position: 'absolute', left: '60px', bottom: '60px', right: '40px', top: '40px', borderLeft: '2px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>
          
          {/* RÓTULOS DOS EIXOS */}
          <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', color: '#64748b' }}>
            COMPLEXIDADE ESTRUTURAL (1-10)
          </div>
          <div style={{ position: 'absolute', left: '-50px', top: '50%', transform: 'rotate(-90deg) translateX(50%)', fontWeight: 'bold', color: '#64748b' }}>
            NÍVEL DE FRICÇÃO (1-10)
          </div>

          {/* PLOTAGEM DOS PONTOS DINÂMICOS */}
          {points.map((point) => (
            <div
              key={point.id}
              title={`${point.name} | C:${point.x} F:${point.y}`}
              style={{
                position: 'absolute',
                left: `${(point.x / 10) * 100}%`,
                bottom: `${(point.y / 10) * 100}%`,
                width: '16px',
                height: '16px',
                backgroundColor: point.y > 7 ? '#ef4444' : '#3b82f6',
                borderRadius: '50%',
                transform: 'translate(-50%, 50%)',
                cursor: 'pointer',
                transition: '0.3s',
                border: '2px solid white',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translate(-50%, 50%) scale(1.5)'}
              onMouseLeave={(e) => e.target.style.transform = 'translate(-50%, 50%) scale(1)'}
            />
          ))}

          {/* QUADRANTES INDICATIVOS */}
          <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '10px', color: '#f87171', fontWeight: 'bold' }}>ZONA CRÍTICA</div>
          <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>ESTABILIDADE</div>
        </div>

        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.8)' }}>
            Processando matriz analítica...
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div> Fricção Severa (>7)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div> Fricção Controlada
        </div>
      </div>
    </div>
  );
}
