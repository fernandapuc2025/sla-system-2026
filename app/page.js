'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

// --- COMPONENTES DE LÓGICA SEAG (Integrados para evitar erros de build) ---

const MatrizEficiencia = ({ icm, ifo }) => {
  // Normalizando os valores para porcentagem (escala de 0 a 10)
  const posX = Math.min(Math.max((icm / 10) * 100, 0), 100);
  const posY = Math.min(Math.max(100 - (ifo / 10) * 100, 0), 100);

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
        
        {/* Linhas dos Eixos (Cruz Central) */}
        <div style={{ position: 'absolute', top: '50%', width: '100%', height: '1px', backgroundColor: '#cbd5e1' }}></div>
        <div style={{ position: 'absolute', left: '50%', height: '100%', width: '1px', backgroundColor: '#cbd5e1' }}></div>

        {/* Labels dos Quadrantes */}
        <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>EXCELÊNCIA</span>
        <span style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '10px', color: '#3b82f6', fontWeight: 'bold' }}>OPERACIONAL</span>
        <span style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '10px', color: '#f59e0b', fontWeight: 'bold' }}>ALERTA</span>
        <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', color: '#ef4444', fontWeight: 'bold' }}>CRÍTICO</span>

        {/* O Ponto da Missão (Onde a mágica acontece) */}
        <div 
          style={{ 
            position: 'absolute', 
            left: `${posX}%`, 
            top: `${posY}%`, 
            width: '16px', 
            height: '16px', 
            backgroundColor: '#ef4444', 
            borderRadius: '50%', 
            border: '3px solid white', 
            boxShadow: '0 0 10px rgba(239,68,68,0.5)', 
            transform: 'translate(-50%, -50%)', 
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 10
          }}
        >
          <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'black', color: 'white', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
            Missão Atual
          </div>
        </div>
      </div>

      {/* Rótulos dos Eixos */}
      <div style={{ display: 'flex', justifyContent: 'space-between', mt: '10px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', paddingTop: '10px' }}>
        <span>← Baixa Complexidade (ICM)</span>
        <span>Alta Complexidade →</span>
      </div>
    </div>
  );
};

const PainelPrescritivo = ({ icm, ifo }) => {
  let titulo = "ESTABILIDADE"; 
  let cor = "#3b82f6";
  let texto = "Missão operando dentro dos parâmetros normais. Continue o monitoramento.";

  if (ifo > 7) {
    titulo = "ALERTA: ALTA FRICÇÃO"; 
    cor = "#ef4444";
    texto = "Intervenção sugerida: Identificamos gargalos decisórios e resistência institucional. Recomenda-se centralizar o comando temporariamente.";
  } else if (icm > 7) {
    titulo = "COMPLEXIDADE ELEVADA"; 
    cor = "#8b5cf6";
    texto = "Estrutura multinível densa detectada. Recomenda-se simplificar os marcos legais ou criar uma força-tarefa de articulação.";
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: `6px solid ${cor}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <h4 style={{ margin: 0, color: cor, fontSize: '14px', fontWeight: '900' }}>{titulo}</h4>
      <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#1e293b', lineHeight: '1.5' }}>
        <strong>Recomendação SEAG:</strong> {texto}
      </p>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

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

      try {
        const { data } = await supabase.from('dashboard_seag').select('*').maybeSingle();
        if (data) {
          setStats({
            icm: data.icm_calculado || 0,
            ifo: data.ifo_total || 0,
            atores: data.total_atores || 0,
            missoes: 1 
          });
        }
      } catch (err) {
        console.error("Aguardando View dashboard_seag no Supabase...");
      }

      setLoading(false);
    }
    checkUserAndFetchData();
  }, [router]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '20px', fontSize: '24px' }}>⌛</div>
          <p style={{ fontSize: '14px', letterSpacing: '1px', fontWeight: 'bold' }}>SINCRONIZANDO NÚCLEO ONTOLÓGICO SEAG...</p>
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
        <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
          STATUS: OPERACIONAL
        </div>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Complexidade (ICM)', val: stats.icm.toFixed(1), color: '#2563eb' },
          { label: 'Atores (A)', val: stats.atores, color: '#1e293b' },
          { label: 'Fricção Total (IFO)', val: stats.ifo.toFixed(1), color: '#ef4444' },
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
          <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>📊 Matriz de Eficiência (ICM vs IFO)</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Posicionamento factual da missão no espectro de governança.</p>
          
          <MatrizEficiencia icm={stats.icm} ifo={stats.ifo} />
        </div>

        {/* COLUNA DIREITA: PRESCRIÇÃO E ALERTAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <PainelPrescritivo icm={stats.icm} ifo={stats.ifo} />

          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', color: 'white' }}>
            <h3 style={{ marginTop: 0, color: '#94a3b8', fontSize: '16px', fontWeight: 'bold' }}>🚨 Log de Eventos Ontológicos</h3>
            <ul style={{ padding: 0, listStyle: 'none', fontSize: '13px' }}>
              <li style={{ padding: '12px 0', borderBottom: '1px solid #334155', color: '#fca5a5' }}>
                • Detecção de Vácuo Decisório em Relatório Analisado.
              </li>
              <li style={{ padding: '12px 0', color: '#93c5fd' }}>
                • Sistema pronto para processar novos fatos via PDF.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
