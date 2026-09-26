import CtaBand from '@/components/corporate/CtaBand';
import LeaderQuote from '@/components/corporate/LeaderQuote';
import PageHero from '@/components/corporate/PageHero';
import ServiceGrid from '@/components/corporate/ServiceGrid';
import { ArrowLink, Section, SectionHeader, Statement } from '@/components/corporate/ui';
import JsonLd from '@/components/seo/JsonLd';
import { FOUNDER } from '@/lib/site-data';
import { breadcrumbLd, webPageLd } from '@/lib/seo';

const BELIEFS = [
  { title: 'One team, end to end.', text: 'The people who build your software also support it.' },
  { title: 'Fast, without shortcuts.', text: 'Working software early, tested at every step.' },
  { title: 'We stay after launch.', text: 'Support in one app, long after go-live.' },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={webPageLd('AboutPage', 'About HITROO', '/about', 'HITROO builds software, automation and AI for businesses of every size.')} />
      <JsonLd data={breadcrumbLd([{ name: 'About', path: '/about' }])} />
      <PageHero
        eyebrow="About"
        title="Powerful software, without the complexity."
        lede="A team building software, automation and AI for businesses of every size."
        image="/photos/about.webp"
        imageAlt="An open-plan software office in morning light, with rows of desks and glass meeting rooms"
      />

      <Statement
        id="story-title"
        eyebrow="Why we started"
        lines={['Advanced technology became too costly and too complex.', 'We make it simple, and within reach.']}
      />

      <Section labelledBy="beliefs-title">
        <SectionHeader id="beliefs-title" title="What we believe" />
        <ul className="mt-14 grid gap-14 md:grid-cols-3 md:gap-12 lg:mt-20">
          {BELIEFS.map((b) => (
            <li key={b.title}>
              <h3 className="text-[26px] font-light leading-tight tracking-[-0.02em] text-ink lg:text-[30px]">{b.title}</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-600">{b.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <LeaderQuote {...FOUNDER} />

      <Section labelledBy="about-services-title">
        <SectionHeader id="about-services-title" title="What we do" />
        <div className="mt-14 lg:mt-20">
          <ServiceGrid />
        </div>
      </Section>

      <Statement
        id="ai-view-title"
        eyebrow="Our view"
        lines={['Is AI a threat to software firms?', 'No. It makes the good ones faster.']}
        action={<ArrowLink href="/ai-perspective">Read our view</ArrowLink>}
      />

      <CtaBand />
    </>
  );
}
