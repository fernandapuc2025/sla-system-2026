'use client';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f4f7f6',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '24px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{ color: '#6366f1', fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          SLA System
        </div>
        <h2 style={{ marginBottom: '30px', color: '#1e293b' }}>Bem-vinda de volta</h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '5px', boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '5px', boxSizing: 'border-box' }}
            />
          </div>

          <button style={{ 
            backgroundColor: '#6366f1', 
            color: 'white', 
            border: 'none', 
            padding: '14px', 
            borderRadius: '12px', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            cursor: 'pointer',
            marginTop: '10px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            Entrar no Sistema
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '14px', color: '#64748b' }}>
          Não tem conta? <span style={{ color: '#6366f1', cursor: 'pointer', fontWeight: '600' }}>Solicite acesso</span>
        </p>
      </div>
    </div>
  );
}
