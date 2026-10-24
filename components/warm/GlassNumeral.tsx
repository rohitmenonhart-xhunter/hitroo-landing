import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GLASS_SIZES, type GlassName } from './glass-sizes';

/**
 * A division's numeral in clear glass on paper. A still image rendered from the hero's glass engine,
 * so it costs nothing to show (only the hero runs live WebGL).
 */
export default function GlassNumeral({ n, className }: { n: string; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-[22px] bg-paper', className)}>
      <Image src={`/glass/division-${n}.webp?v=${GLASS_SIZES[`division-${n}` as GlassName][2]}`} alt="" fill sizes="(min-width: 1024px) 520px, 80vw" className="object-contain p-[9%]" />
    </div>
  );
}
