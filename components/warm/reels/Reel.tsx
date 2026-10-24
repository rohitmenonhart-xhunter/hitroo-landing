import type { CSSProperties } from 'react';
import type { CaptionStyle, CreativeTint, Reel as ReelData } from '@/lib/division-pages';
import { cn } from '@/lib/utils';
import Media from '../Media';
import ReelCaption from './ReelCaption';

/** Library files are already display-sized WebPs: served as static files, they use no image transformations
 *  (the Hobby plan allows 5,000 a month) and never wait for an encode. */
export const isLibrary = (src: string) => src.startsWith('/photos/library/');

/** The Creatives colours, for chips and caption boxes (that page's content is colourful; its frame stays HITROO). */
export const TINT: Record<CreativeTint, string> = {
  ember: 'bg-ember text-white',
  pink: 'bg-[#FF3E8A] text-white',
  yellow: 'bg-[#FFD23F] text-char',
  lime: 'bg-[#B6F33B] text-char',
  teal: 'bg-[#00A6A6] text-white',
  lilac: 'bg-[#B9A6F2] text-char',
  cobalt: 'bg-[#2350E8] text-white',
  char: 'bg-char text-white',
};

/**
 * One reel: a vertical 9:16 picture with story bars on top, an optional caption and its format on a coloured chip.
 * The caption takes one of the trending looks (ReelCaption). A playing reel pushes in slowly and fills its first bar (CSS only; both stop for reduced motion).
 * No usernames, likes or view counts.
 */
export default function Reel({
  reel,
  playing,
  chip,
  tint,
  sizes = '260px',
  priority,
  className,
  imageStyle,
}: {
  reel: ReelData;
  playing?: boolean;
  /** Overrides the format on the chip. */
  chip?: string;
  /** Overrides the chip colour. */
  tint?: CreativeTint;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageStyle?: CSSProperties;
}) {
  return (
    <figure
      className={cn('relative aspect-[9/16] overflow-hidden rounded-[22px] bg-char ring-1 ring-char/10 [container-type:inline-size]', className)}
      style={reel.tone ? { backgroundColor: reel.tone } : undefined}
    >
      <Media
        image={reel}
        sizes={sizes}
        priority={priority}
        unoptimized={isLibrary(reel.src)}
        className={cn('object-cover', playing && 'animate-kenburns motion-reduce:animate-none')}
        style={imageStyle}
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-char/40 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-3 top-3 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/40">
            {i === 0 && <span className={cn('absolute inset-0 origin-left bg-white', playing ? 'animate-reelbar motion-reduce:animate-none' : 'scale-x-100')} />}
          </span>
        ))}
      </div>
      {reel.caption && <ReelCaption text={reel.caption} look={(reel.captionStyle ?? 'subtitle') as CaptionStyle} tint={reel.captionTint ?? undefined} />}
      <figcaption className={cn('absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em]', TINT[tint ?? reel.tint ?? 'char'] ?? TINT.char)}>
        {chip ?? reel.format}
      </figcaption>
    </figure>
  );
}
