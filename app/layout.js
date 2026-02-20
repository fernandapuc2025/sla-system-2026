'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
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
        <nav style={{ width: '260px', height: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column', padding: '24px 16px', position: 'fixed', boxSizing: 'border-box' }}>
          <div style={{ padding: '0 12px 32px 12px', borderBottom: '1px solid #1e293b', marginBottom: '24px', fontWeight: 'bold', fontSize: '20px' }}>
            SLA <span style={{ color: '#6366f1' }}>System</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
            {menuItems.map((item) => (
              <li key={item.path} style={{ marginBottom: '4px' }}>
                <Link href={item.path} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', textDecoration: 'none', color: pathname === item.path ? '#fff' : '#94a3b8', backgroundColor: pathname === item.path ? '#6366f1' : 'transparent' }}>
                  <span style={{ marginRight: '12px' }}>{item.icon}</span> {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main style={{ marginLeft: '260px', width: 'calc(100% - 260px)', padding: '40px', boxSizing: 'border-box' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
