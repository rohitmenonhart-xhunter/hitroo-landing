'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Tight } from '../ui';

/**
 * Two huge lines that slide past each other as the section scrolls through the screen (the first left, the second
 * right). Only transforms change, and only while the section is on screen; reduced motion leaves them still.
 */
export default function KineticLine({ lines, id }: { lines: [string, string]; id: string }) {
  const ref = useRef<HTMLElement>(null);
  const a = useRef<HTMLSpanElement>(null);
  const b = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      if (a.current) a.current.style.transform = `translate3d(${12 - p * 34}%, 0, 0)`;
      if (b.current) b.current.style.transform = `translate3d(${-22 + p * 34}%, 0, 0)`;
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(el);
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const LINE = 'block whitespace-nowrap font-display text-[clamp(56px,11vw,180px)] font-extrabold leading-[0.95] tracking-[-0.055em] will-change-transform';
  return (
    <section ref={ref} aria-labelledby={id} className="overflow-hidden pb-20 lg:pb-28">
      <h2 id={id} className="sr-only">
        {lines.join(' ')}
      </h2>
      <div aria-hidden="true">
        <span ref={a} className={cn(LINE, 'text-char')} style={{ transform: 'translate3d(0, 0, 0)' }}>
          <Tight>{lines[0]}</Tight>
        </span>
        <span ref={b} className={cn(LINE, 'text-ember')} style={{ transform: 'translate3d(-10%, 0, 0)' }}>
          <Tight>{lines[1]}</Tight>
        </span>
      </div>
    </section>
  );
}
