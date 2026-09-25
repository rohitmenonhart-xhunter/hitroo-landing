import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact us',
  description: 'Tell us what you need — custom software, apps, automation or AI. We reply within a day.',
  path: '/contact',
  keywords: ['contact HITROO', 'hire software developers', 'start a software project'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
