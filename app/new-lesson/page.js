'use client';
import { useState } from 'react';

export default function NewLesson() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Arquivo selecionado:", file.name);
    setLoading(true);
    setResult('Iniciando envio...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Mudamos para o caminho completo relativo para evitar erro de rota
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      console.log("Resposta do servidor recebida. Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Erro desconhecido');
      }

      const data = await response.json();
      setResult(data.analysis);
      
    } catch (error) {
      console.error("Erro no clique:", error);
      alert("Houve um erro: " + error.message); // Isso vai abrir uma janelinha no seu navegador
      setResult('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📄 Analisador de Lições</h1>
      <div style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', borderRadius: '10px' }}>
        <input type="file" accept="application/pdf" onChange={handleFileUpload} disabled={loading} />
      </div>
      {loading && <p style={{ color: 'blue' }}>⏳ Processando...</p>}
      {result && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
          <strong>Resultado:</strong>
          <p style={{ whiteSpace: 'pre-wrap' }}>{result}</p>
        </div>
      )}
    </div>
  );
}
