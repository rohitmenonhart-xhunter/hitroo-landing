import Image from 'next/image';
import ContactBlock from '@/components/corporate/ContactBlock';
import PageHero from '@/components/corporate/PageHero';
import LeaderQuote from '@/components/corporate/LeaderQuote';
import ProcessAccordion from '@/components/corporate/ProcessAccordion';
import ServiceGrid from '@/components/corporate/ServiceGrid';
import StoryCarousel from '@/components/corporate/StoryCarousel';
import { ArrowLink, Button, Eyebrow, Section, SectionHeader, Statement } from '@/components/corporate/ui';
import { AUDIENCE, HOME_QUOTE, PROCESS_STEPS, STORIES, SUPPORT, WHY_HITROO_STATEMENT, WHY_NEED } from '@/lib/site-data';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { pageMetadata, webPageLd } from '@/lib/seo';

const HOME_DESCRIPTION =
  'HITROO builds custom software, mobile and desktop apps, AI models, automation and computer-vision systems for businesses — built fast, security-tested and supported after launch.';

export const metadata: Metadata = {
  ...pageMetadata({ title: 'HITROO — Custom Software, Apps, Automation & AI', description: HOME_DESCRIPTION, path: '/' }),
  title: { absolute: 'HITROO — Custom Software, Apps, Automation & AI' },
};

export default function Home() {
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'HITROO — Custom Software, Apps, Automation & AI', '/', HOME_DESCRIPTION)} />
      <PageHero
        title="We build the software your business runs on."
        lede="Custom software, automation and AI that save hours and help you grow."
        actions={
          <>
            <Button href="/contact">Start a project</Button>
            <ArrowLink href="/services">Explore services</ArrowLink>
          </>
        }
        image="/photos/hero.webp"
        imageAlt="A meeting room after a planning session, with laptops, reports and a dashboard on the wall screen"
        imagePosition="50% 15%"
        spacious
      />

      <Statement
        id="why-title"
        eyebrow="Why HITROO"
        lines={WHY_HITROO_STATEMENT}
        action={<ArrowLink href="/ai-perspective">Is AI a threat to software firms? Our view</ArrowLink>}
      />

      <Section labelledBy="why-need-title">
        <SectionHeader id="why-need-title" title="Why your business needs it" />
        <ul className="mt-14 grid gap-14 md:grid-cols-3 md:gap-10 lg:mt-20">
          {WHY_NEED.map((w) => (
            <li key={w.title} className="flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-mist">
                <Image src={w.image} alt={w.alt} fill sizes="(min-width: 1240px) 370px, (min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <h3 className="mt-6 text-[22px] font-medium tracking-[-0.015em] text-ink">{w.title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-slate-600">{w.text}</p>
              <ArrowLink href={w.href} className="mt-auto self-start pt-5">
                {w.cta}
              </ArrowLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="services-title">
        <SectionHeader
          id="services-title"
          title="What we build"
          action={<ArrowLink href="/services">All services</ArrowLink>}
        />
        <div className="mt-14 lg:mt-20">
          <ServiceGrid />
        </div>
      </Section>

      <StoryCarousel stories={STORIES} />

      <Section labelledBy="how-title">
        <SectionHeader
          id="how-title"
          title="Fast, by design"
          lede="Working software early, tested at every step."
          action={<ArrowLink href="/contact">Start a project</ArrowLink>}
        />
        <div className="mt-14 lg:mt-20">
          <ProcessAccordion steps={PROCESS_STEPS} />
        </div>
      </Section>

      <LeaderQuote {...HOME_QUOTE} />

      <Section labelledBy="support-title">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-mist">
            <Image src={SUPPORT.image} alt={SUPPORT.imageAlt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          </div>
          <div>
            <Eyebrow>Support</Eyebrow>
            <h2 id="support-title" className="mt-4 text-[32px] font-light leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px] lg:text-[44px]">
              Support in one app.
            </h2>
            <p className="mt-5 text-[18px] leading-relaxed text-slate-600">
              Raise a ticket from any device. First reply in 24 hours, most fixes in 48.
            </p>
            <p className="mt-4 text-[14px] text-slate-500">{SUPPORT.platforms.join(' · ')}</p>
            <ArrowLink href="/support" className="mt-8">
              How support works
            </ArrowLink>
          </div>
        </div>
      </Section>

      <Section labelledBy="serve-title">
        <SectionHeader id="serve-title" title="Who we work with" />
        <ul className="mt-14 grid gap-14 md:grid-cols-3 md:gap-10 lg:mt-20">
          {AUDIENCE.map((a) => (
            <li key={a.title}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-mist">
                <Image src={a.image} alt={a.alt} fill sizes="(min-width: 1240px) 370px, (min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <h3 className="mt-5 text-[20px] font-medium tracking-[-0.015em] text-ink">{a.title}</h3>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="contact-title">
        <SectionHeader id="contact-title" title="Let’s build what your business needs." lede="We reply within a day." />
        <div className="mt-14 lg:mt-20">
          <ContactBlock idPrefix="home" />
        </div>
      </Section>
    </>
  );
}
