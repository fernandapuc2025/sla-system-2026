'use client';

export default function LessonsLearned() {
  const lessons = [
    { 
      id: 1, 
      category: 'Coordenação Civil-Militar', 
      title: 'Interoperabilidade de Comunicações', 
      applicability: 'Planejamento / Treinamento',
      relevance: 'Alta',
      description: 'Estabelecer protocolo único de rádio entre ONGs e forças militares antes do desdobramento para evitar "blackouts" informacionais.'
    },
    { 
      id: 2, 
      category: 'Logística', 
      title: 'Gestão de Suprimentos em Zonas de Conflito', 
      applicability: 'Operações Futuras',
      relevance: 'Média',
      description: 'Uso de hubs logísticos em países vizinhos reduz a fricção alfandegária em 30% em missões de curto prazo.'
    },
    { 
      id: 3, 
      category: 'Governança', 
      title: 'Alinhamento de Mandatos Multiníveis', 
      applicability: 'Doutrina',
      relevance: 'Crítica',
      description: 'Definição clara das ROE (Regras de Engajamento) para proteção de civis deve ser validada por todos os atores do nível Estratégico.'
    }
  ];

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: 0 }}>📚 Lições Aprendidas</h1>
        <p style={{ color: '#64748b', marginTop: '5px' }}>Memória Organizacional: O aprendizado consolidado para apoio ao planejamento futuro.</p>
      </header>

      {/* GRID DE LIÇÕES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '25px' }}>
        {lessons.map((lesson) => (
          <div key={lesson.id} style={{ 
            backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', 
            padding: '24px', position: 'relative', overflow: 'hidden'
          }}>
            {/* TAG DE RELEVÂNCIA */}
            <div style={{ 
              position: 'absolute', top: '15px', right: '15px', padding: '4px 10px', 
              borderRadius: '20px', fontSize: '10px', fontWeight: 'bold',
              backgroundColor: lesson.relevance === 'Crítica' ? '#fee2e2' : '#f1f5f9',
              color: lesson.relevance === 'Crítica' ? '#991b1b' : '#64748b'
            }}>
              RELEVÂNCIA {lesson.relevance.toUpperCase()}
            </div>

            <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: '800', textTransform: 'uppercase' }}>
              {lesson.category}
            </span>
            <h3 style={{ margin: '10px 0', fontSize: '18px', color: '#0f172a' }}>{lesson.title}</h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
              {lesson.description}
            </p>

            <div style={{ paddingTop: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                🎯 <strong>Aplicar em:</strong> {lesson.applicability}
              </span>
              <button style={{ 
                backgroundColor: 'transparent', border: 'none', color: '#6366f1', 
                fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' 
              }}>
                Ver Relato Origem →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
