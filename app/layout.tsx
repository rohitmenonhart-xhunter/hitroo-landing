import './globals.css';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { body, jakarta } from '@/components/warm/fonts';
import { getContent } from '@/lib/content';
import { OG_IMAGE, SITE_URL, organizationLd, websiteLd } from '@/lib/seo';

const DESCRIPTION =
  'hitroo builds custom software, mobile and desktop apps, AI models, automation and computer-vision systems for businesses — built fast, security-tested and supported after launch.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  themeColor: '#FCF8F6',
  title: {
    default: 'hitroo | Custom Software, Apps, Automation & AI',
    template: '%s | hitroo',
  },
  description: DESCRIPTION,
  keywords: [
    'hitroo',
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
  authors: [{ name: 'hitroo', url: SITE_URL }],
  creator: 'hitroo',
  publisher: 'hitroo',
  applicationName: 'hitroo',
  // No referrer meta: the Referrer-Policy header (next.config.js) sets it, and Next 13.5
  // briefly writes other tags' values into it while navigating to and from posts.
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  // ?v=hi: new addresses, so browsers that remember the old rings icon fetch the "hi" one.
  icons: {
    icon: [
      { url: '/favicon.ico?v=hi', sizes: 'any' },
      { url: '/favicon.svg?v=hi', type: 'image/svg+xml' },
      { url: '/favicon/favicon-16x16.png?v=hi', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png?v=hi', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/android-icon-48x48.png?v=hi', sizes: '48x48', type: 'image/png' },
      { url: '/favicon/favicon-96x96.png?v=hi', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/android-icon-192x192.png?v=hi', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-icon-180x180.png?v=hi', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico?v=hi'],
  },
  manifest: '/favicon/manifest.json?v=hi',
  other: { 'msapplication-config': '/favicon/browserconfig.xml', 'msapplication-TileColor': '#FCF8F6' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'hitroo',
    title: 'hitroo | Custom Software, Apps, Automation & AI',
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hitroo | Custom Software, Apps, Automation & AI',
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  // Canonical URLs are set per page (never here: a root canonical would be inherited by every page).
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } } : {}),
  },
  category: 'technology',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [company, divisions] = await Promise.all([getContent('company'), getContent('divisions')]);
  return (
    <html lang="en" className={`${jakarta.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <JsonLd data={organizationLd(company, divisions)} />
        <JsonLd data={websiteLd()} />
      </head>
      <body suppressHydrationWarning className="bg-paper font-body text-char antialiased">
        {children}
      </body>
    </html>
  );
}
