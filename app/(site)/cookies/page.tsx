import Link from 'next/link';
import CookieSettingsLink from '@/components/corporate/CookieSettingsLink';
import LegalSections, { type LegalSection } from '@/components/corporate/LegalSections';
import PageHero from '@/components/corporate/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { COMPANY } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

const DESCRIPTION = 'The cookies and browser storage the HITROO website uses, and how to change your choice.';
export const metadata = pageMetadata({ title: 'Cookie policy', description: DESCRIPTION, path: '/cookies' });

const A = 'font-medium text-cobalt hover:text-cobalt-dark';

const STORED = [
  { name: 'hitroo_consent', type: 'Cookie', when: 'Always', purpose: 'Remembers your cookie choice.', kept: 'One year' },
  { name: 'hitroo_vid', type: 'Cookie', when: 'Only if you accept', purpose: 'A random visitor ID, to count returning visits.', kept: 'One year' },
  { name: 'hitroo_sid', type: 'Session storage', when: 'Only if you accept', purpose: 'A random ID that groups the pages of one visit.', kept: 'Until you close the tab' },
];

const SECTIONS: LegalSection[] = [
  {
    title: 'What we store',
    body: [
      <dl key="stored" className="grid gap-8">
        {STORED.map((s) => (
          <div key={s.name}>
            <dt className="font-mono text-[15px] text-ink">{s.name}</dt>
            <dd className="mt-1">
              {s.purpose} {s.type}, {s.when.toLowerCase()}. Kept: {s.kept.toLowerCase()}.
            </dd>
          </div>
        ))}
      </dl>,
    ],
  },
  {
    title: 'What we don’t',
    body: ['No advertising cookies, no third-party trackers, and we never store your IP address.'],
  },
  {
    title: 'Your choice',
    body: [
      <>
        Accept or decline when the banner appears. Change it any time with <CookieSettingsLink className={A} />, also in the footer.
      </>,
    ],
  },
  {
    title: 'More',
    body: [
      <>
        What we collect and why is in our{' '}
        <Link href="/privacy" className={A}>
          privacy policy
        </Link>
        . Questions? Email{' '}
        <a href={`mailto:${COMPANY.email}`} className={A}>
          {COMPANY.email}
        </a>
        .
      </>,
    ],
  },
];

export default function CookiesPage() {
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Cookie policy', '/cookies', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Cookie policy', path: '/cookies' }])} />
      <PageHero eyebrow="Legal" title="Cookie policy" lede="The little we store in your browser, and your choice. Last updated 26 September 2026." />
      <LegalSections sections={SECTIONS} />
    </>
  );
}
