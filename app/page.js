'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- LÓGICA DO ALGORITMO PRESCRITIVO ---
function gerarPrescricao(icm, ifo) {
  if (ifo > 7 && icm >= 5) {
    return {
      titulo: "🚨 ALERTA DE FADIGA INSTITUCIONAL",
      diagnostico: "Missão de alta complexidade atingiu limite crítico de resistência operacional.",
      sugestao: "Intervenção de nível estratégico necessária. Sugere-se a criação de um Gabinete de Crise e centralização temporária das decisões para reduzir o IFO.",
      cor: "#ef4444", bg: "#fef2f2"
    };
  }
  if (ifo > 7 && icm < 5) {
    return {
      titulo: "⚠️ ALERTA DE INEFICIÊNCIA ADMINISTRATIVA",
      diagnostico: "A missão apresenta baixa complexidade estrutural, porém o índice de fricção está elevado.",
      sugestao: "Recomenda-se auditoria nos fluxos de comunicação interna e simplificação de ritos burocráticos. Possível gargalo em atores específicos.",
      cor: "#f59e0b", bg: "#fffbeb"
    };
  }
  if (ifo <= 4 && icm >= 6) {
    return {
      titulo: "✅ DIAGNÓSTICO DE ALTA PERFORMANCE",
      diagnostico: "Gestão robusta. A alta complexidade está sendo mitigada por processos eficazes.",
      sugestao: "Documentar procedimentos atuais como 'Boas Práticas' para replicação em outras missões de mesmo ICM.",
      cor: "#10b981", bg: "#ecfdf5"
    };
  }
  return {
    titulo: "🧭 ESTABILIDADE OPERACIONAL",
    diagnostico: "Missão dentro dos parâmetros normais de governança.",
    sugestao: "Manter monitoramento rotineiro através do SEAG. Nenhuma intervenção imediata é necessária.",
    cor: "#3b82f6", bg: "#eff6ff"
  };
}

// --- COMPONENTE DA UI DO PAINEL PRESCRITIVO ---
const PainelPrescritivo = ({ icm, ifo }) => {
  const prescricao = gerarPrescricao(icm, ifo);
  return (
    <div style={{ 
      backgroundColor: prescricao.bg, padding: '25px', borderRadius: '12px', 
      borderLeft: `8px solid ${prescricao.cor}`, boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      marginTop: '20px'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: '900', color: prescricao.cor, margin: '0 0 10px 0' }}>{prescricao.titulo}</h2>
      <p style={{ fontSize: '14px', color: '#475569', marginBottom: '10px' }}><strong>Diagnóstico:</strong> {prescricao.diagnostico}</p>
      <p style={{ fontSize: '15px', color: '#1e293b', fontWeight: '600' }}><em>" {prescricao.sugestao} "</em></p>
    </div>
  );
};

export default function DashboardSEAG() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: result, error } = await supabase
        .from('dashboard_seag')
        .select('*')
        .order('missao_id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (result) setData(result);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando Inteligência SEAG...</div>;

  // Valores padrão caso o banco esteja vazio
  const icm = data?.icm_calculado || 0;
  const ifo = data?.ifo_total || 0;
  const missaoNome = data?.nome_missao || "Missão não identificada";

  const chartData = [{ x: icm, y: ifo, name: missaoNome }];

  return (
    <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '40px', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>Command Center SEAG</h1>
        <p style={{ color: '#64748b' }}>SISTEMA DE ESTRUTURAÇÃO ANALÍTICA DE GOVERNANÇA | <strong>INTELLIGOV 2026</strong></p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        
        {/* LADO ESQUERDO: MATRIZ DE EFICIÊNCIA */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: '700' }}>MATRIZ DE EFICIÊNCIA (ICM vs IFO)</h3>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="ICM" unit="" domain={[0, 10]} label={{ value: 'Complexidade (ICM)', position: 'bottom' }} />
                <YAxis type="number" dataKey="y" name="IFO" unit="" domain={[0, 10]} label={{ value: 'Fricção (IFO)', angle: -90, position: 'left' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                
                {/* Quadrantes */}
                <ReferenceLine x={5} stroke="gray" strokeDasharray="5 5" />
                <ReferenceLine y={5} stroke="gray" strokeDasharray="5 5" />
                
                <Scatter name="Missão Atual" data={chartData} fill="#ef4444">
                  <LabelList dataKey="name" position="top" />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LADO DIREITO: KPIS E PRESCRIÇÃO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#1e293b', color: '#fff', padding: '20px', borderRadius: '12px' }}>
            <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>MISSÃO ATUAL</p>
            <h2 style={{ fontSize: '18px', margin: '5px 0 15px 0' }}>{missaoNome}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{icm.toFixed(1)}</p>
                <p style={{ fontSize: '10px', opacity: 0.7 }}>ÍNDICE ICM</p>
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{ifo.toFixed(1)}</p>
                <p style={{ fontSize: '10px', opacity: 0.7 }}>ÍNDICE IFO</p>
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{data?.total_atores || 0}</p>
                <p style={{ fontSize: '10px', opacity: 0.7 }}>ATORES</p>
              </div>
            </div>
          </div>

          <PainelPrescritivo icm={icm} ifo={ifo} />
        </div>
      </div>

      <footer style={{ marginTop: '50px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
        © 2026 INTELLIGOV - Protocolo de Inteligência SEAG | Todos os direitos reservados.
      </footer>
    </main>
  );
}
