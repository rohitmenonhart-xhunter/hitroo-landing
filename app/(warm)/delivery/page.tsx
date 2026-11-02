import Link from 'next/link';
import LegalSections, { type LegalSection } from '@/components/corporate/LegalSections';
import PageIntro from '@/components/warm/PageIntro';
import JsonLd from '@/components/seo/JsonLd';
import { getContent } from '@/lib/content';
import type { Company } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

const DESCRIPTION = 'How hitroo delivers software projects: online, in stages, with nothing shipped physically.';
export const metadata = pageMetadata({ title: 'Service delivery', description: DESCRIPTION, path: '/delivery' });

const A = 'font-medium text-char underline decoration-char/30 underline-offset-4 hover:decoration-char';

const sections = (COMPANY: Company): LegalSection[] => [
  {
    title: 'Nothing is shipped',
    body: ['hitroo builds software: websites, web and mobile apps, desktop apps, AI and automation. Everything is delivered online. We don’t sell or ship physical goods, so there are no shipping charges or courier timelines.'],
  },
  {
    title: 'What you receive',
    body: [
      'Designs to review at a private link, where you can comment directly on the screens.',
      'Your software at a private preview link while it’s being built, then live on your domain or in the app stores.',
      'The source code and documentation, handed over when the project is paid in full.',
      'Your quote, agreement and invoices, sent by email or WhatsApp.',
    ],
  },
  {
    title: 'When it starts',
    body: ['Work starts once the first payment for your project is received, usually the same day. Each later stage starts when its payment is received.'],
  },
  {
    title: 'How long it takes',
    body: ['Your quote describes the stages of your project. We share progress as each part is finished and tested. Timelines we give are estimates and depend on your answers and materials reaching us on time.'],
  },
  {
    title: 'After launch',
    body: [
      <>
        Defects are fixed free for 60 days after launch. After that, support, maintenance and hosting are available as a monthly plan. See{' '}
        <Link href="/pricing" className={A}>
          pricing
        </Link>
        .
      </>,
    ],
  },
  {
    title: 'Questions',
    body: [
      <>
        Email{' '}
        <a href={`mailto:${COMPANY.email}`} className={A}>
          {COMPANY.email}
        </a>{' '}
        or call {COMPANY.phone}.
      </>,
    ],
  },
];

export default async function DeliveryPage() {
  const COMPANY = await getContent('company');
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Service delivery', '/delivery', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Service delivery', path: '/delivery' }])} />
      <PageIntro word="delivery" caption="Legal" title="Service delivery" lede="How we deliver your project. Last updated 2 November 2026." />
      <LegalSections sections={sections(COMPANY)} />
    </>
  );
}
