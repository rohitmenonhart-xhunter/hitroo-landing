import type { Metadata } from 'next';
import { COMPANY, services, type Service } from '@/lib/site-data';

/** Canonical origin. Override per deployment with NEXT_PUBLIC_SITE_URL (e.g. a Vercel preview). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hitroo.com').replace(/\/$/, '');
export const abs = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
export const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 675, alt: 'HITROO — we build the software your business runs on' };

export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;

/** Page metadata with canonical, Open Graph and Twitter set consistently. */
export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  image,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string | null;
  keywords?: string[];
}): Metadata {
  const images = image ? [{ url: image, alt: title }] : [OG_IMAGE];
  return {
    title,
    description,
    // Only override keywords when given, so every page renders the same set of meta tags
    // (Next 13.5 reuses head tags by position during client navigation).
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path, languages: { en: path, 'x-default': path } },
    openGraph: { type, url: path, title, description, siteName: 'HITROO', locale: 'en_US', images },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
  };
}

export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'HITROO',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: abs('/new_logo/logo_whitebg.png'), width: 1254, height: 1254 },
  image: abs('/og-image.png'),
  description:
    'HITROO builds custom software, mobile and desktop apps, AI models, automation and computer-vision systems for businesses — built fast, security-tested and supported after launch.',
  slogan: 'We build the software your business runs on.',
  email: COMPANY.email,
  telephone: '+91-7550000805',
  foundingDate: '2024',
  founder: [{ '@type': 'Person', name: 'Rohit' }],
  address: { '@type': 'PostalAddress', addressLocality: 'Chennai', addressRegion: 'Tamil Nadu', addressCountry: 'IN' },
  areaServed: 'Worldwide',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: COMPANY.email,
      telephone: '+91-7550000805',
      areaServed: 'Worldwide',
      availableLanguage: ['English'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: COMPANY.email,
      areaServed: 'Worldwide',
      availableLanguage: ['English'],
    },
  ],
  sameAs: ['https://linkedin.com/company/hitroo', 'https://twitter.com/hitroo', 'https://github.com/hitroo'],
  knowsAbout: [
    'Custom software development',
    'Mobile app development',
    'Desktop app development',
    'AI model development and fine-tuning',
    'AI automation and AI agents',
    'Computer vision and automated quality inspection',
    'Managed services',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'HITROO services',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, url: abs(`/services/${s.slug}`) },
    })),
  },
});

export const websiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: SITE_URL,
  name: 'HITROO',
  description: 'Custom software, automation and AI for business.',
  publisher: { '@id': ORG_ID },
  inLanguage: 'en',
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...items].map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

export const webPageLd = (type: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage', name: string, path: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': type,
  '@id': `${abs(path)}#webpage`,
  url: abs(path),
  name,
  description,
  isPartOf: { '@id': SITE_ID },
  about: { '@id': ORG_ID },
  inLanguage: 'en',
});

export const serviceLd = (s: Service) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${abs(`/services/${s.slug}`)}#service`,
  name: s.title,
  serviceType: s.title,
  description: s.overview,
  url: abs(`/services/${s.slug}`),
  image: abs(s.image),
  provider: { '@id': ORG_ID },
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: `${s.label} capabilities`,
    itemListElement: s.capabilities.map((c) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: c } })),
  },
});

export const faqLd = (qas: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: qas.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

export const articleLd = (p: {
  kind: 'article' | 'blog';
  title: string;
  description: string;
  path: string;
  image?: string | null;
  published: Date;
  modified: Date;
  author: string;
  category?: string | null;
}) => ({
  '@context': 'https://schema.org',
  '@type': p.kind === 'blog' ? 'BlogPosting' : 'Article',
  headline: p.title,
  description: p.description,
  url: abs(p.path),
  mainEntityOfPage: { '@type': 'WebPage', '@id': abs(p.path) },
  image: [p.image ? (p.image.startsWith('http') ? p.image : abs(p.image)) : abs('/og-image.png')],
  datePublished: p.published.toISOString(),
  dateModified: p.modified.toISOString(),
  author: p.author === 'HITROO' ? { '@id': ORG_ID, '@type': 'Organization', name: 'HITROO' } : { '@type': 'Person', name: p.author },
  publisher: { '@id': ORG_ID },
  articleSection: p.category ?? undefined,
  inLanguage: 'en',
});
