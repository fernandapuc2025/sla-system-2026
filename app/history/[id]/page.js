'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function AnalysisDetail() {
  const { id } = useParams();

  // Dados fictícios que seriam buscados no Supabase usando o ID
  const analysisData = {
    title: "SLA_Logistica_Jan.pdf",
    date: "15 de Fevereiro, 2026",
    category: "Logística",
    sentiment: "Crítico",
    summary: "Atraso de 48h na entrega de componentes eletrônicos devido a falha na triagem do armazém central.",
    originalText: "O envio #4590 sofreu um desvio de rota no dia 12/01... (texto completo do PDF)...",
    aiInsights: [
      "Falha recorrente identificada no armazém central.",
      "Impacto financeiro estimado em R$ 15.000,00.",
      "Recomendação: Implementar conferência automatizada no setor de triagem."
    ]
  };

  return (
    <div style={{ padding: '40px', color: '#1e293b', maxWidth: '1000px', margin: '0 auto' }}>
      {/* VOLTAR */}
      <Link href="/history" style={{ 
        color: '#6366f1', 
        textDecoration: 'none', 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '24px',
        fontWeight: '500' 
      }}>
        ← Voltar para o Histórico
      </Link>

      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '40px' 
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>{analysisData.title}</h1>
          <p style={{ color: '#64748b' }}>Analisado em {analysisData.date} • ID: #{id}</p>
        </div>
        <span style={{
          padding: '8px 16px',
          borderRadius: '20px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {analysisData.sentiment}
        </span>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* COLUNA ESQUERDA: INSIGHTS DA IA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section style={{ 
            backgroundColor: '#ffffff', 
            padding: '24px', 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ marginTop: 0, color: '#6366f1' }}>💡 Resumo Executivo</h3>
            <p style={{ lineHeight: '1.6', color: '#475569' }}>{analysisData.summary}</p>
          </section>

          <section style={{ 
            backgroundColor: '#f8fafc', 
            padding: '24px', 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0' 
          }}>
            <h3 style={{ marginTop: 0 }}>🔍 Insights de Melhoria</h3>
            <ul style={{ paddingLeft: '20px', color: '#475569', lineHeight: '1.8' }}>
              {analysisData.aiInsights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* COLUNA DIREITA: TEXTO ORIGINAL */}
        <section style={{ 
          backgroundColor: '#ffffff', 
          padding: '24px', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          <h3 style={{ marginTop: 0 }}>📄 Texto Extraído do PDF</h3>
          <p style={{ 
            fontSize: '13px', 
            color: '#94a3b8', 
            lineHeight: '1.6', 
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace' 
          }}>
            {analysisData.originalText}
          </p>
        </section>

      </div>

      {/* BOTÕES DE AÇÃO */}
      <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
        <button style={{
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>Exportar PDF</button>
        <button style={{
          backgroundColor: 'white',
          color: '#ef4444',
          border: '1px solid #ef4444',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>Excluir Registro</button>
      </div>
    </div>
  );
}
