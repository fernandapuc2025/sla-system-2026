'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';

export default function RecordDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      const { data, error } = await supabase
        .from('analises')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        // Fazemos o parse do JSON que guardámos na coluna insight_ia
        try {
          data.parsedIA = JSON.parse(data.insight_ia);
        } catch (e) {
          data.parsedIA = null;
        }
        setRecord(data);
      }
      setLoading(false);
    }
    fetchDetails();
  }, [id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>A processar ficha de inteligência...</div>;
  if (!record) return <div style={{ padding: '40px', textAlign: 'center' }}>Relato não encontrado.</div>;

  const ia = record.parsedIA;

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#6366f1', fontWeight: 'bold' }}>
        ← Voltar ao Repositório
      </button>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        
        {/* CABEÇALHO DA FICHA */}
        <div style={{ padding: '30px', backgroundColor: '#0f172a', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Ficha de Análise Técnica</span>
              <h1 style={{ margin: '5px 0', fontSize: '24px' }}>{ia?.titulo_sintetico || record.nome_arquivo}</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ padding: '5px 15px', borderRadius: '20px', backgroundColor: ia?.sentimento === 'Crítico' ? '#ef4444' : '#1e293b', fontSize: '12px', fontWeight: 'bold' }}>
                STATUS: {ia?.sentimento?.toUpperCase() || 'NORMAL'}
              </div>
            </div>
          </div>
        </div>

        {/* CORPO DA ANÁLISE */}
        <div style={{ padding: '30px' }}>
          
          {/* INDICADORES QUANTITATIVOS (A BASE DA TESE) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>ÍNDICE DE FRICÇÃO</p>
              <h2 style={{ margin: '10px 0 0 0', fontSize: '32px', color: '#ef4444' }}>{ia?.indicador_friccao}/10</h2>
            </div>
            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>COMPLEXIDADE ESTRUTURAL</p>
              <h2 style={{ margin: '10px 0 0 0', fontSize: '32px', color: '#3b82f6' }}>{ia?.indicador_complexidade}/10</h2>
            </div>
            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>NÍVEL DECISÓRIO</p>
              <h2 style={{ margin: '10px 0 0 0', fontSize: '18px', color: '#1e293b', paddingTop: '12px' }}>{ia?.nivel_decisorio?.toUpperCase()}</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
            {/* COLUNA ESQUERDA: PARECER */}
            <div>
              <section style={{ marginBottom: '30px' }}>
                <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', fontSize: '16px' }}>Parecer Técnico Académico</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap' }}>
                  {ia?.parecer_tecnico || "Análise detalhada não disponível."}
                </p>
              </section>

              <section style={{ padding: '20px', backgroundColor: '#ecfdf5', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                <h3 style={{ marginTop: 0, fontSize: '16px', color: '#065f46' }}>Diretriz de Mitigação</h3>
                <p style={{ fontSize: '14px', color: '#065f46', margin: 0 }}>{ia?.recomendacao_mitigacao}</p>
              </section>
            </div>

            {/* COLUNA DIREITA: METADADOS */}
            <div>
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0' }}>ATORES IDENTIFICADOS</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ia?.atores_envolvidos?.map((ator, i) => (
                    <span key={i} style={{ padding: '4px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                      {ator}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#94a3b8' }}>CATEGORIA DOUTRINÁRIA</p>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{ia?.categoria_licao}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
