'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'; 
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';

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

// --- LÓGICA DE MOMENTUM (TENDÊNCIA) ---
function calcularTendencia(ifoAtual, ifoAnterior) {
  if (ifoAnterior === null || ifoAnterior === undefined) {
    return { cor: "#64748b", label: "Estável (Primeira Análise)", icone: "●", alerta: "Iniciando série histórica." };
  }

  const variacao = ((ifoAtual - ifoAnterior) / ifoAnterior) * 100;

  if (variacao > 15) {
    return {
      cor: "#ef4444",
      label: `Degradação Crítica (+${variacao.toFixed(1)}%)`,
      icone: "▲",
      alerta: "A resistência institucional está aumentando. Risco de paralisia."
    };
  } else if (variacao < -15) {
    return {
      cor: "#10b981",
      label: `Melhora Significativa (${variacao.toFixed(1)}%)`,
      icone: "▼",
      alerta: "A governança está se estabilizando. Fluxos desimpedidos."
    };
  }

  return { cor: "#3b82f6", label: "Estabilidade Operacional", icone: "●", alerta: "Oscilação dentro da margem de segurança." };
}

// --- COMPONENTES DA UI ---
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

const PainelTendencia = ({ ifoAtual, ifoAnterior }) => {
  const t = calcularTendencia(ifoAtual, ifoAnterior);
  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', 
      backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0',
      marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      <div style={{ fontSize: '30px', color: t.cor, fontWeight: 'bold' }}>{t.icone}</div>
      <div>
        <p style={{ margin: 0, fontSize: '10px', fontWeight: 'black', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Momentum de Eficiência ($\Delta M$)</p>
        <p style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: t.cor }}>{t.label}</p>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>{t.alerta}</p>
      </div>
    </div>
  );
};

export default function DashboardSEAG() {
  const [dataAtual, setDataAtual] = useState(null);
  const [ifoAnterior, setIfoAnterior] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Busca os 2 últimos registros para calcular tendência
      const { data: result, error } = await supabase
        .from('dashboard_seag')
        .select('*')
        .order('missao_id', { ascending: false })
        .limit(2);

      if (result && result.length > 0) {
        setDataAtual(result[0]);
        if (result.length > 1) {
          setIfoAnterior(result[1].ifo_total);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>Sincronizando Núcleo Ontológico SEAG...</div>;

  const icm = dataAtual?.icm_calculado || 0;
  const ifo = dataAtual?.ifo_total || 0;
  const missaoNome = dataAtual?.nome_missao || "Missão não identificada";

  return (
    <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
      <header style={{ marginBottom: '40px', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Command Center SEAG</h1>
          <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>SISTEMA DE ESTRUTURAÇÃO ANALÍTICA DE GOVERNANÇA | <strong>INTELLIGOV 2026</strong></p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 'bold', color: '#1e293b', backgroundColor: '#e2e8f0', padding: '5px 15px', borderRadius: '20px' }}>
          STATUS: OPERACIONAL
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
        
        {/* COLUNA ESQUERDA: MATRIZ */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '800', color: '#1e293b', fontSize: '16px', letterSpacing: '1px' }}>MATRIZ DE EFICIÊNCIA (ICM vs IFO)</h3>
          <div style={{ width: '100%', height: 450 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="x" name="ICM" domain={[0, 10]} label={{ value: 'Complexidade (ICM)', position: 'bottom', offset: 0, fontSize: 12 }} />
                <YAxis type="number" dataKey="y" name="IFO" domain={[0, 10]} label={{ value: 'Fricção (IFO)', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                
                <ReferenceLine x={5} stroke="#cbd5e1" strokeWidth={1} />
                <ReferenceLine y={5} stroke="#cbd5e1" strokeWidth={1} />
                
                <Scatter name="Missão Atual" data={[{ x: icm, y: ifo, name: missaoNome }]} fill="#ef4444">
                  <LabelList dataKey="name" position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>
            <span>← BAIXA COMPLEXIDADE</span>
            <span>ALTA COMPLEXIDADE →</span>
          </div>
        </div>

        {/* COLUNA DIREITA: INTELIGÊNCIA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ background: '#1e293b', color: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '10px', opacity: 0.6, margin: 0, fontWeight: 'bold', letterSpacing: '1px' }}>DADOS CONSOLIDADOS</p>
            <h2 style={{ fontSize: '20px', margin: '5px 0 20px 0', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>{missaoNome}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '28px', fontWeight: '900', margin: 0, color: '#60a5fa' }}>{icm.toFixed(1)}</p>
                <p style={{ fontSize: '10px', opacity: 0.7, fontWeight: 'bold' }}>ICM</p>
              </div>
              <div>
                <p style={{ fontSize: '28px', fontWeight: '900', margin: 0, color: '#f87171' }}>{ifo.toFixed(1)}</p>
                <p style={{ fontSize: '10px', opacity: 0.7, fontWeight: 'bold' }}>IFO</p>
              </div>
              <div>
                <p style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>{dataAtual?.total_atores || 0}</p>
                <p style={{ fontSize: '10px', opacity: 0.7, fontWeight: 'bold' }}>ATORES</p>
              </div>
            </div>
          </div>

          <PainelTendencia ifoAtual={ifo} ifoAnterior={ifoAnterior} />
          <PainelPrescritivo icm={icm} ifo={ifo} />
          
          <div style={{ marginTop: 'auto', padding: '15px', backgroundColor: '#f1f5f9', borderRadius: '10px', fontSize: '11px', color: '#475569', border: '1px dashed #cbd5e1' }}>
            <strong>Nota Técnica:</strong> Os índices ICM e IFO são recalibrados a cada novo evento processado pelo motor de IA.
          </div>
        </div>
      </div>

      <footer style={{ marginTop: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '11px', letterSpacing: '1px' }}>
        © 2026 INTELLIGOV | PROTOCOLO SEAG DE GOVERNANÇA ONTOLÓGICA
      </footer>
    </main>
  );
}
