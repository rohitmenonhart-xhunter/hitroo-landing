import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Is AI a threat to HITROO?',
  description: 'Our view on AI and software companies: AI speeds up how we build — prototypes, iterations and testing — but it doesn’t replace a team that owns your whole system.',
  path: '/ai-perspective',
  keywords: ['will AI replace software companies', 'AI and software development', 'AI-assisted development'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
