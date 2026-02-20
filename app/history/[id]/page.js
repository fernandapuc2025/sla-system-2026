'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function Detail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function getItem() {
      const { data } = await supabase.from('analises').select('*').eq('id', id).single();
      setItem(data);
    }
    getItem();
  }, [id]);

  if (!item) return <p>Carregando...</p>;

  return (
    <div>
      <h1>{item.nome_arquivo}</h1>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px' }}>
        <h3>Parecer da IA:</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>{item.insight_ia}</p>
      </div>
    </div>
  );
}
