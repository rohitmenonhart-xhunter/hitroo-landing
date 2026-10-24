import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getContent('page:about');
  return pageMetadata({ ...meta, path: '/about', keywords: ['about HITROO', 'software company', 'AI company', 'custom software company'] });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
