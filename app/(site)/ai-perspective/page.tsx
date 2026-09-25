import { Layers, RefreshCw, ShieldCheck } from 'lucide-react';
import CtaBand from '@/components/corporate/CtaBand';
import PageHero from '@/components/corporate/PageHero';
import { Eyebrow, Section, SectionHeader, Statement } from '@/components/corporate/ui';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, faqLd } from '@/lib/seo';

const AI_DOES = ['Drafts a prototype in hours', 'Explores ideas fast', 'Writes routine code'];
const TEAM_DOES = ['Understands your business', 'Designs the architecture and security', 'Tests, launches and supports it for years'];

const HOW = [
  { icon: Layers, title: 'Inside our architecture', text: 'AI works within a structure we design and control, so we always know what’s happening.' },
  { icon: RefreshCw, title: 'For faster iterations', text: 'Every cycle speeds up: prototype, feedback, change.' },
  { icon: ShieldCheck, title: 'Behind layers of tests', text: 'Every change passes layers of testing, so speed never costs quality.' },
];

const LIST = 'mt-8 grid gap-5 text-[24px] font-light leading-snug tracking-[-0.02em] lg:text-[28px]';

export default function AiPerspectivePage() {
  return (
    <>
      <JsonLd
        data={faqLd([
          { q: 'Is AI a threat to HITROO?', a: 'No. AI makes us faster. It doesn’t replace what we do: AI can draft a prototype in hours, but software a business runs on still takes a team.' },
          { q: 'How does HITROO use AI?', a: HOW.map((h) => `${h.title}: ${h.text}`).join(' ') },
          { q: 'Will AI replace software companies?', a: 'No. Smartphones didn’t replace the computer; they multiplied the software the world needs. AI will do the same. It makes the good software companies faster.' },
        ])}
      />
      <JsonLd data={breadcrumbLd([{ name: 'Our view on AI', path: '/ai-perspective' }])} />
      <PageHero
        eyebrow="Our view"
        title="Is AI a threat to HITROO?"
        lede="No. AI makes us faster. It doesn’t replace what we do."
        image="/photos/ai-view.webp"
        imageAlt="An engineer’s workstation in the evening, with a code editor and an AI chat panel on screen"
        imagePosition="50% 40%"
      />

      <Statement id="can-title" lines={['AI can draft a prototype in hours.', 'Software a business runs on still takes a team.']} />

      <Section labelledBy="split-title">
        <h2 id="split-title" className="sr-only">
          What AI does well, and what still takes a team
        </h2>
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <div>
            <Eyebrow>What AI does well</Eyebrow>
            <ul className={`${LIST} text-slate-500`}>
              {AI_DOES.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>What still takes a team</Eyebrow>
            <ul className={`${LIST} text-ink`}>
              {TEAM_DOES.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section labelledBy="how-title">
        <SectionHeader id="how-title" title="How we use AI" />
        <ul className="mt-14 grid gap-14 md:grid-cols-3 md:gap-12 lg:mt-20">
          {HOW.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon aria-hidden="true" className="h-7 w-7 text-cobalt" strokeWidth={1.5} />
              <h3 className="mt-6 text-[20px] font-medium tracking-[-0.01em] text-ink">{title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Statement
        id="pattern-title"
        eyebrow="The pattern"
        lines={['Smartphones didn’t replace the computer. They multiplied the software the world needs.', 'AI will do the same.']}
      />

      <CtaBand title="AI won’t replace software companies. It makes the good ones faster." line="More of your problems solved, faster, at a fair price." />
    </>
  );
}
