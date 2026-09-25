import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Support — the HITROO app',
  description: 'Raise a ticket from any device and talk to the team that built your software. First reply in 24 hours, most fixes in 48.',
  path: '/support',
  keywords: ['software support', 'application maintenance', 'SLA support'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
