'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

// Importação dos componentes de lógica SEAG (crie esses arquivos na pasta components)
import MatrizEficiencia from '../components/MatrizEficiencia';
import PainelPrescritivo from '../components/PainelPrescritivo';

export default function CommandCenter() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ icm: 0, ifo: 0, atores: 0, missoes: 0 });
  const router = useRouter();

  useEffect(() => {
    async function checkUserAndFetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // BUSCA DE DADOS REAIS DO SEAG
      // Aqui buscamos da View que criamos no SQL Editor
      const { data, error } = await supabase
        .from('dashboard_seag')
        .select('*')
        .single(); // Pega a missão ativa ou média geral

      if (data) {
        setStats({
          icm: data.icm_calculado || 0,
          ifo: data.ifo_total || 0,
          atores: data.total_atores || 0,
          missoes: 1 // Exemplo estático ou conte do banco
        });
      }

      setLoading(false);
    }
    checkUserAndFetchData();
  }, [router]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>⌛</div>
          <p style={{ fontSize: '14px', letterSpacing: '1px' }}>SINCRONIZANDO NÚCLEO ONTOLÓGICO SEAG...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER DINÂMICO */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 }}>🧭 INTELLIGOV - SEAG</h1>
          <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Estabilização Analítica: Fatos extraídos via IA em tempo real.</p>
        </div>
        <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '12px' }}>
          STATUS: OPERACIONAL
        </div>
      </div>

      {/* KPI CARDS - AGORA COM DADOS REAIS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Complexidade (ICM)', val: stats.icm.toFixed(1), color: '#2563eb' },
          { label: 'Atores (A)', val: stats.atores, color: '#1e293b' },
          { label: 'Fricção Total (IFO)', val: stats.ifo, color: '#ef4444' },
          { label: 'Estabilidade', val: stats.ifo > 7 ? 'CRÍTICA' : 'NOMINAL', color: stats.ifo > 7 ? '#ef4444' : '#10b981' }
        ].map((kpi, i) => (
          <div key={i} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '32px', fontWeight: '800', color: kpi.color }}>{kpi.val}</p>
          </div>
        ))}
      </div>

      {/* ÁREA ANALÍTICA CENTRAL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        
        {/* COLUNA ESQUERDA: MATRIZ DE EFICIÊNCIA */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, fontSize: '18px' }}>📊 Matriz de Eficiência (ICM vs IFO)</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Posicionamento factual da missão no espectro de governança.</p>
          
          {/* O componente gráfico que criamos anteriormente */}
          <MatrizEficiencia icm={stats.icm} ifo={stats.ifo} />
        </div>

        {/* COLUNA DIREITA: PRESCRIÇÃO E ALERTAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Componente de Prescrição Automática */}
          <PainelPrescritivo icm={stats.icm} ifo={stats.ifo} />

          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', color: 'white' }}>
            <h3 style={{ marginTop: 0, color: '#94a3b8', fontSize: '16px' }}>🚨 Log de Eventos Ontológicos</h3>
            <ul style={{ padding: 0, listStyle: 'none', fontSize: '13px' }}>
              <li style={{ padding: '12px 0', borderBottom: '1px solid #334155', color: '#fca5a5' }}>
                • Detecção de Vácuo Decisório em Relatório Analisado.
              </li>
              <li style={{ padding: '12px 0', color: '#93c5fd' }}>
                • Novo Ator identificado no ecossistema: [Nome do Ator].
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
