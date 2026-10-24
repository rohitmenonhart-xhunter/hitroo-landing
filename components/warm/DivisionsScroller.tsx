'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { DivisionImage } from '@/lib/division-pages';
import type { HomeContent } from '@/lib/page-content';
import type { Showcase } from '@/lib/site-data';
import { cn } from '@/lib/utils';
import Glass from './Glass';
import { DivisionVisual } from './DivisionVisual';
import { TouchPill } from './WarmHeader';
import { Caption, Tight } from './ui';

const LABEL = 'text-[12px] font-medium uppercase tracking-[0.06em] text-stone';
/** Pinned, sideways scrolling needs room: wide and tall enough screens, and motion allowed. */
const PIN_QUERY = '(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)';

/** A division's showcase card, with its "New" badge and image (from its page content). */
export type ShowcaseCard = Showcase & { isNew?: boolean | null; visual?: DivisionImage | null };
type Copy = HomeContent['divisions'];

/** One division as a large two-half card: the case on the left, the glass numeral and standards on the right. */
function DivisionCard({ d, index, copy }: { d: ShowcaseCard; index: number; copy: Copy }) {
  const num = String(index + 1).padStart(2, '0');
  return (
    <article aria-labelledby={`showcase-${d.slug}`} className="grid h-full grid-cols-1 gap-8 rounded-[32px] bg-white p-7 ring-1 ring-char/[0.06] sm:p-9 lg:grid-cols-2 lg:gap-10 lg:p-10 lg:short:gap-8 lg:short:p-8">
      <div className="flex min-w-0 flex-col">
        <p className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.06em] text-char">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ember font-jakarta text-[13px] font-extrabold text-white">{index + 1}</span>
          {d.name}
          {d.isNew && <span className="rounded-full bg-char px-2.5 py-0.5 text-[11px] font-bold tracking-[0.08em] text-white">NEW</span>}
        </p>
        <h3 id={`showcase-${d.slug}`} className="mt-5 font-jakarta text-[clamp(30px,2.6vw,44px)] font-extrabold leading-[1.02] tracking-[-0.045em] text-char [text-wrap:balance] lg:short:mt-4 lg:short:text-[clamp(26px,2.2vw,34px)]">
          <Tight>{d.title}</Tight>
        </h3>
        <p className="mt-4 text-[16px] font-medium leading-[1.55] text-char/75 xl:text-[17px] lg:short:mt-3 lg:short:text-[15px] lg:short:leading-[1.5]">{d.text}</p>
        <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:short:mt-4 lg:short:gap-y-2.5">
          {d.capabilities.map((c) => (
            <li key={c.title} className="border-t border-char/10 pt-3 lg:short:pt-2">
              <p className="text-[15px] font-bold leading-snug text-char">{c.title}</p>
              <p className="mt-0.5 text-[14px] font-medium leading-snug text-char/60">{c.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-7 lg:short:pt-4">
          <TouchPill href={`/${d.slug}`} label={`${copy.explore} ${d.name}`} />
          <Link href="/contact" className="inline-flex items-center gap-2 text-[15px] font-medium text-char underline decoration-char/30 underline-offset-[6px] hover:decoration-char">
            {copy.discuss}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-6 lg:short:gap-4">
        <DivisionVisual visual={d.visual} n={num} className="aspect-[16/10] w-full lg:aspect-auto lg:min-h-0 lg:flex-1" />
        <div>
          <p className={LABEL}>{copy.standards}</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {d.standards.map((s) => (
              <li key={s} className="flex items-start gap-2 text-[14px] font-medium leading-snug text-char">
                <Check aria-hidden="true" className="mt-[2px] h-4 w-4 shrink-0 text-ember" strokeWidth={2.5} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

/** Where the four division chips sit around the centre, in % of the square diagram. */
const NODES = [
  { x: 20, y: 18 },
  { x: 80, y: 18 },
  { x: 20, y: 82 },
  { x: 80, y: 82 },
];

/** The closing card: start with one division, add the rest; the four divisions joined to one centre. */
function PartnerCard({ names, copy }: { names: string[]; copy: Copy['partner'] }) {
  const nodes = NODES.slice(0, names.length).map((n, i) => ({ ...n, name: names[i] }));
  return (
    <div className="grid h-full grid-cols-1 gap-10 rounded-[32px] bg-char p-7 text-white sm:p-9 lg:grid-cols-2 lg:p-12 lg:short:p-9">
      <div className="flex flex-col">
        <p className="flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.06em] text-white/80">
          <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-ember" />
          {copy.caption}
        </p>
        <h3 className="mt-6 font-jakarta text-[clamp(34px,3.6vw,58px)] font-extrabold leading-[1] tracking-[-0.045em] [text-wrap:balance]">
          <Tight>{copy.title}</Tight>
        </h3>
        <p className="mt-6 max-w-[520px] text-[17px] font-medium leading-relaxed text-white/70">{copy.text}</p>
        <TouchPill className="mt-auto self-start" label={copy.action} />
      </div>
      <div className="flex items-center justify-center">
        <div aria-hidden="true" className="relative aspect-square w-full max-w-[460px] lg:h-full lg:max-h-[520px] lg:w-auto lg:max-w-full">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            {nodes.map((n) => (
              <line key={n.name} x1={n.x} y1={n.y} x2="50" y2="50" stroke="rgba(255,255,255,0.18)" strokeWidth="0.35" strokeDasharray="1.2 1.2" />
            ))}
          </svg>
          <div className="absolute left-1/2 top-1/2 flex aspect-square w-[38%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-char ring-1 ring-white/20">
            <Glass name="hi-ink" className="h-[58%] w-auto" />
          </div>
          {nodes.map((n) => (
            <span
              key={n.name}
              className="glass-ink absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-5 py-2 text-[15px] font-medium text-white"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              {n.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Home: the four divisions as large cards. On big screens the section pins and the cards slide sideways as
 * you scroll down, with a numbered progress line; elsewhere they stack.
 */
export default function DivisionsScroller({ items, names, copy }: { items: ShowcaseCard[]; names: string[]; copy: Copy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const count = items.length + 1;

  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const onChange = () => setPinned(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!pinned || !section || !track) {
      if (track) track.style.transform = '';
      return;
    }
    let frame = 0;
    let travel = 0;
    const measure = () => {
      travel = Math.max(0, track.scrollWidth - track.clientWidth);
      setDistance(travel);
    };
    const update = () => {
      frame = 0;
      const span = section.offsetHeight - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / span)) : 0;
      track.style.transform = `translate3d(${-p * travel}px, 0, 0)`;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
      setActive(Math.min(count - 1, Math.round(p * (count - 1))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [pinned, count]);

  const heading = (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-10">
      <div>
        <Caption>{copy.caption}</Caption>
        <h2 id="divisions-title" className="mt-5 font-jakarta text-[clamp(36px,4.4vw,64px)] font-extrabold leading-[1] tracking-[-0.045em] text-char [text-wrap:balance] lg:short:mt-3 lg:short:text-[clamp(34px,3.4vw,46px)]">
          <Tight>{copy.title}</Tight>
        </h2>
      </div>
      {pinned && (
        <div aria-hidden="true" className="w-full max-w-[420px]">
          <div className="flex justify-between">
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full font-jakarta text-[13px] font-extrabold transition-colors duration-300',
                  i <= active ? 'bg-ember text-white' : 'bg-white text-char/50 ring-1 ring-char/10'
                )}
              >
                {i < count - 1 ? i + 1 : '✦'}
              </span>
            ))}
          </div>
          <div className="relative mt-3 h-[2px] overflow-hidden rounded-full bg-char/10">
            <span ref={fillRef} className="absolute inset-0 origin-left scale-x-0 bg-ember" />
          </div>
        </div>
      )}
    </div>
  );

  if (!pinned) {
    return (
      <section ref={sectionRef} aria-labelledby="divisions-title" className="py-20 lg:py-28">
        {heading}
        <div ref={trackRef} className="mx-auto mt-10 grid max-w-[1440px] gap-5 px-5 sm:px-8 lg:px-10">
          {items.map((d, i) => (
            <DivisionCard key={d.slug} d={d} index={i} copy={copy} />
          ))}
          <PartnerCard names={names} copy={copy.partner} />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-labelledby="divisions-title" style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 overflow-hidden pb-6 pt-24 short:gap-5 short:pb-5 short:pt-[72px]">
        {heading}
        <div
          ref={trackRef}
          className="flex min-h-0 flex-1 gap-5 will-change-transform"
          style={{ paddingInline: 'max(40px, calc((100vw - 1440px) / 2 + 40px))' }}
        >
          {items.map((d, i) => (
            <div key={d.slug} className="h-full w-[min(1180px,calc(100vw-120px))] shrink-0">
              <DivisionCard d={d} index={i} copy={copy} />
            </div>
          ))}
          <div className="h-full w-[min(1180px,calc(100vw-120px))] shrink-0">
            <PartnerCard names={names} copy={copy.partner} />
          </div>
        </div>
      </div>
    </section>
  );
}
