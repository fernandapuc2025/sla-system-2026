'use client';
import { useState } from 'react';

export default function History() {
  // Dados fictícios que serão substituídos pelos do Supabase brevemente
  const [historyData] = useState([
    { id: 1, name: 'SLA_Logistica_Jan.pdf', date: '2026-02-15', category: 'Logística', sentiment: 'Crítico' },
    { id: 2, name: 'Analise_TI_Final.pdf', date: '2026-02-14', category: 'TI', sentiment: 'Positivo' },
    { id: 3, name: 'Feedback_Operacional.pdf', date: '2026-02-12', category: 'Operações', sentiment: 'Neutro' },
    { id: 4, name: 'Contrato_Fornecedor_X.pdf', date: '2026-02-10', category: 'Jurídico', sentiment: 'Atenção' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = historyData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (sentiment) => {
    switch (sentiment) {
      case 'Crítico': return { bg: '#fee2e2', text: '#991b1b' };
      case 'Positivo': return { bg: '#dcfce7', text: '#166534' };
      case 'Atenção': return { bg: '#fef9c3', text: '#854d0e' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  return (
    <div style={{ padding: '40px', color: '#1e293b' }}>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Histórico de Análises</h1>
          <p style={{ color: '#64748b' }}>Consulte e gira todos os documentos processados pela IA.</p>
        </div>
        
        {/* BARRA DE PESQUISA */}
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Pesquisar ficheiro..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 15px 10px 40px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              width: '250px',
              fontSize: '14px'
            }}
          />
          <span style={{ position: 'absolute', left: '12px', top: '10px', opacity: 0.5 }}>🔍</span>
        </div>
      </header>

      {/* TABELA DE HISTÓRICO */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>NOME DO FICHEIRO</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>DATA</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>CATEGORIA</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>ANÁLISE IA</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => {
              const colors = getStatusColor(item.sentiment);
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="table-row">
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>{item.name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{item.date}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{item.category}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: colors.bg,
                      color: colors.text
                    }}>
                      {item.sentiment}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#6366f1', 
                      cursor: 'pointer', 
                      fontWeight: '600',
                      marginRight: '15px' 
                    }}>Ver</button>
                    <button style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#ef4444', 
                      cursor: 'pointer', 
                      fontWeight: '600' 
                    }}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            Nenhum ficheiro encontrado com esse nome.
          </div>
        )}
      </div>

      <style jsx>{`
        .table-row:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
}
