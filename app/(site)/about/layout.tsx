import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About us',
  description: 'HITROO is a software company building custom software, automation and AI for businesses of every size — one team, fast delivery and support long after launch.',
  path: '/about',
  keywords: ['about HITROO', 'software company', 'AI company', 'custom software company'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
