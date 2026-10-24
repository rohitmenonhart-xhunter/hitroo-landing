'use client';

import { useRef } from 'react';
import { BrainCircuit, Code2, LifeBuoy, Megaphone, Monitor, ScanEye, Smartphone, Workflow } from 'lucide-react';
import { WORDMARK_GLASS } from '@/components/warm/glass-style';
import GlassWordmark from '@/components/clear/GlassWordmark';
import { TouchPill } from './WarmHeader';
import { H_PAGE, P, Tight, WContainer } from './ui';

/** The icon for each tag under the hero, by position (Custom software, Mobile apps, … Support). */
const TAG_ICONS = [Code2, Smartphone, Monitor, Workflow, BrainCircuit, ScanEye, Megaphone, LifeBuoy];

/** Home hero: the name in clear glass across the page (it ripples under the cursor), the headline, then what we do. */
export default function WarmHero({ title, lede, action, tags }: { title: string; lede: string; action: string; tags: string[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  return (
    <section aria-labelledby="hero-title">
      <div className="relative isolate h-[min(100vw,460px)] sm:h-[clamp(190px,30vw,470px)]">
        <GlassWordmark hero={WORDMARK_GLASS} boxRef={boxRef} plain background="#FCF8F6" />
        <div ref={boxRef} className="pointer-events-none absolute inset-x-5 inset-y-0 sm:inset-x-8 lg:inset-x-10" />
      </div>
      <WContainer className="grid gap-8 pb-14 pt-8 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-16 lg:pb-20">
        <h1 id="hero-title" className={H_PAGE}>
          <Tight>{title}</Tight>
        </h1>
        <div>
          <p className={P}>{lede}</p>
          <TouchPill className="mt-7" label={action} />
        </div>
      </WContainer>
      <div className="border-y border-char/10">
        <WContainer>
          <ul className="flex gap-x-8 gap-y-3 overflow-x-auto py-5 [scrollbar-width:none] md:flex-wrap md:justify-between md:overflow-visible">
            {tags.map((label, i) => {
              const Icon = TAG_ICONS[i % TAG_ICONS.length];
              return (
                <li key={label} className="flex shrink-0 items-center gap-2 text-[16px] font-medium text-char/80">
                  <Icon aria-hidden="true" className="h-[18px] w-[18px] text-ember" strokeWidth={1.75} />
                  {label}
                </li>
              );
            })}
          </ul>
        </WContainer>
      </div>
    </section>
  );
}
