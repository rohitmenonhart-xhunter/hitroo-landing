import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Careers',
  description: 'Roles in software, AI/ML and hardware engineering: a 3-month internship, real projects and a path to full-time. Mostly remote.',
  path: '/careers',
  keywords: ['HITROO careers', 'software engineer jobs', 'AI engineer jobs', 'internship'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
