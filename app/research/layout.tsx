import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research',
  description: 'HITROO actively researches software and AI — applied AI, systems & performance, automation, and modernization — turning that work into solutions for the hard problems businesses actually face.',
  keywords: ['HITROO research', 'applied AI research', 'software research', 'R&D', 'hard problems'],
  alternates: { canonical: '/research' },
  openGraph: {
    title: 'Research — HITROO',
    description: 'We research the hard problems in software and AI, and ship the solutions as product.',
    url: '/research',
  },
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
