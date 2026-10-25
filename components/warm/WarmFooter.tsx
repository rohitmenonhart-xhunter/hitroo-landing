import Link from 'next/link';
import CookieSettingsLink from '@/components/corporate/CookieSettingsLink';
import { getContent } from '@/lib/content';
import type { Division } from '@/lib/site-data';
import { WContainer } from './ui';

const columns = (divisions: Division[]): { title: string; links: { href: string; label: string }[] }[] => [
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/research', label: 'Research' },
      { href: '/insights', label: 'Insights' },
      { href: '/news', label: 'Newsroom' },
      { href: '/careers', label: 'Careers' },
    ],
  },
  { title: 'What we do', links: [...divisions.map((d) => ({ href: `/${d.slug}`, label: d.name })), { href: '/support', label: 'Support' }] },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/cookies', label: 'Cookies' },
      { href: '/accessibility', label: 'Accessibility' },
      { href: '/security', label: 'Security' },
    ],
  },
];

const HEAD = 'font-display text-[16px] font-bold tracking-[-0.01em] text-stone';
const LINK = 'text-[16px] font-medium text-char transition-colors hover:text-ember';

/** Footer: a short description, link columns and contact; then the name, very large. */
export default async function WarmFooter() {
  const [COMPANY, divisions] = await Promise.all([getContent('company'), getContent('divisions')]);
  return (
    <footer className="pt-20">
      <WContainer>
        <div className="grid gap-12 border-t border-char/10 pt-12 md:grid-cols-[1.3fr_repeat(4,1fr)] md:gap-8">
          <p className="max-w-[320px] text-[16px] font-medium leading-relaxed text-char">
            One foundation for software, automation, AI and creatives, built for businesses that run on technology.
          </p>
          {columns(divisions).map((c) => (
            <div key={c.title}>
              <h2 className={HEAD}>{c.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={LINK}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className={HEAD}>Contact</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={COMPANY.phoneHref} className={LINK}>
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`} className={LINK}>
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <a href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer" className={LINK}>
                  LinkedIn
                </a>
              </li>
              <li>
                <Link href="/contact" className={LINK}>
                  Start a project
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </WContainer>
      <WContainer className="mt-20 overflow-x-clip">
        <p aria-hidden="true" className="select-none pb-[0.05em] font-jakarta text-[clamp(96px,26vw,400px)] font-extrabold leading-[0.9] tracking-[-0.06em] text-char">
          <span className="text-ember">hi</span>troo
        </p>
      </WContainer>
      <WContainer className="flex flex-wrap items-center justify-between gap-4 py-8 text-[14px] font-medium text-stone">
        <p>© {new Date().getFullYear()} hitroo</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/site-map" className="hover:text-char">
            Site map
          </Link>
          <Link href="/brand" className="hover:text-char">
            Brand kit
          </Link>
          <CookieSettingsLink className="hover:text-char" />
        </div>
      </WContainer>
    </footer>
  );
}
