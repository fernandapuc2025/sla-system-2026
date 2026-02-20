'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function HistoryWithFilters() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para os filtros
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');

  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase
        .from('analises')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Preparar os dados fazendo o parse do JSON da IA
        const prepared = data.map(item => {
          try {
            const parsed = JSON.parse(item.insight_ia);
            return { ...item, ia: parsed };
          } catch (e) {
            return { ...item, ia: {} };
          }
        });
        setRecords(prepared);
        setFilteredRecords(prepared);
      }
      setLoading(false);
    }
    fetchHistory();
  }, []);

  // Lógica de Filtragem
  useEffect(() => {
    let result = records;

    if (search) {
      result = result.filter(r => 
        r.nome_arquivo.toLowerCase().includes(search.toLowerCase()) || 
        r.ia.titulo_sintetico?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategory !== 'Todos') {
      result = result.filter(r => r.ia.categoria_licao === filterCategory);
    }

    if (filterStatus !== 'Todos') {
      result = result.filter(r => r.sentimento === filterStatus);
    }

    setFilteredRecords(result);
  }, [search, filterCategory, filterStatus, records]);

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b' }}>🗄️ Repositório de Inteligência</h1>
        <p style={{ color: '#64748b' }}>Gestão e consulta de relatos operacionais processados.</p>
      </header>

      {/* BARRA DE FILTROS */}
      <div style={{ 
        display: 'flex', gap: '15px', marginBottom: '30px', padding: '20px', 
        backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' 
      }}>
        <input 
          type="text" 
          placeholder="Pesquisar por título ou ficheiro..." 
          style={{ flex: 2, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select 
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="Todos">Todas as Categorias</option>
          <option value="Comando e Controle (C2)">Comando e Controle (C2)</option>
          <option value="Logística">Logística</option>
          <option value="Inteligência">Inteligência</option>
          <option value="Doutrina">Doutrina</option>
        </select>

        <select 
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="Todos">Todos os Status</option>
          <option value="Crítico">Crítico</option>
          <option value="Atenção">Atenção</option>
          <option value="Normal">Normal</option>
        </select>
      </div>

      {/* LISTA DE RESULTADOS */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {loading ? <p>A carregar base de dados...</p> : 
         filteredRecords.map((record) => (
          <Link key={record.id} href={`/history/${record.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ 
              backgroundColor: 'white', padding: '20px', borderRadius: '12px', 
              border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', transition: '0.2s'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>
                  {record.ia.titulo_sintetico || record.nome_arquivo}
                </h4>
                <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#64748b' }}>
                  <span>📅 {new Date(record.created_at).toLocaleDateString()}</span>
                  <span>📂 {record.ia.categoria_licao || 'S/ Cat'}</span>
                  <span>📊 Fricção: {record.ia.indicador_friccao}/10</span>
                </div>
              </div>
              
              <div style={{ 
                padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                backgroundColor: record.sentimento === 'Crítico' ? '#fee2e2' : '#f1f5f9',
                color: record.sentimento === 'Crítico' ? '#991b1b' : '#64748b'
              }}>
                {record.sentimento?.toUpperCase()}
              </div>
            </div>
          </Link>
        ))}
        {!loading && filteredRecords.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Nenhum relato corresponde aos filtros aplicados.</p>
        )}
      </div>
    </div>
  );
}
