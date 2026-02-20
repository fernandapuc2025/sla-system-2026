'use client';
import { useState } from 'react';

export default function NewLesson() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Estilos CSS-in-JS para facilitar
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f4f7f6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      fontFamily: '"Inter", sans-serif',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      width: '100%',
      maxWidth: '700px',
      padding: '30px',
      textAlign: 'center',
    },
    uploadArea: {
      border: `2px dashed ${dragActive ? '#6366f1' : '#e2e8f0'}`,
      borderRadius: '12px',
      padding: '40px',
      backgroundColor: dragActive ? '#f5f7ff' : '#fafafa',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '20px',
    },
    button: {
      backgroundColor: '#6366f1',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontSize: '16px',
      width: '100%',
    },
    resultContainer: {
      marginTop: '30px',
      textAlign: 'left',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      borderLeft: '5px solid #6366f1',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await response.json();
      setResult(data.analysis || data.error);
    } catch (err) {
      setResult('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#1e293b', fontSize: '2.5rem', marginBottom: '10px' }}>
          🤖 Analisador Inteligente
        </h1>
        <p style={{ color: '#64748b' }}>Suba seu PDF e deixe a IA extrair os dados importantes.</p>
      </header>

      <div style={styles.card}>
        <div 
          style={styles.uploadArea}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFileUpload(e); }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📁</div>
          <p style={{ fontWeight: '500', color: '#334155' }}>
            Arraste seu PDF aqui ou clique para selecionar
          </p>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
            id="fileInput"
          />
          <label htmlFor="fileInput" style={{ color: '#6366f1', cursor: 'pointer', textDecoration: 'underline' }}>
            procurar arquivo
          </label>
        </div>

        {loading && (
          <div style={{ margin: '20px 0' }}>
            <div className="spinner"></div>
            <p style={{ color: '#6366f1', fontWeight: 'bold' }}>Analisando documento... Isso leva alguns segundos.</p>
          </div>
        )}

        {result && (
          <div style={styles.resultContainer}>
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>✨ Resultado da Análise:</h3>
            <div style={{ color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {result}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #6366f1;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
