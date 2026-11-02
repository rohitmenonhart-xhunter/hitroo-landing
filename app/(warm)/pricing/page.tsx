import Link from 'next/link';
import LegalSections, { type LegalSection } from '@/components/corporate/LegalSections';
import PageIntro from '@/components/warm/PageIntro';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

const DESCRIPTION = 'How hitroo prices software projects, with starting prices, payments and support plans.';
export const metadata = pageMetadata({ title: 'Pricing', description: DESCRIPTION, path: '/pricing' });

const A = 'font-medium text-char underline decoration-char/30 underline-offset-4 hover:decoration-char';

const STARTING: Array<[string, string]> = [
  ['Landing page', '₹18,000'],
  ['Business website', '₹42,000'],
  ['Web app', '₹1,40,000'],
  ['Mobile app (iOS or Android)', '₹2,10,000'],
  ['Desktop app (Windows or macOS)', '₹2,10,000'],
  ['A change to an app we built', '₹3,000'],
];

const sections: LegalSection[] = [
  {
    title: 'A fixed price for your project',
    body: [
      'We price by what you need built, not by the hour: the screens, the features, the platforms and the integrations. You get a written quote with exactly what’s included and a fixed price for it, before anything starts.',
      'Our prices are typically about a third of what a mid-sized agency charges for the same work, and every quote shows that comparison.',
    ],
  },
  {
    title: 'Starting prices',
    body: [
      <ul key="starting" className="grid gap-2">
        {STARTING.map(([what, from]) => (
          <li key={what} className="flex justify-between gap-6 border-b border-char/10 pb-2">
            <span>{what}</span>
            <span className="font-semibold text-char">from {from}</span>
          </li>
        ))}
      </ul>,
      'Prices are in Indian rupees. GST is added where it applies.',
    ],
  },
  {
    title: 'Paying in stages',
    body: [
      'A new project is paid 40% to start, 40% at the main milestone and 20% at launch. A change request is paid in full upfront when it’s small, or half to start and half before it goes live.',
      'You pay online by card, UPI, net banking or wallet through a secure payment link, and receive an invoice for every payment. Payments are made to Mockello, which operates hitroo.',
    ],
  },
  {
    title: 'Changes',
    body: ['Anything beyond your quote is a change request with its own quote, priced the same way. Nothing is added to your bill without your approval.'],
  },
  {
    title: 'Support and hosting',
    body: [
      'Defects are fixed free for 60 days after launch.',
      'After that, support and maintenance is about 18% of the project price a year, paid monthly. Hosting starts at ₹1,500 a month, depending on the app.',
    ],
  },
  {
    title: 'Get a quote',
    body: [
      <>
        Tell us what you need on the{' '}
        <Link href="/contact" className={A}>
          contact page
        </Link>
        . See also{' '}
        <Link href="/refunds" className={A}>
          cancellations and refunds
        </Link>{' '}
        and{' '}
        <Link href="/delivery" className={A}>
          service delivery
        </Link>
        .
      </>,
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Pricing', '/pricing', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Pricing', path: '/pricing' }])} />
      <PageIntro word="pricing" caption="Company" title="Pricing" lede="Fixed prices, paid in stages, with nothing hidden." />
      <LegalSections sections={sections} />
    </>
  );
}
