import type { DivisionImage } from '@/lib/division-pages';
import { cn } from '@/lib/utils';
import GlassNumeral from './GlassNumeral';
import Media from './Media';
import { WContainer } from './ui';

/** A division's image on a card (its page content's `visual`); a division without one shows its glass numeral instead. */
export function DivisionVisual({ visual, n, className, sizes = '(min-width: 1024px) 560px, 90vw' }: { visual?: DivisionImage | null; n: string; className?: string; sizes?: string }) {
  if (!visual) return <GlassNumeral n={n} className={className} />;
  return (
    <div className={cn('relative overflow-hidden rounded-[22px] bg-sand', className)}>
      <Media image={visual} sizes={sizes} className="object-cover" />
    </div>
  );
}

const PANELS = { 1: 'aspect-[4/3] sm:aspect-[21/9]', 2: 'aspect-[4/3]', 3: 'aspect-[4/5]' } as const;

/** A division page's images in equal panels, right under its opening (three panels swipe sideways on phones). */
export function DivisionGallery({ gallery }: { gallery?: DivisionImage[] | null }) {
  const g = gallery;
  if (!g?.length) return null;
  const count = Math.min(g.length, 3) as 1 | 2 | 3;
  return (
    <WContainer className="pb-20 lg:pb-28">
      <div
        className={cn(
          'gap-4',
          count === 3 ? '-mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0' : 'grid',
          count === 2 && 'md:grid-cols-2'
        )}
      >
        {g.slice(0, 3).map((img, i) => (
          <div key={img.src + i} className={cn('relative overflow-hidden rounded-[28px] bg-sand', PANELS[count], count === 3 && 'w-[78%] shrink-0 snap-start sm:w-auto')}>
            <Media
              image={img}
              priority={i === 0}
              sizes={count === 1 ? '(min-width: 1440px) 1360px, 100vw' : count === 2 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 640px) 33vw, 100vw'}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </WContainer>
  );
}
