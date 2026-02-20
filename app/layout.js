'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Não mostra a sidebar na tela de login
  if (pathname === '/login') return <html lang="pt-br"><body>{children}</body></html>;

  const menuItems = [
    { section: 'ESTRATÉGICO', items: [
      { name: 'Centro de Comando', path: '/', icon: '🧭' },
      { name: 'Painel de Risco', path: '/risk', icon: '🚨' },
      { name: 'Matriz Analítica', path: '/analytics', icon: '📊' },
    ]},
    { section: 'OPERAÇÕES', items: [
      { name: 'Explorar Missões', path: '/missions', icon: '🌍' },
      { name: 'Atores & Governança', path: '/actors', icon: '🏛️' },
      { name: 'Decisões Críticas', path: '/decisions', icon: '⚙️' },
    ]},
    { section: 'CONHECIMENTO', items: [
      { name: 'Relatos (Fricção)', path: '/history', icon: '🧠' },
      { name: 'Lições Aprendidas', path: '/lessons', icon: '📚' },
      { name: 'Ingestão de IA', path: '/new-lesson', icon: '📄' },
    ]},
  ];

  return (
    <html lang="pt-br">
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif', display: 'flex', backgroundColor: '#f8fafc' }}>
        
        {/* SIDEBAR */}
        <nav style={{ 
          width: '280px', height: '100vh', backgroundColor: '#0f172a', 
          color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed' 
        }}>
          <div style={{ padding: '30px', borderBottom: '1px solid #1e293b' }}>
            <h2 style={{ fontSize: '18px', margin: 0, letterSpacing: '1px' }}>SLA INTELLIGENCE</h2>
            <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '5px' }}>SISTEMA DE APOIO À DECISÃO</p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {menuItems.map((sec, idx) => (
              <div key={idx} style={{ marginBottom: '30px' }}>
                <p style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px' }}>
                  {sec.section}
                </p>
                {sec.items.map((item) => (
                  <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', padding: '12px', borderRadius: '8px',
                      marginBottom: '5px', transition: '0.2s',
                      backgroundColor: pathname === item.path ? '#1e293b' : 'transparent',
                      color: pathname === item.path ? '#3b82f6' : '#94a3b8'
                    }}>
                      <span style={{ marginRight: '12px' }}>{item.icon}</span>
                      <span style={{ fontSize: '14px', fontWeight: pathname === item.path ? 'bold' : 'normal' }}>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <Link href="/settings" style={{ padding: '20px', borderTop: '1px solid #1e293b', textDecoration: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px' }}>⚙️</span> Configurações
          </Link>
        </nav>

        {/* ÁREA DE CONTEÚDO */}
        <main style={{ marginLeft: '280px', width: 'calc(100% - 280px)', minHeight: '100vh' }}>
          {children}
        </main>

      </body>
    </html>
  );
}
