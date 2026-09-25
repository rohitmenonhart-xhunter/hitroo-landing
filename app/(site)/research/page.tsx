import { BrainCircuit, Eye, Gauge, Workflow } from 'lucide-react';
import CtaBand from '@/components/corporate/CtaBand';
import PageHero from '@/components/corporate/PageHero';
import { Section, SectionHeader, Statement } from '@/components/corporate/ui';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, webPageLd } from '@/lib/seo';

const FOCUS = [
  { icon: BrainCircuit, title: 'Applied AI', text: 'Models that hold up in production.' },
  { icon: Eye, title: 'Computer vision', text: 'Models that see and inspect the real world.' },
  { icon: Workflow, title: 'Automation', text: 'Agents that take real work off people.' },
  { icon: Gauge, title: 'Systems', text: 'Making slow, fragile software fast and reliable.' },
];

export default function ResearchPage() {
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Research', '/research', 'Applied AI, vision and systems research that ships into real products.')} />
      <JsonLd data={breadcrumbLd([{ name: 'Research', path: '/research' }])} />
      <PageHero
        eyebrow="Research"
        title="We research the hard problems."
        lede="Applied AI, vision and systems work that ships into real products."
        image="/photos/research.webp"
        imageAlt="A machine-vision camera over a metal test part on an R&D lab bench"
      />

      <Statement id="approach-title" lines={['We study real business problems, especially the hard ones.', 'Then we ship the answers as product.']} />

      <Section labelledBy="focus-title">
        <SectionHeader id="focus-title" title="Focus areas" />
        <ul className="mt-14 grid gap-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-10">
          {FOCUS.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon aria-hidden="true" className="h-7 w-7 text-cobalt" strokeWidth={1.5} />
              <h3 className="mt-6 text-[20px] font-medium tracking-[-0.01em] text-ink">{title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title="Got a problem worth solving?" line="Tell us about it." label="Talk to us" />
    </>
  );
}
