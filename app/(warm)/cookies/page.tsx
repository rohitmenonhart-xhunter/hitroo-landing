import Link from 'next/link';
import CookieSettingsLink from '@/components/corporate/CookieSettingsLink';
import LegalSections, { type LegalSection } from '@/components/corporate/LegalSections';
import PageIntro from '@/components/warm/PageIntro';
import JsonLd from '@/components/seo/JsonLd';
import { getContent } from '@/lib/content';
import type { Company } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

const DESCRIPTION = 'The cookies and browser storage the HITROO website uses, and how to change your choice.';
export const metadata = pageMetadata({ title: 'Cookie policy', description: DESCRIPTION, path: '/cookies' });

const A = 'font-medium text-char underline decoration-char/30 underline-offset-4 hover:decoration-char';

const STORED = [
  { name: 'hitroo_consent', type: 'Cookie', when: 'Always', purpose: 'Remembers your cookie choice.', kept: 'One year' },
  { name: 'hitroo_vid', type: 'Cookie', when: 'Only if you accept', purpose: 'A random visitor ID, to count returning visits.', kept: 'One year' },
  { name: 'hitroo_sid', type: 'Session storage', when: 'Only if you accept', purpose: 'A random ID that groups the pages of one visit.', kept: 'Until you close the tab' },
];

/** The sections, with the contact details from `company` content. */
const sections = (COMPANY: Company): LegalSection[] => [
  {
    title: 'What we store',
    body: [
      <dl key="stored" className="grid gap-8">
        {STORED.map((s) => (
          <div key={s.name}>
            <dt className="font-mono text-[15px] text-char">{s.name}</dt>
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

export default async function CookiesPage() {
  const COMPANY = await getContent('company');
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Cookie policy', '/cookies', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Cookie policy', path: '/cookies' }])} />
      <PageIntro word="cookies" caption="Legal" title="Cookie policy" lede="The little we store in your browser, and your choice. Last updated 26 September 2026." />
      <LegalSections sections={sections(COMPANY)} />
    </>
  );
}
