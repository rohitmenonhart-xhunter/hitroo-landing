import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with HITROO. Tell us about your project — software, apps, AI models, automation, or vision systems — and we will help you build it. Based in Chennai, India.',
  keywords: ['contact HITROO', 'start a project', 'software development enquiry', 'AI project', 'hire software studio Chennai'],
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact HITROO',
    description: 'Tell us about your project — we usually respond within a day. Based in Chennai, India.',
    url: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
