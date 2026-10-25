import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BrainCircuit, Code2, Eye, Layers, Megaphone, ShieldCheck, Users, Workflow } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import ClosingCta from '@/components/warm/ClosingCta';
import FaqSection from '@/components/warm/FaqSection';
import { DivisionVisual } from '@/components/warm/DivisionVisual';
import PageIntro from '@/components/warm/PageIntro';
import StepCards from '@/components/warm/StepCards';
import { TouchPill } from '@/components/warm/WarmHeader';
import { Engagements, StandardsCard } from '@/components/warm/blocks';
import { CARD, H_M, H_S, PointCards, TEXT_LINK, Tight, WContainer, WSection } from '@/components/warm/ui';
import { getContent, getDivisionVisuals } from '@/lib/content';
import { abs, breadcrumbLd, faqLd, pageMetadata, webPageLd } from '@/lib/seo';
import { cn } from '@/lib/utils';

const DESCRIPTION =
  'Everything hitroo does, across four divisions: Software (custom software, mobile and desktop apps, managed services), Automation (workflows and AI agents), AI (custom models and vision) and Creatives (social media, done for you).';

export const metadata = pageMetadata({
  title: 'What we do — software, automation, AI and creatives',
  description: DESCRIPTION,
  path: '/services',
  keywords: ['software development services', 'app development', 'AI development services', 'AI automation services', 'computer vision services', 'managed services', 'social media management'],
});

/** Which division answers which problem. */
const ROUTES = [
  { slug: 'software', icon: Code2, title: 'Need an app or a system?', text: 'Software builds it, and runs it for you.' },
  { slug: 'automation', icon: Workflow, title: 'Losing hours to busywork?', text: 'Automation takes the repetitive work off your team.' },
  { slug: 'ai', icon: BrainCircuit, title: 'Sitting on data?', text: 'AI turns it into answers you can rely on.' },
  { slug: 'creatives', icon: Megaphone, title: 'Quiet on social media?', text: 'Creatives runs it for you.' },
];


/** What we do: every division and service. All of it is shared content (divisions, showcase, services, audience, …). */
export default async function ServicesPage() {
  const [DIVISIONS, SHOWCASE, services, visuals, AUDIENCE, ENGAGEMENTS, DELIVERY_STEPS, PROMISES, FAQ] = await Promise.all([
    getContent('divisions'),
    getContent('showcase'),
    getContent('services'),
    getDivisionVisuals(),
    getContent('audience'),
    getContent('engagements'),
    getContent('steps'),
    getContent('promises'),
    getContent('faq:general'),
  ]);
  return (
    <>
      <JsonLd data={webPageLd('CollectionPage', 'What we do', '/services', DESCRIPTION)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: [
            ...DIVISIONS.map((d) => ({ name: `hitroo ${d.name}`, url: abs(`/${d.slug}`) })),
            ...services.map((s) => ({ name: s.title, url: abs(`/services/${s.slug}`) })),
          ].map((it, i) => ({ '@type': 'ListItem', position: i + 1, ...it })),
        }}
      />
      <JsonLd data={breadcrumbLd([{ name: 'What we do', path: '/services' }])} />
      <JsonLd data={faqLd(FAQ)} />

      <PageIntro
        word="services"
        caption="What we do"
        title="Four divisions. One standard across them."
        lede="Software, automation, AI and creatives, built and supported end to end."
        action={<TouchPill label="Book a free call" />}
      />

      <WSection id="routes-title" caption="At a glance" title="Start with the problem." lede="We’ll point you to the right team.">
        <ul className="grid gap-4 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-4">
          {ROUTES.map(({ slug, icon: Icon, title, text }) => (
            <li key={slug}>
              <Link href={`#${slug}-title`} className={cn(CARD, 'group grid h-full grid-rows-[auto_auto_1fr_auto] transition-colors hover:ring-char/20')}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand">
                  <Icon aria-hidden="true" className="h-5 w-5 text-ember" strokeWidth={1.75} />
                </span>
                <span className={cn(H_S, 'mt-10 block')}>{title}</span>
                <span className="mt-3 block text-[16px] font-medium leading-relaxed text-char/75">{text}</span>
                <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold text-char group-hover:text-ember">
                  {DIVISIONS.find((d) => d.slug === slug)?.name}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </WSection>

      {/* Each division: its glass numeral and promise beside what it offers */}
      {DIVISIONS.map((d, i) => {
        const show = SHOWCASE.find((s) => s.slug === d.slug);
        if (!show) return null;
        return (
          <section key={d.slug} aria-labelledby={`${d.slug}-title`} className="scroll-mt-24 pb-20 lg:pb-28">
            <WContainer>
              <div className="grid gap-4 rounded-[32px] bg-white p-5 ring-1 ring-char/5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="flex flex-col rounded-[24px] bg-paper p-7 sm:p-9">
                  <p className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.06em] text-char">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ember font-jakarta text-[13px] font-extrabold text-white">{i + 1}</span>
                    {d.name}
                    {d.isNew && <span className="rounded-full bg-char px-2.5 py-0.5 text-[11px] font-bold tracking-[0.08em] text-white">NEW</span>}
                  </p>
                  <h2 id={`${d.slug}-title`} className={cn(H_M, 'mt-6 [text-wrap:balance]')}>
                    <Tight>{show.title}</Tight>
                  </h2>
                  <DivisionVisual visual={visuals[d.slug]} n={String(i + 1).padStart(2, '0')} className="mt-8 aspect-[16/9] w-full lg:aspect-auto lg:min-h-[220px] lg:flex-1" />
                  <Link href={`/${d.slug}`} className={cn(TEXT_LINK, 'mt-8 self-start')}>
                    All of {d.name}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
                <ul className="grid gap-4 sm:auto-rows-fr sm:grid-cols-2">
                  {d.offers.map((o) => {
                    const inner = (
                      <>
                        <span className="flex items-start justify-between gap-4">
                          <span className={H_S}>{o.title}</span>
                          {o.href && (
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember text-white transition-transform duration-300 group-hover:rotate-45">
                              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                            </span>
                          )}
                        </span>
                        <span className="mt-3 block text-[16px] font-medium leading-relaxed text-char/75">{o.text}</span>
                      </>
                    );
                    return (
                      <li key={o.title} className="sm:[&:last-child:nth-child(odd)]:col-span-2">
                        {o.href ? (
                          <Link href={o.href} className="group flex h-full flex-col rounded-[24px] bg-paper p-7 transition-colors hover:bg-sand">
                            {inner}
                          </Link>
                        ) : (
                          <div className="flex h-full flex-col rounded-[24px] bg-paper p-7">{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </WContainer>
          </section>
        );
      })}

      <WSection id="audience-title" caption="Who we work with" title="Built for every stage of a business.">
        <PointCards items={AUDIENCE} />
      </WSection>

      <WSection id="ways-title" caption="Ways to work with us" title="Three ways to engage." lede="Every engagement starts with a free call.">
        <Engagements items={ENGAGEMENTS} />
      </WSection>

      <WSection id="steps-title" caption="How we deliver" title="A defined process, visible at every stage.">
        <StepCards steps={DELIVERY_STEPS} />
      </WSection>

      <StandardsCard id="promises-title" caption="What you can count on" title="Promises we keep, in every division." items={PROMISES} icons={[Users, Layers, ShieldCheck, Eye]} />

      <FaqSection items={FAQ} />

      <ClosingCta title="Not sure where to start?" line="Tell us the problem. We reply within a day with the right team." label="Book a free call" />
    </>
  );
}
