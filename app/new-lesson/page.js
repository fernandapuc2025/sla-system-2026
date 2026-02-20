'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IngestaoIA() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecione um documento PDF.");

    setLoading(true);
    setMessage('Iniciando Processamento de Inteligência...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Esta rota agora dispara a análise relacional do Gemini
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Sucesso! Dados distribuídos na Arquitetura Consolidada.');
        setTimeout(() => router.push('/missions'), 2000);
      } else {
        setMessage('❌ Erro: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Falha na comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '10px' }}>📄 Ingestão de Inteligência</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>
          Suba relatórios operacionais (PDF). A IA irá identificar a Missão, Atores, Decisões, Fricção e Lições Aprendidas automaticamente.
        </p>

        <form onSubmit={handleUpload}>
          <div style={{ 
            border: '2px dashed #cbd5e1', padding: '30px', borderRadius: '12px', 
            textAlign: 'center', marginBottom: '20px', backgroundColor: '#f8fafc' 
          }}>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'block', margin: '0 auto' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '15px', borderRadius: '10px', border: 'none', 
              backgroundColor: loading ? '#94a3b8' : '#2563eb', color: 'white', 
              fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px'
            }}
          >
            {loading ? 'Processando Documento...' : 'Analisar e Alimentar Bancos'}
          </button>
        </form>

        {message && (
          <div style={{ 
            marginTop: '20px', padding: '15px', borderRadius: '8px', 
            backgroundColor: message.includes('✅') ? '#ecfdf5' : '#fef2f2',
            color: message.includes('✅') ? '#065f46' : '#991b1b',
            fontSize: '14px', fontWeight: '500', textAlign: 'center'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
