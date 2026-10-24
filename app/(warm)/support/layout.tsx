import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getContent('page:support');
  return pageMetadata({ ...meta, path: '/support', keywords: ['HITROO support', 'software support', 'managed services', 'HITROO app'] });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
