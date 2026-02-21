'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const userSession = localStorage.getItem('isLoggedIn');
    if (!userSession && pathname !== '/login') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  if (pathname === '/login') {
    return <html lang="pt-br"><body>{children}</body></html>;
  }

  if (!isAuthorized) return <html lang="pt-br"><body></body></html>;

  // Definição das Rotas Baseadas nos 5 Bancos do Sistema
  const navLinks = [
    { name: '🧭 Dashboard', path: '/' },
    { name: '🌐 Missões (ICM)', path: '/missions' },
    { name: '🧠 Relatos (Fricção)', path: '/history' },
    { name: '🏛️ Atores', path: '/actors' },
    { name: '⚙️ Decisões', path: '/decisions' },
    { name: '📚 Lições', path: '/lessons' },
    { name: '📄 Nova Ingestão', path: '/new-lesson' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  return (
    <html lang="pt-br">
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif', backgroundColor: '#f1f5f9' }}>
        
        {/* CABEÇALHO SUPERIOR (HEADER) */}
        <header style={{ 
          backgroundColor: '#0f172a', 
          color: 'white', 
          padding: '0 30px', 
          height: '70px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ lineHeight: '1' }}>
              <h1 style={{ fontSize: '18px', margin: 0, letterSpacing: '1px', fontWeight: '900' }}>SLA INTELLIGENCE</h1>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>SISTEMA DE APOIO À DECISÃO</span>
            </div>

            {/* LINKS DE NAVEGAÇÃO INTERNOS */}
            <nav style={{ display: 'flex', gap: '15px' }}>
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    padding: '8px 15px', 
                    borderRadius: '6px', 
                    fontSize: '13px', 
                    fontWeight: '500',
                    transition: '0.3s',
                    color: pathname === link.path ? '#3b82f6' : '#cbd5e1',
                    backgroundColor: pathname === link.path ? '#1e293b' : 'transparent',
                  }}>
                    {link.name}
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <button 
            onClick={handleLogout}
            style={{ 
              backgroundColor: '#ef4444', 
              color: 'white', 
              border: 'none', 
              padding: '8px 15px', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}>
            SAIR
          </button>
        </header>

        {/* ÁREA DE CONTEÚDO PRINCIPAL */}
        <main style={{ padding: '40px', minHeight: 'calc(100vh - 70px)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>

      </body>
    </html>
  );
}
