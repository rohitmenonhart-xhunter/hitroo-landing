import Link from 'next/link';
import LegalSections, { type LegalSection } from '@/components/corporate/LegalSections';
import PageHero from '@/components/corporate/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { COMPANY } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

const DESCRIPTION = 'The terms for using the HITROO website.';
export const metadata = pageMetadata({ title: 'Terms of use', description: DESCRIPTION, path: '/terms' });

const A = 'font-medium text-cobalt hover:text-cobalt-dark';

const SECTIONS: LegalSection[] = [
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
        The text, images, logo and code on this site belong to HITROO or its licensors. Use our logo only as shown in the{' '}
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
    body: ['We work to keep the site accurate and available, but provide it as it is. As far as the law allows, HITROO isn’t liable for losses from using it.'],
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

export default function TermsPage() {
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Terms of use', '/terms', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Terms of use', path: '/terms' }])} />
      <PageHero eyebrow="Legal" title="Terms of use" lede="The rules for using this website. Last updated 26 September 2026." />
      <LegalSections sections={SECTIONS} />
    </>
  );
}
