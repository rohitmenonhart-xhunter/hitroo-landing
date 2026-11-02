import Link from 'next/link';
import LegalSections, { type LegalSection } from '@/components/corporate/LegalSections';
import PageIntro from '@/components/warm/PageIntro';
import JsonLd from '@/components/seo/JsonLd';
import { getContent } from '@/lib/content';
import type { Company } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

const DESCRIPTION = 'When you can cancel a project with hitroo, and how refunds work.';
export const metadata = pageMetadata({ title: 'Cancellations and refunds', description: DESCRIPTION, path: '/refunds' });

const A = 'font-medium text-char underline decoration-char/30 underline-offset-4 hover:decoration-char';

const sections = (COMPANY: Company): LegalSection[] => [
  {
    title: 'How payments work',
    body: [
      <>
        Every project starts with a written quote and agreement. You pay in instalments through secure payment links, as set out in your quote: for example, part to start, part at the main milestone and the rest at launch. See{' '}
        <Link href="/pricing" className={A}>
          pricing
        </Link>
        .
      </>,
      'Each payment covers the work in that stage. Work on a stage starts once its payment is received. hitroo is operated by Mockello, so payments and refunds are in Mockello’s name.',
    ],
  },
  {
    title: 'Cancelling before work starts',
    body: ['If you cancel within 24 hours of a payment, and before any work from that stage has been shared with you, we refund that payment in full.'],
  },
  {
    title: 'Cancelling during a project',
    body: [
      'You can end a project at any time by writing to us. Payments for stages that have started or been delivered are not refundable, because the work has been done. You keep everything we delivered for the stages you paid for, and we hand it over.',
      'Instalments that have not fallen due are cancelled and you owe nothing more.',
    ],
  },
  {
    title: 'If we can’t deliver',
    body: ['If we cancel a project, or can’t deliver what your agreement describes, we refund what you paid for the work that was not delivered.'],
  },
  {
    title: 'Fixes are free',
    body: ['For 60 days after launch we fix defects in what we delivered at no charge, so a problem with the work is fixed rather than refunded.'],
  },
  {
    title: 'Duplicate or mistaken payments',
    body: ['If you are charged twice, or pay more than an instalment, we refund the extra in full.'],
  },
  {
    title: 'How refunds are paid',
    body: ['Approved refunds go back to the original payment method within 5 to 7 working days. Your bank may take a few more days to show it.'],
  },
  {
    title: 'Ask for a refund',
    body: [
      <>
        Email{' '}
        <a href={`mailto:${COMPANY.email}`} className={A}>
          {COMPANY.email}
        </a>{' '}
        with your name, the project and the payment. We reply within 2 working days.
      </>,
    ],
  },
];

export default async function RefundsPage() {
  const COMPANY = await getContent('company');
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Cancellations and refunds', '/refunds', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Cancellations and refunds', path: '/refunds' }])} />
      <PageIntro word="refunds" caption="Legal" title="Cancellations and refunds" lede="When you can cancel, and how refunds work. Last updated 2 November 2026." />
      <LegalSections sections={sections(COMPANY)} />
    </>
  );
}
