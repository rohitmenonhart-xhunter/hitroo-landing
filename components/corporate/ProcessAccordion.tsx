'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ProcessStep {
  name: string;
  line: string;
  image: string;
  alt: string;
}

/**
 * "Fast, by design": the delivery steps as photo panels in a row, in order. The open step takes most
 * of the width with its photo and line; the others fold to narrow tinted strips with their name.
 * Hover, focus or tap opens a step. On phones the strips stack vertically.
 */
export default function ProcessAccordion({ steps }: { steps: ProcessStep[] }) {
  const [open, setOpen] = useState(0);

  return (
    <ol className="flex h-[640px] flex-col gap-2 md:h-[440px] md:flex-row md:gap-2.5 lg:h-[520px]">
      {steps.map((s, i) => {
        const on = i === open;
        const num = String(i + 1).padStart(2, '0');
        return (
          <li
            key={s.name}
            className={cn(
              'relative min-h-0 min-w-0 basis-0 overflow-hidden rounded-md bg-navy transition-[flex-grow] duration-700 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none',
              on ? 'grow-[5] md:grow-[6]' : 'grow'
            )}
          >
            <button
              type="button"
              aria-expanded={on}
              onClick={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(i)}
              className="group absolute inset-0 block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cobalt-light"
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(min-width: 1280px) 620px, (min-width: 768px) 60vw, 100vw"
                className={cn(
                  'object-cover transition-transform [transition-duration:1200ms] ease-out motion-reduce:transition-none',
                  on ? 'scale-100' : 'scale-[1.08]'
                )}
              />
              {/* Folded: a brand tint over the photo; open: a shade at the foot for the text. */}
              <span
                aria-hidden="true"
                className={cn('absolute inset-0 bg-navy/60 transition-opacity duration-500', on ? 'opacity-0' : 'opacity-100 group-hover:opacity-75')}
              />
              <span
                aria-hidden="true"
                className={cn('absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 via-35% to-transparent to-70% transition-opacity duration-500', on ? 'opacity-100' : 'opacity-0')}
              />

              {/* Folded label: across on phones, upright on wider screens. */}
              <span aria-hidden="true" className={cn('absolute inset-0 flex items-center gap-4 px-5 transition-opacity md:hidden', on ? 'opacity-0 duration-150' : 'opacity-100 delay-300 duration-300')}>
                <span className="text-[13px] font-medium tabular-nums text-white/70">{num}</span>
                <span className="text-[17px] font-medium text-white">{s.name}</span>
              </span>
              <span
                aria-hidden="true"
                className={cn('absolute inset-0 hidden flex-col items-center justify-between py-6 transition-opacity md:flex', on ? 'opacity-0 duration-150' : 'opacity-100 delay-300 duration-300')}
              >
                <span className="text-[13px] font-medium tabular-nums text-white/70">{num}</span>
                <span className="rotate-180 whitespace-nowrap text-[17px] font-medium text-white [writing-mode:vertical-rl]">{s.name}</span>
              </span>

              {/* Open: fixed width so the text never reflows while the panel widens. */}
              <span
                className={cn(
                  'absolute bottom-0 left-0 w-full p-6 transition md:w-[400px] lg:w-[480px] lg:p-8',
                  on ? 'translate-y-0 opacity-100 delay-200 duration-500' : 'translate-y-2 opacity-0 duration-150'
                )}
              >
                <span className="block text-[13px] font-medium tabular-nums text-cobalt-light">{num}</span>
                <span className="mt-1 block text-[26px] font-normal tracking-[-0.02em] text-white lg:text-[32px]">{s.name}</span>
                <span className="mt-1 block text-[16px] text-white/80">{s.line}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
