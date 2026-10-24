'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Glass from './Glass';
import type { GlassName } from './glass-sizes';
import { H_M } from './ui';

export interface StepPhoto {
  src: string;
  alt: string;
}

/**
 * A process told as a story: on large screens a panel holds still on the left (the stage's photo, or its glass
 * numeral) while the stages scroll past on the right, the one in the middle of the screen lit. Phones get each
 * stage's picture above its text.
 */
export default function StickySteps({ steps, photos, label = 'Stage' }: { steps: [string, string][]; photos?: StepPhoto[]; label?: string }) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.step))),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const glass = (i: number) => `step-0${i + 1}` as GlassName;
  const num = (i: number) => String(i + 1).padStart(2, '0');
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-4">
      <div className="hidden lg:block">
        <div className={cn('sticky top-[16vh] h-[68vh] overflow-hidden rounded-[32px]', photos ? 'bg-sand' : 'bg-white ring-1 ring-char/5')}>
          {steps.map((_, i) =>
            photos ? (
              <Image
                key={i}
                src={photos[i].src}
                alt={i === active ? photos[i].alt : ''}
                fill
                sizes="(min-width: 1440px) 680px, 48vw"
                className={cn('object-cover transition-all duration-700', i === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0')}
              />
            ) : (
              <div key={i} className={cn('absolute inset-0 flex items-center justify-center transition-all duration-700', i === active ? 'scale-100 opacity-100' : 'scale-95 opacity-0')}>
                <Glass name={glass(i)} alt="" className="h-[40%] w-auto" />
              </div>
            )
          )}
          <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
            <span className="glass-warm rounded-full px-4 py-2 text-[14px] font-medium text-char">
              {label} {num(active)} · {steps[active][0]}
            </span>
            <span aria-hidden="true" className="glass-warm flex gap-1.5 rounded-full px-3 py-3">
              {steps.map((_, i) => (
                <span key={i} className={cn('h-1.5 rounded-full transition-all duration-500', i === active ? 'w-8 bg-ember' : 'w-3 bg-char/20')} />
              ))}
            </span>
          </div>
        </div>
      </div>
      <ol className="lg:px-12">
        {steps.map(([title, text], i) => (
          <li
            key={title}
            ref={(el) => {
              items.current[i] = el;
            }}
            data-step={i}
            className={cn(
              'flex flex-col justify-center border-t border-char/10 py-10 transition-opacity duration-500 first:border-t-0 lg:min-h-[56vh]',
              i === active ? 'lg:opacity-100' : 'lg:opacity-30'
            )}
          >
            {photos ? (
              <div className="relative mb-7 aspect-[16/10] overflow-hidden rounded-[24px] bg-sand lg:hidden">
                <Image src={photos[i].src} alt={photos[i].alt} fill sizes="100vw" className="object-cover" />
              </div>
            ) : (
              <Glass name={glass(i)} alt="" className="mb-6 h-[72px] w-auto self-start lg:hidden" />
            )}
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-ember">
              {label} {num(i)}
            </p>
            <h3 className={cn(H_M, 'mt-4')}>{title}</h3>
            <p className="mt-4 max-w-[520px] text-[17px] font-medium leading-[1.55] text-char/75 sm:text-[19px]">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
