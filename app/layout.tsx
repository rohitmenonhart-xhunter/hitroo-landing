import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HITROO - Intelligence, Unbound',
  description: 'Building intelligent machines and software systems that seamlessly integrate with the real world. Making advanced robotics and autonomous platforms accessible, scalable, and impactful.',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    title: 'HITROO - Intelligence, Unbound',
    description: 'Building intelligent machines and software systems that seamlessly integrate with the real world.',
    siteName: 'HITROO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HITROO - Intelligence, Unbound',
    description: 'Building intelligent machines and software systems that seamlessly integrate with the real world.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Comfortaa, sans-serif' }}>{children}</body>
    </html>
  );
}
