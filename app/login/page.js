'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Importando o Supabase real

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Estado para a senha
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Chamada real ao Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Erro na autenticação: ' + error.message);
      setLoading(false);
    } else {
      router.push('/'); // Agora sim, redireciona com sessão ativa
    }
  };

  return (
    <div style={{ 
      height: '100vh', width: '100vw', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', 
      backgroundColor: '#0f172a', position: 'fixed', top: 0, left: 0, zIndex: 9999 
    }}>
      <div style={{ 
        backgroundColor: 'white', padding: '40px', borderRadius: '12px', 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', width: '100%', maxWidth: '400px' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1e293b', margin: 0, fontSize: '24px', fontWeight: '800' }}>SLA & MISSION INTELLIGENCE</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>Sistema de Apoio à Decisão Multinível</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" placeholder="E-mail institucional" required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
          <input 
            type="password" placeholder="Senha" required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
          <button type="submit" disabled={loading} style={{ 
            backgroundColor: loading ? '#94a3b8' : '#2563eb', 
            color: 'white', border: 'none', padding: '14px', 
            borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            {loading ? 'Verificando...' : 'Autenticar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
