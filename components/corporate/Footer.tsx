import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, Linkedin } from 'lucide-react';
import { COMPANY, RESOURCES, services } from '@/lib/site-data';
import CookieSettingsLink from './CookieSettingsLink';
import Wordmark from './Wordmark';
import { Container } from './ui';

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/news', label: 'Newsroom' },
  { href: '/brand', label: 'Brand kit' },
  { href: '/careers', label: 'Careers' },
  { href: '/support', label: 'Support' },
  { href: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms of use' },
  { href: '/cookies', label: 'Cookie policy' },
  { href: '/accessibility', label: 'Accessibility' },
  { href: '/security', label: 'Security' },
  { href: '/site-map', label: 'Site map' },
];

const LINK = 'transition-colors hover:text-cobalt';
const ACTION = 'inline-flex items-center gap-1.5 font-medium text-cobalt transition-colors hover:text-cobalt-dark';

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-[17px] font-medium tracking-[-0.01em] text-ink">{title}</h2>
      <ul className="mt-5 space-y-3 text-[15px] text-slate-600">{children}</ul>
    </div>
  );
}

/** Site map on light grey: brand, four link columns and contact, then © and the legal links. */
export default function Footer() {
  return (
    <footer className="bg-mist">
      <Container className="grid gap-14 pb-14 pt-20 lg:grid-cols-12 lg:gap-10 lg:pt-24">
        <div className="lg:col-span-3">
          <Link href="/" aria-label="HITROO home" className="inline-block">
            <Wordmark />
          </Link>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-slate-600">{COMPANY.oneLiner}</p>
          <a
            href={COMPANY.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[14px] font-medium text-ink shadow-sm ring-1 ring-ink/5 transition-colors hover:text-cobalt"
          >
            <Linkedin aria-hidden="true" className="h-4 w-4 text-[#0A66C2]" strokeWidth={2} />
            Follow us on LinkedIn
          </a>
        </div>
        <div className="grid gap-12 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4 lg:gap-8">
          <Column title="Services">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={LINK}>
                  {s.label}
                </Link>
              </li>
            ))}
          </Column>
          <Column title="Resources">
            {RESOURCES.learn.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={LINK}>
                  {l.label}
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
              <p className="text-[13px] font-medium text-slate-500">Phone</p>
              <a href={COMPANY.phoneHref} className={`mt-1 block text-ink ${LINK}`}>
                {COMPANY.phone}
              </a>
            </li>
            <li>
              <p className="text-[13px] font-medium text-slate-500">Email</p>
              <a href={`mailto:${COMPANY.email}`} className={`mt-1 block text-ink ${LINK}`}>
                {COMPANY.email}
              </a>
            </li>
            <li>
              <p className="text-[13px] font-medium text-slate-500">Office</p>
              <p className="mt-1 text-ink">{COMPANY.location}</p>
            </li>
            <li className="pt-2">
              <Link href="/contact" className={ACTION}>
                Start a project
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link href="/support" className={ACTION}>
                Get support
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </li>
          </Column>
        </div>
      </Container>
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-12 text-[13px] text-slate-500">
        <p>© {new Date().getFullYear()} HITROO</p>
        {LEGAL_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={LINK}>
            {l.label}
          </Link>
        ))}
        <CookieSettingsLink className={LINK} />
      </Container>
    </footer>
  );
}
