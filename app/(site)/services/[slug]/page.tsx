import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import CtaBand from '@/components/corporate/CtaBand';
import FaqList from '@/components/corporate/FaqList';
import PageHero from '@/components/corporate/PageHero';
import ServiceGrid from '@/components/corporate/ServiceGrid';
import { ArrowLink, Button, Section, SectionHeader, Statement } from '@/components/corporate/ui';
import { getService, services } from '@/lib/site-data';
import JsonLd from '@/components/seo/JsonLd';
import { serviceFaq } from '@/lib/faq';
import { breadcrumbLd, faqLd, pageMetadata, serviceLd } from '@/lib/seo';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getService(params.slug);
  if (!s) return { title: 'Service', robots: { index: false } };
  return pageMetadata({
    title: `${s.title} — ${s.tagline}`,
    description: s.overview,
    path: `/services/${s.slug}`,
    keywords: [s.title, s.label, ...s.capabilities, ...s.stack, 'HITROO'],
  });
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const s = getService(params.slug);
  if (!s) notFound();

  return (
    <>
      <JsonLd data={serviceLd(s)} />
      <JsonLd data={faqLd(serviceFaq(s))} />
      <JsonLd data={breadcrumbLd([{ name: 'Services', path: '/services' }, { name: s.title, path: `/services/${s.slug}` }])} />
      <PageHero
        eyebrow="Services"
        title={s.title}
        lede={s.short}
        actions={
          <>
            <Button href="/contact">Start a project</Button>
            <ArrowLink href="/services">All services</ArrowLink>
          </>
        }
        image={s.image}
        imageAlt={s.imageAlt}
      />

      <Statement id="problem-title" eyebrow="The problem" lines={[s.pain]} />

      <Section labelledBy="included-title">
        <SectionHeader id="included-title" title="What you get" />
        <ul className="mt-14 grid gap-x-12 gap-y-7 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {s.capabilities.map((c) => (
            <li key={c} className="flex items-start gap-3 text-[17px] text-ink">
              <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-cobalt" strokeWidth={2.5} />
              {c}
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="approach-title">
        <div className="grid gap-20 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionHeader id="approach-title" title="How we work" />
            <ol className="mt-12 grid gap-8">
              {s.approach.map((step, i) => (
                <li key={step} className="flex items-baseline gap-5">
                  <span aria-hidden="true" className="w-6 shrink-0 text-[28px] font-light leading-none text-cobalt tabular-nums">
                    {i + 1}
                  </span>
                  <span className="text-[22px] font-light tracking-[-0.015em] text-ink">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-[32px] font-light leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px] lg:text-[44px]">Results</h2>
            <ul className="mt-12 grid gap-7">
              {s.outcomes.map((o) => (
                <li key={o} className="text-[24px] font-light tracking-[-0.02em] text-ink">
                  {o}
                </li>
              ))}
            </ul>
            <p className="mt-10 text-[14px] text-slate-500">{s.stack.join(' · ')}</p>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-title">
        <SectionHeader id="faq-title" title="Questions" />
        <div className="mt-10 lg:mt-14">
          <FaqList items={serviceFaq(s)} />
        </div>
      </Section>

      <Section labelledBy="more-title">
        <SectionHeader id="more-title" title="Other services" />
        <div className="mt-14 lg:mt-20">
          <ServiceGrid exclude={s.slug} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
