import Link from 'next/link';
import LegalSections, { type LegalSection } from '@/components/corporate/LegalSections';
import PageIntro from '@/components/warm/PageIntro';
import JsonLd from '@/components/seo/JsonLd';
import { getContent } from '@/lib/content';
import type { Company } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

const DESCRIPTION = 'The terms for using the hitroo website.';
export const metadata = pageMetadata({ title: 'Terms of use', description: DESCRIPTION, path: '/terms' });

const A = 'font-medium text-char underline decoration-char/30 underline-offset-4 hover:decoration-char';

/** The sections, with the contact details from `company` content. */
const sections = (COMPANY: Company): LegalSection[] => [
  {
    title: 'Using this site',
    body: [
      'You may browse, read and share our pages. Please don’t misuse the site: no attempts to break, overload or get around its security, and no bulk copying of its content beyond normal search indexing.',
    ],
  },
  {
    title: 'Our content',
    body: [
      <>
        The text, images, logo and code on this site belong to hitroo or its licensors. Use our logo only as shown in the{' '}
        <Link href="/brand" className={A}>
          brand kit
        </Link>
        .
      </>,
    ],
  },
  {
    title: 'General information',
    body: ['Our articles and posts are general information, not advice for your situation. Talk to us before relying on them.'],
  },
  {
    title: 'Other sites',
    body: ['We link to sites we don’t control and aren’t responsible for their content.'],
  },
  {
    title: 'Liability',
    body: ['We work to keep the site accurate and available, but provide it as it is. As far as the law allows, hitroo isn’t liable for losses from using it.'],
  },
  {
    title: 'Projects',
    body: ['Work we do for you is covered by our written agreement with you, not by these terms.'],
  },
  {
    title: 'Privacy',
    body: [
      <>
        How we handle your data is set out in our{' '}
        <Link href="/privacy" className={A}>
          privacy policy
        </Link>{' '}
        and{' '}
        <Link href="/cookies" className={A}>
          cookie policy
        </Link>
        .
      </>,
    ],
  },
  {
    title: 'Changes and law',
    body: ['We may update these terms; the date above shows the current version. These terms are governed by the laws of India, and the courts of Chennai, Tamil Nadu have jurisdiction.'],
  },
  {
    title: 'Contact',
    body: [
      <>
        Questions? Email{' '}
        <a href={`mailto:${COMPANY.email}`} className={A}>
          {COMPANY.email}
        </a>
        .
      </>,
    ],
  },
];

export default async function TermsPage() {
  const COMPANY = await getContent('company');
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Terms of use', '/terms', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Terms of use', path: '/terms' }])} />
      <PageIntro word="terms" caption="Legal" title="Terms of use" lede="The rules for using this website. Last updated 26 September 2026." />
      <LegalSections sections={sections(COMPANY)} />
    </>
  );
}
