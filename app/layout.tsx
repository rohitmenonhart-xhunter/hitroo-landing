import './globals.css';
import type { Metadata } from 'next';

const SITE_URL = 'https://hitroo.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'HITROO - Intelligence, Unbound | AI, Robotics & Automation',
    template: '%s | HITROO',
  },
  description: 'HITROO builds intelligent AI systems, robotics, and automation solutions. Home of Capsona - the revolutionary voice-to-text AI assistant. Industrial automation, machine learning, drone technology, and cutting-edge software development.',
  keywords: [
    'HITROO', 'Capsona', 'AI assistant', 'voice to text', 'artificial intelligence',
    'robotics', 'automation', 'machine learning', 'ML', 'deep learning',
    'industrial automation', 'drone technology', 'UAV', 'UGV',
    'AI startup', 'tech company India', 'intelligent systems',
    'Attyn', 'Belecure', 'Mockello', 'AI marketing',
    'embedded systems', 'STM32', 'autonomous robots',
    'AI development', 'software development', 'app development',
    'web development', 'DevOps', 'VLA robotics', 'vLLM',
    'model training', 'AI model', 'cool AI', 'best AI assistant',
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
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'HITROO',
    title: 'HITROO - Intelligence, Unbound | AI, Robotics & Automation',
    description: 'Building the future of AI and robotics. Home of Capsona - revolutionary voice-to-text AI. Industrial automation, machine learning, drones, and intelligent software systems.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HITROO - Intelligence, Unbound',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HITROO - Intelligence, Unbound | AI & Robotics',
    description: 'Building the future of AI. Home of Capsona - revolutionary voice-to-text AI assistant. Industrial automation, ML, robotics.',
    images: ['/og-image.png'],
    creator: '@hitroo',
    site: '@hitroo',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: 'technology',
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HITROO',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon/favicon-96x96.png`,
  description: 'HITROO builds intelligent AI systems, robotics, and automation solutions.',
  sameAs: [
    'https://twitter.com/hitroo',
    'https://linkedin.com/company/hitroo',
    'https://github.com/hitroo',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'Hello@hitroo.com',
    telephone: '+91-7550000805',
    contactType: 'customer service',
  },
  foundingDate: '2024',
  founders: [
    {
      '@type': 'Person',
      name: 'Rohit',
    },
  ],
  slogan: 'Intelligence, Unbound',
  knowsAbout: [
    'Artificial Intelligence',
    'Machine Learning',
    'Robotics',
    'Industrial Automation',
    'Voice Recognition',
    'Natural Language Processing',
  ],
};

const productsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'SoftwareApplication',
      position: 1,
      name: 'Capsona',
      description: 'Revolutionary voice-to-text AI assistant that adapts to your typing style',
      applicationCategory: 'Productivity',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/PreOrder',
      },
    },
    {
      '@type': 'SoftwareApplication',
      position: 2,
      name: 'Attyn',
      description: 'AI-powered task management and productivity platform',
      applicationCategory: 'Productivity',
    },
    {
      '@type': 'SoftwareApplication',
      position: 3,
      name: 'Belecure',
      description: 'AI-powered lighting design and visualization tool',
      applicationCategory: 'Design',
    },
    {
      '@type': 'SoftwareApplication',
      position: 4,
      name: 'Mockello',
      description: 'Student-industry hiring and training platform',
      applicationCategory: 'Education',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ fontFamily: 'Comfortaa, sans-serif' }}>{children}</body>
    </html>
  );
}
