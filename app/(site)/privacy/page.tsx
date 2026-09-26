import Link from 'next/link';
import LegalSections, { type LegalSection } from '@/components/corporate/LegalSections';
import PageHero from '@/components/corporate/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { COMPANY } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

const DESCRIPTION = 'What HITROO collects on this website, why, how long we keep it, and your choices.';
export const metadata = pageMetadata({ title: 'Privacy policy', description: DESCRIPTION, path: '/privacy' });

const SECTIONS: LegalSection[] = [
  {
    title: 'What we collect',
    body: [
      'Messages and job applications you send us: your name, contact details, message and, for applications, your resume.',
      'Page views: the page, the site that referred you, your country and city (from the network, not stored as an IP address), device type, browser and language.',
      'How pages are used: the links and buttons you click, how far you scroll or read, and how long a page stays open. A random visit number, held only in the page’s memory and never stored on your device, groups the pages of one visit.',
      'If you accept cookies, a random visitor ID so we can see returning visits. We never store IP addresses and never sell data.',
    ],
  },
  {
    title: 'Why',
    body: ['To reply to you, to review applications, and to understand which pages help people so we can improve the site.'],
  },
  {
    title: 'Cookies',
    body: [
      'hitroo_consent remembers your choice for one year.',
      'hitroo_vid is a random visitor ID, set only if you accept, kept for one year.',
      'hitroo_sid, in your browser’s session storage and only if you accept, groups the pages of one visit; it clears when you close the tab.',
      <>
        We use no advertising or third-party tracking cookies. Change your choice any time with “Cookie settings” in the footer. Details are in our{' '}
        <Link href="/cookies" className="font-medium text-cobalt hover:text-cobalt-dark">
          cookie policy
        </Link>
        .
      </>,
    ],
  },
  {
    title: 'Where it is stored',
    body: [
      'Our database runs on Fly.io in Singapore and the website on Vercel. Email is handled by Google Workspace. Cloudflare Turnstile may check forms for spam.',
    ],
  },
  {
    title: 'How long',
    body: ['Messages and applications are kept as long as needed to respond and for our records. Page-view data is kept for up to 24 months.'],
  },
  {
    title: 'Your rights',
    body: [`You can ask to see, correct or delete your data at any time. Email ${COMPANY.email} and we will respond within 30 days.`],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Privacy policy', '/privacy', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Privacy policy', path: '/privacy' }])} />
      <PageHero eyebrow="Privacy" title="Privacy policy" lede="What we collect, why, and your choices. Last updated 26 September 2026." />
      <LegalSections sections={SECTIONS} />
    </>
  );
}
