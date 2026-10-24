'use client';

import { useEffect, useRef, useState } from 'react';
import type { Point } from '@/lib/site-data';
import { cn } from '@/lib/utils';
import { H_M } from '../ui';

/** A rounded loop in a 400 × 300 box, starting at the bottom centre and running clockwise. */
const LOOP = 'M200 262 H120 A70 70 0 0 1 50 192 V108 A70 70 0 0 1 120 38 H280 A70 70 0 0 1 350 108 V192 A70 70 0 0 1 280 262 Z';

/**
 * A cycle told as a loop: the steps scroll on the left while, on the right, an ember marker runs round a dotted
 * track past each stage, and the stage you are reading lights up. Back at the start, the loop begins again.
 * Phones get the track once, then the steps.
 */
export default function LoopTrack({ steps }: { steps: Point[] }) {
  const pathRef = useRef<SVGPathElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [len, setLen] = useState(0);
  const [stations, setStations] = useState<{ x: number; y: number }[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const l = path.getTotalLength();
    setLen(l);
    setStations(steps.map((_, i) => {
      const p = path.getPointAtLength((l * i) / steps.length);
      return { x: p.x, y: p.y };
    }));
  }, [steps]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = list.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the first step reaches the middle of the screen, 1 when the last one leaves it.
      const p = (vh * 0.5 - r.top) / Math.max(1, r.height);
      setProgress(Math.min(0.999, Math.max(0, p)));
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
  }, []);

  const active = Math.min(steps.length - 1, Math.floor(progress * steps.length));
  const marker = len && pathRef.current ? pathRef.current.getPointAtLength(progress * len) : { x: 200, y: 262 };

  const track = (
    <div className="relative aspect-[4/3] w-full">
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path ref={pathRef} d={LOOP} fill="none" stroke="#F5502F" strokeOpacity="0.22" strokeWidth="7" strokeLinecap="round" strokeDasharray="0.1 9" />
        {len > 0 && (
          <path d={LOOP} fill="none" stroke="#F5502F" strokeWidth="7" strokeLinecap="round" strokeDasharray="0.1 9" mask="url(#loop-done)" />
        )}
        <defs>
          <mask id="loop-done">
            <path d={LOOP} fill="none" stroke="white" strokeWidth="12" pathLength={1} strokeDasharray={`${progress} 1`} />
          </mask>
        </defs>
        <circle cx={marker.x} cy={marker.y} r="11" fill="#FFFFFF" />
        <circle cx={marker.x} cy={marker.y} r="7" fill="#F5502F" />
      </svg>
      {stations.map((s, i) => (
        <span
          key={steps[i].title}
          className={cn(
            'absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] transition-colors duration-300 sm:text-[13px]',
            i === active ? 'bg-char text-white' : 'bg-white text-char/60 ring-1 ring-char/10'
          )}
          style={{ left: `${(s.x / 400) * 100}%`, top: `${(s.y / 300) * 100}%` }}
        >
          {steps[i].title}
        </span>
      ))}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-4">
      <div className="lg:order-2">
        <div className="glass-warm flex items-center rounded-[32px] p-6 sm:p-10 lg:sticky lg:top-[18vh] lg:h-[64vh]">{track}</div>
      </div>
      <ol ref={listRef} className="lg:px-12">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={cn(
              'flex flex-col justify-center border-t border-char/10 py-10 transition-opacity duration-500 first:border-t-0 lg:min-h-[52vh]',
              i === active ? 'lg:opacity-100' : 'lg:opacity-30'
            )}
          >
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-ember">Stage {String(i + 1).padStart(2, '0')}</p>
            <h3 className={cn(H_M, 'mt-4')}>{s.title}</h3>
            <p className="mt-4 max-w-[520px] text-[17px] font-medium leading-[1.55] text-char/75 sm:text-[19px]">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
