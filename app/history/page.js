'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getHistory() {
      const { data } = await supabase.from('analises').select('*').order('created_at', { ascending: false });
      setData(data || []);
      setLoading(false);
    }
    getHistory();
  }, []);

  return (
    <div>
      <h1>Histórico</h1>
      <table style={{ width: '100%', backgroundColor: 'white', borderRadius: '8px' }}>
        <thead><tr style={{ textAlign: 'left' }}><th>Arquivo</th><th>Data</th><th>Ação</th></tr></thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.nome_arquivo}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td><Link href={`/history/${item.id}`}>Ver Detalhes</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
