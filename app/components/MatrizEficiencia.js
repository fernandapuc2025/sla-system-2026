export default function MatrizEficiencia({ icm, ifo }) {
  // Normaliza os valores para a escala do gráfico (0 a 10)
  const posX = Math.min(Math.max((icm / 10) * 100, 0), 100);
  const posY = Math.min(Math.max(100 - (ifo / 10) * 100, 0), 100);

  return (
    <div style={{ position: 'relative', width: '100%', height: '250px', backgroundColor: '#f1f5f9', border: '2px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Eixos Centrais */}
      <div style={{ position: 'absolute', top: '50%', width: '100%', height: '1px', backgroundColor: '#cbd5e1' }}></div>
      <div style={{ position: 'absolute', left: '50%', height: '100%', width: '1px', backgroundColor: '#cbd5e1' }}></div>

      {/* Labels dos Quadrantes */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>EXCELÊNCIA</div>
      <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', color: '#ef4444', fontWeight: 'bold' }}>CRÍTICO</div>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '10px', color: '#f59e0b', fontWeight: 'bold' }}>ALERTA</div>

      {/* O Ponto da Missão */}
      <div style={{ 
        position: 'absolute', 
        left: `${posX}%`, 
        top: `${posY}%`, 
        width: '14px', 
        height: '14px', 
        backgroundColor: '#ef4444', 
        borderRadius: '50%', 
        border: '3px solid white',
        boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
        transform: 'translate(-50%, -50%)',
        transition: 'all 1s ease-in-out'
      }}></div>
    </div>
  );
}
