import { Check } from 'lucide-react';
import type { CaptionStyle, CreativeTint, Reel as ReelData } from '@/lib/division-pages';
import Reel from './Reel';

/** Each variation re-cuts the winning reel: a new colourway, crop or mirror, the same idea. */
const VARIATIONS = [
  {},
  { filter: 'hue-rotate(290deg) saturate(1.1)' },
  { filter: 'hue-rotate(160deg)', transform: 'scaleX(-1)' },
  { filter: 'hue-rotate(55deg) saturate(1.15)', transform: 'scale(1.25)', transformOrigin: '50% 45%' },
];
const CHIPS = ['ember', 'pink', 'teal', 'lime'] as const;
/** Each variation also tries a new hook style: a different caption look and colour. */
const HOOKS: { look: CaptionStyle; tint: CreativeTint }[] = [
  { look: 'outline', tint: 'char' },
  { look: 'sticker', tint: 'pink' },
  { look: 'karaoke', tint: 'teal' },
  { look: 'hormozi', tint: 'lime' },
];

/** The best performer and the variations made from it, with what happens next; no invented numbers. */
export default function WinnerReels({ reel, notes }: { reel: ReelData; notes: string[] }) {
  return (
    <div className="glass-warm rounded-[32px] p-5 sm:p-8 lg:p-10">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {VARIATIONS.map((style, i) => (
          <Reel
            key={i}
            reel={{ ...reel, captionStyle: HOOKS[i].look, captionTint: HOOKS[i].tint }}
            tint={CHIPS[i]}
            chip={i === 0 ? 'Best performer' : `Variation 0${i}`}
            playing={i === 0}
            sizes="(min-width: 640px) 300px, 45vw"
            imageStyle={style}
          />
        ))}
      </div>
      <ul className="mt-6 grid gap-2 sm:mt-8">
        {notes.map((n) => (
          <li key={n} className="flex items-center gap-3 rounded-[14px] bg-white/70 px-4 py-3 text-[15px] font-medium text-char ring-1 ring-char/5 sm:text-[16px]">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember text-white">
              <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}
