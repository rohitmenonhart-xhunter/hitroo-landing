import CareersForm from '@/components/corporate/CareersForm';
import PageHero from '@/components/corporate/PageHero';
import { Section } from '@/components/corporate/ui';
import JsonLd from '@/components/seo/JsonLd';
import { COMPANY } from '@/lib/site-data';
import { breadcrumbLd, webPageLd } from '@/lib/seo';

export default function CareersPage() {
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Careers', '/careers', 'Roles in software, AI/ML and hardware engineering at HITROO.')} />
      <JsonLd data={breadcrumbLd([{ name: 'Careers', path: '/careers' }])} />
      <PageHero eyebrow="Careers" title="Build with us." lede="A 3-month internship, real projects and a path to full-time. Mostly remote." />
      <Section labelledBy="apply-title">
        <h2 id="apply-title" className="mb-14 text-[32px] font-light tracking-[-0.03em] text-ink sm:text-[40px]">
          Apply
        </h2>
        <CareersForm />
        <p className="mt-14 max-w-2xl text-[15px] leading-relaxed text-slate-500">
          Beware of fake offers. We never ask for money, and we only write from an @hitroo.com address. Unsure? Email{' '}
          <a href={`mailto:${COMPANY.email}`} className="font-medium text-cobalt hover:text-cobalt-dark">
            {COMPANY.email}
          </a>
          .
        </p>
      </Section>
    </>
  );
}
