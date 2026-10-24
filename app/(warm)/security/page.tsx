import LegalSections, { type LegalSection } from '@/components/corporate/LegalSections';
import PageIntro from '@/components/warm/PageIntro';
import JsonLd from '@/components/seo/JsonLd';
import { getContent } from '@/lib/content';
import type { Company } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

const DESCRIPTION = 'How to report a security problem to HITROO.';
export const metadata = pageMetadata({ title: 'Security', description: DESCRIPTION, path: '/security' });

const A = 'font-medium text-char underline decoration-char/30 underline-offset-4 hover:decoration-char';

/** The sections, with the contact details from `company` content. */
const sections = (COMPANY: Company): LegalSection[] => [
  {
    title: 'Report it',
    body: [
      <>
        Email{' '}
        <a href={`mailto:${COMPANY.email}?subject=Security`} className={A}>
          {COMPANY.email}
        </a>{' '}
        with “Security” in the subject: what you found, where, and the steps to reproduce it. We reply within a day.
      </>,
    ],
  },
  {
    title: 'Please',
    body: ['Give us time to fix it before telling anyone else. Don’t access or change data that isn’t yours, don’t disrupt our services, and don’t test with social engineering.'],
  },
  {
    title: 'Our part',
    body: ['We confirm we got your report, keep you updated, and tell you when it’s fixed.'],
  },
  {
    title: 'How we build',
    body: ['Every project we deliver is security-tested before launch, and every change is checked.'],
  },
  {
    title: 'For tools',
    body: [
      <>
        Our contact details are also in{' '}
        <a href="/.well-known/security.txt" className={A}>
          security.txt
        </a>
        .
      </>,
    ],
  },
];

export default async function SecurityPage() {
  const COMPANY = await getContent('company');
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Security', '/security', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Security', path: '/security' }])} />
      <PageIntro word="security" caption="Security" title="Found a security problem?" lede="Tell us privately and we’ll fix it fast." />
      <LegalSections sections={sections(COMPANY)} />
    </>
  );
}
