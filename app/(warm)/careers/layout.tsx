import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getContent('page:careers');
  return pageMetadata({ ...meta, path: '/careers', keywords: ['hitroo careers', 'software engineer jobs', 'AI engineer jobs', 'internship'] });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
