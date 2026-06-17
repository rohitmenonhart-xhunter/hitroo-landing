import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support — The HITROO App',
  description: 'Support that lives in one app. Raise a ticket from any device (iOS, Android, Windows, macOS) and talk to the team that built your software — 24h first response, 48h typical resolution.',
  keywords: ['HITROO support', 'software support app', 'ticketing', 'SLA support', 'cross-platform support'],
  alternates: { canonical: '/support' },
  openGraph: {
    title: 'Support — The HITROO App',
    description: 'Raise a ticket from any device and talk to the team that built your software. 24h response, 48h resolution.',
    url: '/support',
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
