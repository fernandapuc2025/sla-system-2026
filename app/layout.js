export const metadata = {
  title: "Sistema SLA",
  description: "Sistema de Lições Aprendidas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
