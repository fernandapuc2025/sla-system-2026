'use client';
import { useState } from 'react';

export default function NewLesson() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data.analysis || data.error);
    } catch (err) {
      setResult('Erro na conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
      <h2>Nova Análise de Documento</h2>
      <input type="file" onChange={handleFileUpload} disabled={loading} style={{ margin: '20px 0' }} />
      {loading && <p>IA processando e salvando no banco...</p>}
      {result && <div style={{ textAlign: 'left', padding: '20px', backgroundColor: '#f8fafc', whiteSpace: 'pre-wrap' }}>{result}</div>}
    </div>
  );
}
