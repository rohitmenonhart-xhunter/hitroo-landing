import type { Metadata } from 'next';
import { getService, services } from '@/lib/site-data';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const s = getService(params.slug);
  if (!s) return { title: 'Service' };
  const url = `/services/${s.slug}`;
  const title = `${s.title} — ${s.tagline}`;
  return {
    title,
    description: s.overview,
    keywords: [s.title, ...s.capabilities, ...s.stack, 'HITROO', 'Chennai'],
    alternates: { canonical: url },
    openGraph: {
      title: `${s.title} | HITROO`,
      description: s.overview,
      url,
      images: [{ url: s.image, alt: s.title }],
    },
    twitter: {
      title: `${s.title} | HITROO`,
      description: s.overview,
      images: [s.image],
    },
  };
}

export default function ServiceSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
