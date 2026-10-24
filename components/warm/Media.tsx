import Image from 'next/image';
import type { CSSProperties } from 'react';
import { isRemote, mediaUrl, type MediaImage } from '@/lib/media';

/**
 * An image that fills its (positioned) box, whichever form it comes in:
 * - a file in public/ goes through next/image as before (AVIF/WebP from Vercel's optimizer, or as-is with `unoptimized`);
 * - a file in object storage is already pre-sized into WebP variants, so it renders as a plain <img> with srcset and
 *   sizes. It never touches Vercel's image optimizer (5,000 transformations a month on Hobby); its average colour
 *   shows while it loads, and it loads lazily unless it is the page's main image.
 * Both render the same box: absolutely positioned over the parent, object-fit from `className`.
 */
export default function Media({
  image,
  sizes,
  priority,
  unoptimized,
  alt,
  className,
  style,
}: {
  image: MediaImage;
  sizes: string;
  priority?: boolean;
  /** For public/ files that are already display-sized. */
  unoptimized?: boolean;
  /** Overrides the image's own alt text (e.g. "" for a decorative background). */
  alt?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const position = image.position ? { objectPosition: image.position } : undefined;
  if (!isRemote(image.src)) {
    return <Image src={image.src} alt={alt ?? image.alt} fill sizes={sizes} priority={priority} unoptimized={unoptimized} className={className} style={{ ...position, ...style }} />;
  }
  const variants = [...(image.variants ?? [])].sort((a, b) => a.w - b.w);
  const srcSet = variants.length ? variants.map((v) => `${mediaUrl(v.url)} ${v.w}w`).join(', ') : undefined;
  // `priority` loads eagerly at high priority; the <img> is in the server HTML, so the browser finds it at once. (No
  // ReactDOM.preload here: from a server component it becomes a hint in the RSC payload, and Next's link prefetching
  // would then download the hero image of every page linked from the screen.)
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-sized storage files, deliberately not optimized again
    <img
      src={mediaUrl(image.src)}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt ?? image.alt}
      width={image.width ?? undefined}
      height={image.height ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        color: 'transparent',
        ...(image.tone ? { backgroundColor: image.tone } : {}),
        ...position,
        ...style,
      }}
    />
  );
}
