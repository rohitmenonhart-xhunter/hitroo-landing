'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Caption, H_L, Tight, WContainer } from './ui';

/**
 * A manifesto line in large type whose words light up, one after another, as it scrolls through the screen.
 * Without JavaScript, or with reduced motion, every word is lit.
 */
export default function ScrollStatement({ id, caption, text }: { id: string; caption: string; text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(' ');
  const [lit, setLit] = useState(words.length);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // From the heading's top entering the lower fifth of the screen to its bottom passing the middle.
      const p = (vh * 0.8 - r.top) / (vh * 0.8 - vh * 0.5 + r.height);
      setLit(Math.round(Math.min(1, Math.max(0, p)) * words.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [words.length]);

  return (
    <section aria-labelledby={id} className="pb-20 lg:pb-28">
      <WContainer>
        <Caption>{caption}</Caption>
        <h2 id={id} ref={ref} className={cn(H_L, 'mt-8 max-w-[1240px]')}>
          {words.map((w, i) => (
            <span key={i} className={cn('transition-colors duration-500', i < lit ? 'text-char' : 'text-char/20')}>
              <Tight>{w}</Tight>{' '}
            </span>
          ))}
        </h2>
      </WContainer>
    </section>
  );
}
