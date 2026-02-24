export default function PainelPrescritivo({ icm, ifo }) {
  let titulo = "ESTABILIDADE";
  let cor = "#3b82f6";
  let texto = "Missão operando dentro dos parâmetros normais. Continue o monitoramento.";

  if (ifo > 7) {
    titulo = "ALERTA: ALTA FRICÇÃO";
    cor = "#ef4444";
    texto = "Intervenção sugerida: Identificamos gargalos decisórios. Recomenda-se centralizar o comando temporariamente.";
  } else if (icm > 7) {
    titulo = "COMPLEXIDADE ELEVADA";
    cor = "#8b5cf6";
    texto = "Estrutura multinível densa. Recomenda-se simplificar os marcos legais aplicados.";
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: `6px solid ${cor}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <h4 style={{ margin: 0, color: cor, fontSize: '14px', fontWeight: '900' }}>{titulo}</h4>
      <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#1e293b', lineHeight: '1.5' }}>
        <strong>Recomendação SEAG:</strong> {texto}
      </p>
    </div>
  );
}
