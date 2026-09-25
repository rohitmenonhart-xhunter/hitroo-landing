import './globals.css';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { inter } from '@/components/corporate/fonts';
import { OG_IMAGE, SITE_URL, organizationLd, websiteLd } from '@/lib/seo';

const DESCRIPTION =
  'HITROO builds custom software, mobile and desktop apps, AI models, automation and computer-vision systems for businesses — built fast, security-tested and supported after launch.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  themeColor: '#ffffff',
  title: {
    default: 'HITROO — Custom Software, Apps, Automation & AI',
    template: '%s | HITROO',
  },
  description: DESCRIPTION,
  keywords: [
    'HITROO',
    'software development company',
    'custom software development',
    'mobile app development',
    'desktop app development',
    'AI development company',
    'custom AI models',
    'AI automation',
    'AI agents',
    'computer vision',
    'automated quality inspection',
    'managed services',
    'software outsourcing',
  ],
  authors: [{ name: 'HITROO', url: SITE_URL }],
  creator: 'HITROO',
  publisher: 'HITROO',
  applicationName: 'HITROO',
  referrer: 'origin-when-cross-origin',
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/android-icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/favicon/manifest.json',
  other: { 'msapplication-config': '/favicon/browserconfig.xml', 'msapplication-TileColor': '#ffffff' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'HITROO',
    title: 'HITROO — Custom Software, Apps, Automation & AI',
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HITROO — Custom Software, Apps, Automation & AI',
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
    creator: '@hitroo',
    site: '@hitroo',
  },
  // Canonical URLs are set per page (never here: a root canonical would be inherited by every page).
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } } : {}),
  },
  category: 'technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <JsonLd data={organizationLd()} />
        <JsonLd data={websiteLd()} />
      </head>
      <body suppressHydrationWarning className="bg-white font-corp text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
