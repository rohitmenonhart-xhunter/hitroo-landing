import Image from 'next/image';
import type { CSSProperties } from 'react';
import { GLASS_SIZES, type GlassName } from './glass-sizes';

type Words<T> = T extends `word-${infer W}` ? W : never;
/** The page and service words rendered in glass (public/glass/word-*.webp). */
export type GlassWordName = Words<GlassName>;

/**
 * A still glass image from public/glass/. They are rendered at 2x, so the CSS size is half the pixels; the URL
 * carries the file's fingerprint, so a re-rendered image is never served from the 30-day cache. Only the home hero
 * runs live WebGL.
 */
export default function Glass({
  name,
  alt = '',
  className,
  style,
  sizes,
  priority,
}: {
  name: GlassName;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
}) {
  const [w, h, v] = GLASS_SIZES[name];
  return (
    <Image
      src={`/glass/${name}.webp?v=${v}`}
      alt={alt}
      width={Math.round(w / 2)}
      height={Math.round(h / 2)}
      quality={90}
      sizes={sizes}
      priority={priority}
      className={className}
      style={style}
    />
  );
}

/** A page's name in glass across the top: one letter size on every page; long words shrink to fit the width. */
export function GlassWord({ word, priority = true }: { word: GlassWordName; priority?: boolean }) {
  const name = `word-${word}` as GlassName;
  const [w, h] = GLASS_SIZES[name];
  return (
    <Glass
      name={name}
      priority={priority}
      sizes="(min-width: 1440px) 1360px, 100vw"
      style={{ width: `min(100%, calc(clamp(64px, 19vw, 300px) * ${(w / h).toFixed(3)}))`, height: 'auto' }}
    />
  );
}
