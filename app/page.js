'use client';
import { useState } from 'react';

export default function NewLesson() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setResult('Lendo PDF e consultando a IA... aguarde.');

    // Criamos um "envelope" para enviar o arquivo
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Aqui chamamos uma função interna que vamos criar no próximo passo
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data.analysis || 'Não foi possível analisar o documento.');
    } catch (error) {
      setResult('Erro ao processar o arquivo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📄 Nova Lição Aprendida</h1>
      <p>Suba um relatório em PDF para a IA identificar aprendizados e recomendações.</p>
      
      <div style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', borderRadius: '10px', marginBottom: '20px' }}>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileUpload} 
          disabled={loading}
        />
      </div>

      {loading && <div style={{ color: 'blue' }}>⏳ Processando... Isso pode levar alguns segundos.</div>}

      {result && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
          <h3>🧠 Análise da IA:</h3>
          {result}
        </div>
      )}
    </div>
  );
}
