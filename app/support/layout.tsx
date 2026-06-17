import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Support that lives in one app. Raise a ticket from any device and talk to the team that built your software — 24h first response, 48h typical resolution.',
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
