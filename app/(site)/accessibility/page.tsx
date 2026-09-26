import LegalSections, { type LegalSection } from '@/components/corporate/LegalSections';
import PageHero from '@/components/corporate/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { COMPANY } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

const DESCRIPTION = 'How HITROO makes its website usable for everyone, and how to tell us about a barrier.';
export const metadata = pageMetadata({ title: 'Accessibility', description: DESCRIPTION, path: '/accessibility' });

const A = 'font-medium text-cobalt hover:text-cobalt-dark';

const SECTIONS: LegalSection[] = [
  {
    title: 'Our aim',
    body: ['We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.'],
  },
  {
    title: 'What we do',
    body: [
      <ul key="do" className="grid list-disc gap-2 pl-5">
        <li>Keyboard access throughout, with a skip link and visible focus.</li>
        <li>Text alternatives for meaningful images.</li>
        <li>Motion that stops when your device asks for less.</li>
        <li>Layouts that work from phones to large screens.</li>
      </ul>,
    ],
  },
  {
    title: 'Found a barrier?',
    body: [
      <>
        Tell us what you were trying to do and where. Email{' '}
        <a href={`mailto:${COMPANY.email}`} className={A}>
          {COMPANY.email}
        </a>{' '}
        or call{' '}
        <a href={COMPANY.phoneHref} className={A}>
          {COMPANY.phone}
        </a>
        . We reply within a day and will get you the information another way while we fix it.
      </>,
    ],
  },
];

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Accessibility', '/accessibility', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Accessibility', path: '/accessibility' }])} />
      <PageHero eyebrow="Accessibility" title="A site for everyone." lede="What we do, and how to tell us when something doesn’t work. Last updated 26 September 2026." />
      <LegalSections sections={SECTIONS} />
    </>
  );
}
