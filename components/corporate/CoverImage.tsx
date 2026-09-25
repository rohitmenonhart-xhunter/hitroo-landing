/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';

/** Local covers go through next/image; external URLs (pasted in the admin) render as plain images. */
export default function CoverImage({ src, alt = '', sizes, className, priority }: { src: string; alt?: string; sizes: string; className?: string; priority?: boolean }) {
  if (src.startsWith('/')) return <Image src={src} alt={alt} fill sizes={sizes} className={className} priority={priority} />;
  return <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" className={`absolute inset-0 h-full w-full ${className ?? ''}`} />;
}
