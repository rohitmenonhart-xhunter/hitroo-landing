import type { ReactNode } from 'react';
import type { Reel as ReelData } from '@/lib/division-pages';
import { cn } from '@/lib/utils';
import { GlassWord } from '../Glass';
import { Caption, Tight, WContainer } from '../ui';
import Reel from './Reel';

/** The fan: five reels mirrored around the centre one, which plays. Phones show the middle three. */
const FAN = [
  { x: -2, r: -11, y: 56, s: 0.82, z: 1 },
  { x: -1, r: -5.5, y: 18, s: 0.91, z: 2 },
  { x: 0, r: 0, y: 0, s: 1, z: 3 },
  { x: 1, r: 5.5, y: 18, s: 0.91, z: 2 },
  { x: 2, r: 11, y: 56, s: 0.82, z: 1 },
];

/**
 * Creatives' signature opening: everything centred, the name in glass, a big headline, then a fan of reels like
 * prints dealt across a table.
 */
export default function ReelsHero({ title, lede, action, reels, isNew }: { title: string; lede: string; action: ReactNode; reels: ReelData[]; isNew?: boolean }) {
  return (
    <section aria-labelledby="hero-title" className="overflow-x-clip pb-20 lg:pb-28">
      <WContainer className="flex flex-col items-center pt-6 text-center lg:pt-10">
        <GlassWord word="creatives" />
        <div className="mt-10 flex items-center gap-3">
          <Caption>hitroo Creatives</Caption>
          {isNew && <span className="rounded-full bg-char px-2.5 py-0.5 text-[11px] font-bold tracking-[0.08em] text-white">NEW</span>}
        </div>
        <h1 id="hero-title" className="mt-6 max-w-[980px] font-display text-[clamp(40px,6.2vw,96px)] font-extrabold leading-[0.95] tracking-[-0.05em] text-char [text-wrap:balance]">
          <Tight>{title}</Tight>
        </h1>
        <p className="mt-6 max-w-[620px] text-[17px] font-medium leading-[1.5] tracking-[-0.01em] text-char/80 sm:text-[19px]">{lede}</p>
        <div className="mt-8">{action}</div>
      </WContainer>
      <div className="relative mx-auto mt-14 h-[350px] max-w-[1200px] sm:h-[520px] lg:mt-20 lg:h-[600px]">
        {reels.slice(0, 5).map((reel, i) => {
          const f = FAN[i];
          return (
            <div
              key={reel.src}
              className={cn('absolute left-1/2 top-0 w-[180px] sm:w-[220px] lg:w-[260px]', (i === 0 || i === 4) && 'hidden sm:block')}
              style={{
                zIndex: f.z,
                transform: `translateX(calc(-50% + ${f.x} * var(--fan-step))) translateY(${f.y}px) rotate(${f.r}deg) scale(${f.s})`,
                ['--fan-step' as string]: 'clamp(118px, 17vw, 214px)',
              }}
            >
              <Reel reel={reel} playing={i === 2} priority={i === 2} sizes="(min-width: 1024px) 260px, 220px" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
