'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Por agora, vamos apenas simular o login e redirecionar
    // No futuro, conectaremos com o Supabase Auth aqui
    router.push('/');
  };

  return (
    <div style={{ 
      height: '100vh', width: '100vw', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', 
      backgroundColor: '#f1f5f9', position: 'fixed', top: 0, left: 0, zIndex: 9999 
    }}>
      <div style={{ 
        backgroundColor: 'white', padding: '40px', borderRadius: '24px', 
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#6366f1', margin: 0, fontSize: '28px' }}>SLA System</h1>
          <p style={{ color: '#64748b', marginTop: '8px' }}>Entre para gerenciar suas análises</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@puc.com" 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Senha</label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ 
            backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '14px', 
            borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px',
            transition: 'background 0.2s'
          }}>
            Acessar Sistema
          </button>
        </form>
      </div>
    </div>
  );
}
