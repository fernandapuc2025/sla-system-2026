'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export default function MissionAnalytics() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMissions() {
      // Consultamos a VIEW em vez da tabela, para já pegar os cálculos prontos
      const { data, error } = await supabase
        .from('dashboard_analitico_missoes')
        .select('*');

      if (!error && data) setMissions(data);
      setLoading(false);
    }
    loadMissions();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>🌐 Monitoramento de Missões (ICM)</h1>
        <p style={{ color: '#64748b' }}>Análise de Complexidade Multinível e Fricção Acumulada.</p>
      </header>

      {loading ? <p>Calculando indicadores de comando...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {missions.map((m) => (
            <div key={m.id} style={{ 
              backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', 
              overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' 
            }}>
              {/* HEADER DA MISSÃO */}
              <div style={{ padding: '20px', backgroundColor: '#1e293b', color: 'white' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{m.nome_missao}</h3>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Status: {m.status}</span>
              </div>

              {/* DADOS DA VIEW (ROLLUPS) */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>ATORES</p>
                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{m.qtd_atores}</span>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>NÍVEIS DECISÓRIOS</p>
                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{m.qtd_niveis_decisoris}</span>
                  </div>
                </div>

                {/* RESULTADO DA FÓRMULA ICM */}
                <div style={{ 
                  padding: '20px', borderRadius: '12px', border: '2px solid #3b82f6',
                  backgroundColor: '#eff6ff', marginBottom: '20px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#1d4ed8', fontWeight: 'bold' }}>ICM - COMPLEXIDADE</p>
                      <h2 style={{ margin: 0, fontSize: '28px', color: '#1e3a8a' }}>{m.icm_complexidade}</h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#b91c1c', fontWeight: 'bold' }}>SOMA FRICÇÃO</p>
                      <h2 style={{ margin: 0, fontSize: '28px', color: '#991b1b' }}>{m.soma_friccao}</h2>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                   📊 <strong>Ambiente Operacional:</strong> {
                     m.icm_complexidade > 15 ? 'Alta Densidade Institucional' : 'Baixa Densidade'
                   }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
