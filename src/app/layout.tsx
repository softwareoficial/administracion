import './globals.css';
import ClientProviders from '../components/ClientProviders';

export const metadata = {
  title: 'Software Oficial | CRM y Gestión Empresarial de Alto Rendimiento',
  description: 'Software Oficial es la solución empresarial integral diseñada para la optimización de inventarios, gestión de personal, seguimiento de ventas y control de permisos granulares.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
