import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research',
  description: 'HITROO actively researches software and AI, turning that work into solutions for the hard problems businesses actually face.',
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
