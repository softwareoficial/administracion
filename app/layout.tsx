import './globals.css';
import Dock from '../components/Dock';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Dock />
      </body>
    </html>
  );
}
