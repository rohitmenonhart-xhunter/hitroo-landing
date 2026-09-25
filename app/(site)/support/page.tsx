import CtaBand from '@/components/corporate/CtaBand';
import PageHero from '@/components/corporate/PageHero';
import { Button, Section, SectionHeader, Statement } from '@/components/corporate/ui';
import { SUPPORT } from '@/lib/site-data';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, webPageLd } from '@/lib/seo';

export default function SupportPage() {
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Support', '/support', 'Support in one app: first reply in 24 hours, most fixes in 48.')} />
      <JsonLd data={breadcrumbLd([{ name: 'Support', path: '/support' }])} />
      <PageHero
        eyebrow="Support"
        title="Support in one app."
        lede="Raise a ticket from any device and talk to the team that built your software."
        actions={<Button href="/contact">Become a client</Button>}
        image={SUPPORT.image}
        imageAlt={SUPPORT.imageAlt}
      />

      <Statement id="sla-title" lines={['First reply in 24 hours.', 'Most fixes in 48.']} />

      <Section labelledBy="steps-title">
        <SectionHeader id="steps-title" title="How it works" />
        <ol className="mt-14 grid grid-cols-2 gap-x-10 gap-y-14 lg:mt-20 lg:grid-cols-4">
          {SUPPORT.steps.map((step, i) => (
            <li key={step}>
              <span className="text-[44px] font-light leading-none tracking-[-0.03em] text-cobalt tabular-nums">{i + 1}</span>
              <h3 className="mt-5 text-[20px] font-medium tracking-[-0.01em] text-ink">{step}</h3>
            </li>
          ))}
        </ol>
        <p className="mt-20 text-[16px] text-slate-600">Available on {SUPPORT.platforms.join(', ').replace(/, ([^,]*)$/, ' and $1')}.</p>
      </Section>

      <CtaBand title="Build with a team that stays." line="Every project ships with the HITROO app." />
    </>
  );
}
