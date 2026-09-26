import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * A HITROO brand icon: a Codex-generated transparent PNG in public/icons (decorative, so alt="").
 * `eager` for icons inside menus, which are hidden until opened and must not pop in late.
 */
export default function BrandIcon({ src, size = 40, eager, className }: { src: string; size?: number; eager?: boolean; className?: string }) {
  return <Image src={src} alt="" width={size} height={size} loading={eager ? 'eager' : 'lazy'} className={cn('shrink-0 select-none', className)} />;
}
