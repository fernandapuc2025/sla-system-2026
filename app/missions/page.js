'use client';
import { useState } from 'react';

export default function MissionsExplorer() {
  const [filter, setFilter] = useState('Todas');

  const missions = [
    { id: 1, name: 'Missão Alpha-7', type: 'Humanitária', theater: 'África Subsaariana', environment: 'Crise Climática', status: 'Ativa' },
    { id: 2, name: 'Operação Blue Shield', type: 'Peacekeeping', theater: 'Oriente Médio', environment: 'Conflito Identitário', status: 'Encerrada' },
    { id: 3, name: 'Força-Tarefa Delta', type: 'Peacemaking', theater: 'América Latina', environment: 'Instabilidade Institucional', status: 'Em Planejamento' },
    { id: 4, name: 'Resgate Transfronteiriço', type: 'Desastre Natural', theater: 'Sudeste Asiático', environment: 'Evento Climático Extremo', status: 'Ativa' },
  ];

  const filteredMissions = filter === 'Todas' 
    ? missions 
    : missions.filter(m => m.type === filter);

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: 0 }}>🌍 Explorar Missões</h1>
          <p style={{ color: '#64748b', marginTop: '5px' }}>Navegação por Teatro de Operações e Tipologia de Ambiente.</p>
        </div>
        
        {/* FILTRO POR TIPO */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {['Todas', 'Humanitária', 'Peacekeeping', 'Desastre Natural'].map(t => (
            <button 
              key={t} 
              onClick={() => setFilter(t)}
              style={{ 
                padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', 
                backgroundColor: filter === t ? '#1e293b' : 'white', 
                color: filter === t ? 'white' : '#64748b',
                fontSize: '13px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* GRID DE MISSÕES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredMissions.map((m) => (
          <div key={m.id} style={{ 
            backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0',
            overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer'
          }}>
            <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {m.type}
                </span>
                <span style={{ fontSize: '10px', color: m.status === 'Ativa' ? '#10b981' : '#64748b', fontWeight: '800' }}>
                  ● {m.status.toUpperCase()}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{m.name}</h3>
            </div>
            
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>TEATRO</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>{m.theater}</p>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>AMBIENTE OPERACIONAL</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>{m.environment}</p>
              </div>
              <button style={{ 
                width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 'bold', fontSize: '12px'
              }}>
                Acessar Dados da Missão
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
