'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { Capability } from '@/lib/division-pages';
import { cn } from '@/lib/utils';

const num = (i: number) => String(i + 1).padStart(2, '0');

/**
 * What a division builds: the list on the left, the picked capability's detail in a glass panel on the right
 * (hover, focus or click picks one). Every panel shares one grid cell, so the panel keeps the height of the
 * longest and nothing jumps. Below desktop the list is skipped and the panels swipe sideways.
 */
export default function CapabilityExplorer({ items, id }: { items: Capability[]; id: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ul className="hidden flex-col justify-between gap-1 lg:flex">
        {items.map((c, i) => (
          <li key={c.title}>
            <button
              type="button"
              aria-controls={`${id}-${i}`}
              aria-expanded={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                'flex w-full items-center gap-6 rounded-[20px] px-6 py-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-char',
                i === active ? 'bg-white ring-1 ring-char/[0.06]' : 'hover:bg-white/60'
              )}
            >
              <span className={cn('font-jakarta text-[15px] font-extrabold tabular-nums', i === active ? 'text-ember' : 'text-char/40')}>{num(i)}</span>
              <span className={cn('flex-1 font-display text-[clamp(22px,1.9vw,28px)] font-bold tracking-[-0.03em]', i === active ? 'text-char' : 'text-char/50')}>{c.title}</span>
              <ArrowRight aria-hidden="true" className={cn('h-5 w-5 transition-all', i === active ? 'text-char' : '-translate-x-2 text-transparent')} />
            </button>
          </li>
        ))}
      </ul>
      <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:overflow-visible lg:px-0">
        {items.map((c, i) => (
          <div
            key={c.title}
            id={`${id}-${i}`}
            className={cn(
              'glass-warm flex w-[86%] shrink-0 snap-start flex-col rounded-[28px] p-7 sm:w-[60%] sm:p-10 lg:w-auto lg:[grid-area:1/1]',
              i !== active && 'lg:invisible'
            )}
          >
            <p className="font-jakarta text-[15px] font-extrabold tabular-nums text-ember">{num(i)}</p>
            <h3 className="mt-4 font-display text-[clamp(28px,3.1vw,44px)] font-bold leading-[1.08] tracking-[-0.035em] text-char">{c.title}</h3>
            <p className="mt-4 max-w-[560px] text-[17px] font-medium leading-[1.5] text-char/75 sm:text-[19px]">{c.text}</p>
            <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.06em] text-stone">Included</p>
            <ul className="mt-4 grid gap-3 lg:grid-cols-2">
              {c.included.map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-[16px] font-medium leading-snug text-char lg:rounded-[16px] lg:bg-white/70 lg:p-4 lg:ring-1 lg:ring-char/5">
                  <Check aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0 text-ember" strokeWidth={2.5} />
                  {x}
                </li>
              ))}
            </ul>
            {c.href && (
              <Link
                href={c.href}
                className="mt-auto inline-flex items-center gap-2 self-start pt-10 text-[16px] font-medium text-char underline decoration-char/30 underline-offset-[6px] hover:decoration-char"
              >
                Learn more<span className="sr-only"> about {c.title}</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
