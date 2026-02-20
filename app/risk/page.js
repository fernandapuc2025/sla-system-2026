'use client';
import { useState } from 'react';

export default function RiskPanel() {
  // Mock de dados que viriam do Supabase
  const riskMissions = [
    { id: 1, name: 'Operação Ágata', complex: 8, friction: 9, status: 'Crítico', zone: 'Fronteira Norte' },
    { id: 2, name: 'Missão de Paz UN', complex: 9, friction: 4, status: 'Estável', zone: 'Teatro Leste' },
    { id: 3, name: 'Apoio Humanitário', complex: 4, friction: 7, status: 'Sensível', zone: 'Zona Costeira' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Crítico': return { bg: '#fee2e2', text: '#991b1b', border: '#f87171' };
      case 'Sensível': return { bg: '#fef9c3', text: '#854d0e', border: '#fbbf24' };
      default: return { bg: '#dcfce7', text: '#166534', border: '#4ade80' };
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ marginBottom: '35px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
          🚨 Painel de Risco Operacional
        </h1>
        <p style={{ color: '#64748b', marginTop: '5px' }}>Identificação de Zonas Críticas e Alerta de Instabilidade Decisória.</p>
      </header>

      {/* FILTROS RÁPIDOS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {['Todos', 'Zonas Críticas', 'Ambientes Sensíveis', 'Estáveis'].map(filter => (
          <button key={filter} style={{ 
            padding: '8px 16px', borderRadius: '20px', border: '1px solid #e2e8f0', 
            backgroundColor: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: '600'
          }}>
            {filter}
          </button>
        ))}
      </div>

      {/* GRID DE CARDS DE RISCO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
        {riskMissions.map((m) => {
          const colors = getStatusColor(m.status);
          return (
            <div key={m.id} style={{ 
              backgroundColor: 'white', borderRadius: '16px', border: `1px solid ${colors.border}`,
              padding: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{m.name}</h3>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>{m.zone}</span>
                </div>
                <span style={{ 
                  padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                  backgroundColor: colors.bg, color: colors.text, textTransform: 'uppercase'
                }}>
                  {m.status}
                </span>
              </div>

              {/* BARRA DE COMPLEXIDADE (ICM) */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                  <span style={{ color: '#64748b' }}>Complexidade Estrutural (ICM)</span>
                  <span style={{ fontWeight: 'bold' }}>{m.complex}/10</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}>
                  <div style={{ width: `${m.complex * 10}%`, height: '100%', backgroundColor: '#1e293b', borderRadius: '3px' }}></div>
                </div>
              </div>

              {/* BARRA DE FRICÇÃO (IFR) */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                  <span style={{ color: '#64748b' }}>Fricção Operacional Emergente</span>
                  <span style={{ fontWeight: 'bold' }}>{m.friction}/10</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}>
                  <div style={{ width: `${m.friction * 10}%`, height: '100%', backgroundColor: '#ef4444', borderRadius: '3px' }}></div>
                </div>
              </div>

              <button style={{ 
                width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc', color: '#1e293b', fontWeight: 'bold', fontSize: '13px',
                cursor: 'pointer'
              }}>
                Ver Análise Detalhada
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
