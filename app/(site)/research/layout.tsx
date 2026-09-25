import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Research — applied AI, vision and systems',
  description: 'HITROO researches hard problems in applied AI, computer vision, automation and systems performance — and ships the answers as product.',
  path: '/research',
  keywords: ['applied AI research', 'computer vision research', 'AI automation research'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
