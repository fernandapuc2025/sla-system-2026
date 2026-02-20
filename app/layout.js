'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Se estivermos na página de login, não mostramos a sidebar
  const isLoginPage = pathname === '/login';

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/' },
    { name: 'Nova Análise', icon: '🪄', path: '/new-lesson' },
    { name: 'Histórico', icon: '📂', path: '/history' },
    { name: 'Configurações', icon: '⚙️', path: '/settings' },
  ];

  if (isLoginPage) return <html lang="pt-br"><body>{children}</body></html>;

  return (
    <html lang="pt-br">
      <body style={{ margin: 0, display: 'flex', backgroundColor: '#f4f7f6', fontFamily: 'Inter, sans-serif' }}>
        
        {/* SIDEBAR CONTAINER */}
        <nav style={{
          width: '260px',
          height: '100vh',
          backgroundColor: '#0f172a', // Azul quase preto, bem profissional
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          position: 'fixed',
          boxSizing: 'border-box',
          boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
        }}>
          
          {/* LOGO AREA */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '0 12px 32px 12px',
            borderBottom: '1px solid #1e293b',
            marginBottom: '24px'
          }}>
            <div style={{ 
              backgroundColor: '#6366f1', 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>S</div>
            <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>
              SLA <span style={{ color: '#6366f1' }}>System</span>
            </span>
          </div>

          {/* MENU ITEMS */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path} style={{ marginBottom: '4px' }}>
                  <Link href={item.path} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: isActive ? '#fff' : '#94a3b8',
                    backgroundColor: isActive ? '#6366f1' : 'transparent',
                    fontWeight: isActive ? '600' : '400',
                    transition: 'all 0.2s ease',
                  }}
                  className="nav-item">
                    <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* USER INFO & LOGOUT */}
          <div style={{ 
            marginTop: 'auto', 
            padding: '16px', 
            backgroundColor: '#1e293b', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              backgroundColor: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>F</div>
            <div style={{ flexGrow: 1, overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Fernanda
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>Sair</p>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT WRAPPER */}
        <main style={{
          marginLeft: '260px',
          width: 'calc(100% - 260px)',
          minHeight: '100vh',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>

        <style jsx global>{`
          .nav-item:hover {
            background-color: ${pathname === '/' ? '#6366f1' : '#1e293b'};
            color: #fff !important;
          }
        `}</style>

      </body>
    </html>
  );
}
