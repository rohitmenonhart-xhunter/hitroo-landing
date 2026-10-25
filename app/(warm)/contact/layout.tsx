import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getContent('page:contact');
  return pageMetadata({ ...meta, path: '/contact', keywords: ['contact hitroo', 'hire software developers', 'start a software project'] });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
