'use client';
import { useState } from 'react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('AIza***************************');

  const sections = [
    { title: 'Perfil', desc: 'Gerencie suas informações pessoais.' },
    { title: 'Integrações', desc: 'Configure as chaves de API do Google Gemini.' },
    { title: 'Segurança', desc: 'Gerencie sua senha e sessões ativas.' }
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '900px', color: '#1e293b' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Configurações</h1>
        <p style={{ color: '#64748b' }}>Ajuste as preferências do seu sistema de análise.</p>
      </header>

      <div style={{ display: 'grid', gap: '24px' }}>
        {/* CARD PERFIL */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Perfil do Usuário</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '15px' }}>
            <div style={styles.avatar}>F</div>
            <div>
              <p style={{ fontWeight: '600', margin: 0 }}>Fernanda</p>
              <p style={{ color: '#64748b', fontSize: '14px' }}>fernanda@puc2025.com</p>
            </div>
            <button style={styles.btnSecondary}>Editar</button>
          </div>
        </div>

        {/* CARD API */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Google Gemini API</h3>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>
            Chave utilizada para o processamento de IA nos documentos.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="password" 
              value={apiKey} 
              readOnly 
              style={styles.input}
            />
            <button style={styles.btnPrimary}>Atualizar Chave</button>
          </div>
        </div>

        {/* NOTIFICAÇÕES */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Preferências</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked /> Receber resumo semanal por e-mail
          </label>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  cardTitle: { margin: 0, fontSize: '18px', fontWeight: '600' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' },
  input: { flexGrow: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b' },
  btnPrimary: { backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  btnSecondary: { backgroundColor: 'transparent', color: '#6366f1', border: '1px solid #6366f1', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginLeft: 'auto' }
};
