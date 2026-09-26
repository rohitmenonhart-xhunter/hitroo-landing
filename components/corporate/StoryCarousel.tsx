'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Story {
  eyebrow: string;
  lines: string[];
  text: string;
  href: string;
  cta: string;
  image: string;
  alt: string;
}

const ARROW =
  'absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_8px_24px_-8px_rgba(10,22,51,0.25)] ring-1 ring-ink/5 transition-colors hover:text-cobalt focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt lg:flex';

/** Editorial story cards: a cinematic photo fills each card, the serif headline sits on a navy shade; changes only when asked. */
export default function StoryCarousel({ stories }: { stories: Story[] }) {
  const [current, setCurrent] = useState(0);
  const go = (step: number) => setCurrent((i) => (i + step + stories.length) % stories.length);

  return (
    <section aria-roledescription="carousel" aria-label="Our story" className="py-24 sm:py-32 lg:py-40">
      <div className="relative mx-auto w-full max-w-[1340px] px-5 sm:px-8 lg:px-[70px]">
        <div className="relative overflow-hidden rounded-3xl bg-navy">
          {stories.map((s, n) => {
            const shown = n === current;
            return (
              <div
                key={s.href}
                role="group"
                aria-roledescription="slide"
                aria-label={`${n + 1} of ${stories.length}`}
                aria-hidden={!shown}
                className={cn(
                  'transition-opacity duration-700 motion-reduce:transition-none',
                  shown ? 'relative opacity-100' : 'pointer-events-none invisible absolute inset-0 opacity-0'
                )}
              >
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1340px) 1200px, 100vw"
                  className={cn(
                    'object-cover object-[72%_50%] transition-transform [transition-duration:6000ms] ease-out motion-reduce:transition-none md:object-center',
                    shown ? 'scale-100' : 'scale-[1.04]'
                  )}
                />
                {/* Shade for the text: from the foot on phones, from the left on wider screens. */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 via-40% to-navy/10 md:bg-gradient-to-r md:from-navy/95 md:via-navy/70 md:via-35% md:to-transparent md:to-70%" />
                <div className="relative z-10 flex min-h-[560px] flex-col justify-end px-8 pb-10 pt-48 sm:px-12 md:min-h-[480px] md:max-w-[600px] md:justify-center md:py-16 lg:min-h-[520px] lg:pl-16">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-cobalt-light">{s.eyebrow}</p>
                  <h2 className="mt-5 font-serif text-[32px] font-normal leading-[1.12] tracking-[-0.01em] text-cream sm:text-[40px] lg:text-[46px]">
                    {s.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                  <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/75">{s.text}</p>
                  <Link
                    href={s.href}
                    className="mt-8 inline-flex items-center gap-1.5 self-start text-[13px] font-semibold uppercase tracking-[0.12em] text-cobalt-light transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt-light"
                  >
                    {s.cta}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" aria-label="Previous story" onClick={() => go(-1)} className={cn(ARROW, 'left-0')}>
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button type="button" aria-label="Next story" onClick={() => go(1)} className={cn(ARROW, 'right-0')}>
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
        <div className="mt-6 flex justify-center gap-2">
          {stories.map((s, n) => (
            <button
              key={s.href}
              type="button"
              aria-label={`Show story ${n + 1}: ${s.eyebrow}`}
              aria-current={n === current}
              onClick={() => setCurrent(n)}
              className={cn('h-1.5 rounded-full transition-all duration-300', n === current ? 'w-8 bg-cobalt' : 'w-3 bg-slate-300 hover:bg-slate-400')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
