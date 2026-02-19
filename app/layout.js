export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <nav>
          <a href="/">Dashboard</a> | <a href="/new-lesson">Nova Lição</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
