import './globals.css';
import type { Metadata } from 'next';

const SITE_URL = 'https://hitroo.com';
const DESCRIPTION =
  'HITROO is a Chennai-based technology studio building custom software, mobile & desktop apps, AI models, automation, and computer-vision systems — with ongoing support built in.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  themeColor: '#ffffff',
  title: {
    default: 'HITROO — Software, Apps & AI Studio in Chennai',
    template: '%s | HITROO',
  },
  description: DESCRIPTION,
  keywords: [
    'HITROO', 'software development', 'custom software development', 'app development',
    'mobile app development', 'desktop app development', 'AI development', 'AI model development',
    'custom AI models', 'fine-tuned VLMs', 'AI automation', 'business automation',
    'computer vision', 'machine vision', 'automated quality inspection', 'defect detection',
    'software audit', 'AI modernization', 'AI-ready software', 'managed services',
    'software company Chennai', 'software studio India', 'intelligent systems',
  ],
  authors: [{ name: 'HITROO', url: SITE_URL }],
  creator: 'HITROO',
  publisher: 'HITROO',
  applicationName: 'HITROO',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/android-icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/favicon/manifest.json',
  other: {
    'msapplication-config': '/favicon/browserconfig.xml',
    'msapplication-TileColor': '#ffffff',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'HITROO',
    title: 'HITROO — Software, Apps & AI Studio in Chennai',
    description: DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 675, alt: 'HITROO — Intelligence, Unbound' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HITROO — Software, Apps & AI Studio',
    description: DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@hitroo',
    site: '@hitroo',
  },
  alternates: {
    canonical: '/',
  },
  category: 'technology',
};

// JSON-LD — Organization + WebSite (helps Google rich results & AI/GEO understanding)
const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'HITROO',
  url: SITE_URL,
  logo: `${SITE_URL}/new_logo/logo_whitebg.png`,
  image: `${SITE_URL}/og-image.png`,
  description: DESCRIPTION,
  slogan: 'Intelligence, Unbound',
  email: 'info@hitroo.com',
  telephone: '+91-7550000805',
  foundingDate: '2024',
  founders: [{ '@type': 'Person', name: 'Rohit' }],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@hitroo.com',
    telephone: '+91-7550000805',
    contactType: 'customer service',
    areaServed: 'Worldwide',
    availableLanguage: ['English'],
  },
  sameAs: [
    'https://twitter.com/hitroo',
    'https://linkedin.com/company/hitroo',
    'https://github.com/hitroo',
  ],
  knowsAbout: [
    'Software Development', 'Mobile App Development', 'Desktop App Development',
    'Artificial Intelligence', 'AI Model Training', 'AI Automation',
    'Computer Vision', 'Automated Quality Inspection', 'Software Modernization',
  ],
};

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'HITROO',
  description: DESCRIPTION,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      </head>
      <body style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>{children}</body>
    </html>
  );
}
