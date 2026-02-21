'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const dynamic = 'force-dynamic';

export default function AnalyticsMatrix() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChartData() {
      // Busca a fricção dos relatos e o ICM calculado da missão vinculada
      const { data, error } = await supabase
        .from('relatos_operacionais')
        .select(`
          id, 
          titulo_relato, 
          pontuacao_friccao, 
          missoes (
            nome_missao
          )
        `);

      // Como o ICM é uma fórmula complexa, buscamos também na View para precisão
      const { data: viewData } = await supabase
        .from('dashboard_analitico_missoes')
        .select('id, icm_complexidade');

      if (!error && data && viewData) {
        const mappedPoints = data.map(relato => {
          // Encontra a complexidade da missão correspondente na View
          const missaoAnalise = viewData.find(v => v.id === relato.missao_id);
          
          return {
            id: relato.id,
            name: relato.titulo_relato,
            missao: relato.missoes?.nome_missao,
            x: missaoAnalise?.icm_complexidade || 5, // Eixo X: Complexidade
            y: relato.pontuacao_friccao || 0,        // Eixo Y: Fricção
          };
        });
        setPoints(mappedPoints);
      }
      setLoading(false);
    }
    loadChartData();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b' }}>📊 Matriz de Fricção vs Complexidade</h1>
        <p style={{ color: '#64748b' }}>Posicionamento de incidentes baseado no ICM da Missão e na Fricção do Relato.</p>
      </header>

      <div style={{ 
        backgroundColor: 'white', padding: '40px', borderRadius: '20px', 
        border: '1px solid #e2e8f0', position: 'relative', height: '600px',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
      }}>
        {/* EIXOS */}
        <div style={{ position: 'absolute', left: '60px', bottom: '60px', right: '40px', top: '40px', borderLeft: '2px solid #cbd5e1', borderBottom: '2px solid #cbd5e1' }}>
          
          {/* MAPEAR PONTOS */}
          {points.map((p) => (
            <div
              key={p.id}
              title={`${p.name} [Missão: ${p.missao}]`}
              style={{
                position: 'absolute',
                left: `${(p.x / 30) * 100}%`, // Ajustado para escala ICM até 30
                bottom: `${(p.y / 10) * 100}%`, // Escala Fricção 1-10
                width: '14px',
                height: '14px',
                backgroundColor: p.y > 7 ? '#ef4444' : '#3b82f6',
                borderRadius: '50%',
                transform: 'translate(-50%, 50%)',
                cursor: 'pointer',
                border: '2px solid white'
              }}
            />
          ))}
          
          <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', color: '#64748b', fontSize: '12px' }}>
            ÍNDICE DE COMPLEXIDADE MULTINÍVEL (ICM)
          </div>
        </div>
      </div>
    </div>
  );
}
