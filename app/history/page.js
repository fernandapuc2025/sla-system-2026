'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // BUSCAR DADOS DO SUPABASE
  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data, error } = await supabase
          .from('analises')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHistoryData(data || []);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const filteredData = historyData.filter(item => 
    item.nome_arquivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (sentiment) => {
    const s = sentiment?.toLowerCase();
    if (s?.includes('crítico')) return { bg: '#fee2e2', text: '#991b1b' };
    if (s?.includes('positivo')) return { bg: '#dcfce7', text: '#166534' };
    if (s?.includes('atenção')) return { bg: '#fef9c3', text: '#854d0e' };
    return { bg: '#f1f5f9', text: '#475569' };
  };

  return (
    <div style={{ padding: '40px', color: '#1e293b' }}>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Histórico de Análises</h1>
          <p style={{ color: '#64748b' }}>Dados reais vindos do seu banco de dados Supabase.</p>
        </div>
        
        <input 
          type="text" 
          placeholder="Pesquisar por nome..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '250px' }}
        />
      </header>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>ARQUIVO</th>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>DATA</th>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>CATEGORIA</th>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>SENTIMENTO</th>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>AÇÃO</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>Carregando dados...</td></tr>
            ) : filteredData.map((item) => {
              const colors = getStatusColor(item.sentimento);
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>{item.nome_arquivo}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>
                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{item.categoria}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: colors.bg, color: colors.text }}>
                      {item.sentimento}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Link href={`/history/${item.id}`} style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
