import Link from 'next/link';
import type { ReactNode } from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { COMPANY, services } from '@/lib/site-data';
import CookieSettingsLink from './CookieSettingsLink';
import Wordmark from './Wordmark';
import { Container } from './ui';

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/research', label: 'Research' },
  { href: '/ai-perspective', label: 'Our view on AI' },
  { href: '/insights', label: 'Insights' },
  { href: '/careers', label: 'Careers' },
  { href: '/support', label: 'Support' },
  { href: '/contact', label: 'Contact' },
];

const SOCIAL = [
  { href: 'https://linkedin.com/company/hitroo', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://twitter.com/hitroo', label: 'X (Twitter)', Icon: Twitter },
  { href: 'https://github.com/hitroo', label: 'GitHub', Icon: Github },
];

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink">{title}</h2>
      <ul className="mt-5 space-y-3 text-[15px] text-slate-600">{children}</ul>
    </div>
  );
}

const LINK = 'transition-colors hover:text-cobalt';

export default function Footer() {
  return (
    <footer className="bg-white">
      <Container className="grid gap-12 pb-12 pt-20 lg:grid-cols-12 lg:pb-16 lg:pt-28">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="HITROO home" className="inline-block">
            <Wordmark />
          </Link>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-slate-600">{COMPANY.oneLiner}</p>
        </div>
        <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
          <Column title="Services">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={LINK}>
                  {s.label}
                </Link>
              </li>
            ))}
          </Column>
          <Column title="Company">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={LINK}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>
          <Column title="Contact">
            <li>
              <a href={`mailto:${COMPANY.email}`} className={LINK}>
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a href={COMPANY.phoneHref} className={LINK}>
                {COMPANY.phone}
              </a>
            </li>
            <li>{COMPANY.location}</li>
          </Column>
        </div>
      </Container>
      <div>
        <Container className="flex flex-col gap-4 pb-12 pt-6 text-[13px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>© {new Date().getFullYear()} HITROO. All rights reserved.</p>
            <Link href="/privacy" className="transition-colors hover:text-cobalt">
              Privacy
            </Link>
            <CookieSettingsLink className="transition-colors hover:text-cobalt" />
          </div>
          <ul className="flex items-center gap-2">
            {SOCIAL.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-ink"
                >
                  <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
