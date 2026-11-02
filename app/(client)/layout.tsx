import type { Metadata } from 'next';

/**
 * The client area at my.hitroo.com: each client's dashboard (/d/<link>) and their quotes, payments and
 * invoices (/q/<link>). Private pages behind a secret link: never indexed, never cached, always fresh from the
 * delivery API (lib/client/api.ts).
 */
export const dynamic = 'force-dynamic';
/** Next to the delivery system (Germany): each page's calls to it take milliseconds, not half a second. */
export const preferredRegion = 'fra1';

export const metadata: Metadata = {
  title: { default: 'Your dashboard', template: '%s | hitroo' },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function ClientAreaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
