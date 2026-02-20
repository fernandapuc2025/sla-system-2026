'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function OperationalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      // Busca os relatos salvos no Supabase
      const { data, error } = await supabase
        .from('analises')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setRecords(data);
      setLoading(false);
    }
    fetchRecords();
  }, []);

  const getSeverityStyle = (sentiment) => {
    return sentiment === 'Crítico' 
      ? { color: '#ef4444', bg: '#fef2f2', label: 'ALTA' } 
      : { color: '#64748b', bg: '#f8fafc', label: 'NORMAL' };
  };

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: 0 }}>🧠 Relatos Operacionais</h1>
        <p style={{ color: '#64748b', marginTop: '5px' }}>Camada Empírica: Registro sistemático de incidentes e níveis de fricção.</p>
      </header>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '20px', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>DATA / HORA</th>
              <th style={{ padding: '20px', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>TÍTULO DO RELATO</th>
              <th style={{ padding: '20px', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>SEVERIDADE</th>
              <th style={{ padding: '20px', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>AÇÃO</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Carregando base empírica...</td></tr>
            ) : records.map((rec) => {
              const style = getSeverityStyle(rec.sentimento);
              return (
                <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                  <td style={{ padding: '20px', fontSize: '13px', color: '#64748b' }}>
                    {new Date(rec.created_at).toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '20px', fontWeight: '600', color: '#0f172a' }}>
                    {rec.nome_arquivo.replace('.pdf', '')}
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800',
                      backgroundColor: style.bg, color: style.text 
                    }}>
                      {style.label}
                    </span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <Link href={`/history/${rec.id}`} style={{ 
                      color: '#6366f1', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' 
                    }}>
                      Analisar Fricção →
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
