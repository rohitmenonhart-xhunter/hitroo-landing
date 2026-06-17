import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with HITROO. Tell us about your project — software, apps, AI models, or automation — and we will help you build it.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
