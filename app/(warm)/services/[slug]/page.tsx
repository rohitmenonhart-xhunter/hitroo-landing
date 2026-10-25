import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import ClosingCta from '@/components/warm/ClosingCta';
import FaqSection from '@/components/warm/FaqSection';
import type { GlassWordName } from '@/components/warm/Glass';
import PageIntro from '@/components/warm/PageIntro';
import StepCards from '@/components/warm/StepCards';
import { TouchPill } from '@/components/warm/WarmHeader';
import { Engagements } from '@/components/warm/blocks';
import { CARD, H_M, LinkCards, PointCards, Statement, Tight, WSection } from '@/components/warm/ui';
import { findDivision, findService, getContent } from '@/lib/content';
import { serviceFaq } from '@/lib/faq';
import { breadcrumbLd, faqLd, pageMetadata, serviceLd } from '@/lib/seo';
import { cn } from '@/lib/utils';

/** Each service's word in glass at the top of its page (a service added in the admin shows "services"). */
const WORD: Record<string, GlassWordName> = {
  'custom-software': 'custom',
  'mobile-apps': 'mobile',
  'desktop-apps': 'desktop',
  'ai-models': 'models',
  'ai-automation': 'agents',
  'vision-systems': 'vision',
  'managed-services': 'managed',
};

// Every service in the content is prerendered; one added later in the admin renders on its first visit.
export async function generateStaticParams() {
  return (await getContent('services')).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = findService(await getContent('services'), params.slug);
  if (!s) return { title: 'Service', robots: { index: false } };
  return pageMetadata({
    title: `${s.title} — ${s.tagline}`,
    description: s.overview,
    path: `/services/${s.slug}`,
    keywords: [s.title, s.label, ...s.capabilities, ...s.stack, 'hitroo'],
  });
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const [services, divisions, ENGAGEMENTS] = await Promise.all([getContent('services'), getContent('divisions'), getContent('engagements')]);
  const s = findService(services, params.slug);
  if (!s) notFound();
  const d = findDivision(divisions, s.division);
  if (!d) notFound();
  const faq = serviceFaq(s);
  const more = [
    { href: `/${d.slug}`, title: `All of ${d.name}`, text: d.line },
    ...services.filter((o) => o.division === s.division && o.slug !== s.slug).map((o) => ({ href: `/services/${o.slug}`, title: o.label, text: o.short })),
  ];
  if (more.length < 2) more.push({ href: '/services', title: 'Everything we do', text: 'Every division and every service.' });

  return (
    <>
      <JsonLd data={serviceLd(s)} />
      <JsonLd data={faqLd(faq)} />
      <JsonLd
        data={breadcrumbLd([
          { name: d.name, path: `/${d.slug}` },
          { name: s.title, path: `/services/${s.slug}` },
        ])}
      />
      <PageIntro word={WORD[s.slug] ?? 'services'} caption={`hitroo ${d.name}`} title={s.title} lede={s.short} action={<TouchPill label="Book a free call" />} />

      <Statement id="problem-title" caption="The problem" lines={[s.pain, `${s.tagline}.`]} />

      <WSection id="included-title" caption="What’s included" title="Everything it takes, in one place." lede={s.overview}>
        <ul className="grid gap-4 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-3">
          {s.capabilities.map((c) => (
            <li key={c} className={cn(CARD, 'flex items-start gap-4')}>
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember text-white">
                <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className="font-display text-[20px] font-bold leading-snug tracking-[-0.025em] text-char">{c}</span>
            </li>
          ))}
        </ul>
      </WSection>

      <WSection id="approach-title" caption="How we build it" title="Three stages, visible to you.">
        <StepCards steps={s.approach.map((a): [string, string] => [a, ''])} />
      </WSection>

      <WSection id="outcomes-title" caption="What changes" title="What you’ll notice.">
        <ul className="grid gap-4 md:grid-cols-3">
          {s.outcomes.map((o, i) => (
            <li key={o} className="glass-warm flex flex-col rounded-[28px] p-8 sm:p-10">
              <span className="font-jakarta text-[15px] font-extrabold tabular-nums text-ember">{String(i + 1).padStart(2, '0')}</span>
              <p className={cn(H_M, 'mt-10 [text-wrap:balance]')}>
                <Tight>{`${o}.`}</Tight>
              </p>
            </li>
          ))}
        </ul>
      </WSection>

      <WSection id="for-title" caption="Who it’s for" title="Who this helps most.">
        <PointCards items={d.forWho} />
      </WSection>

      <WSection id="ways-title" caption="Ways to work with us" title="Three ways to engage." lede="Every engagement starts with a free call.">
        <Engagements items={ENGAGEMENTS} />
      </WSection>

      <FaqSection items={faq} />

      <WSection id="more-title" caption={`More from ${d.name}`} title="You might also need.">
        <LinkCards items={more} />
      </WSection>

      <ClosingCta title={`Talk to us about ${s.label.toLowerCase().replace(/^ai /, 'AI ')}.`} line="Tell us what you need. We reply within a day." label="Book a free call" />
    </>
  );
}
