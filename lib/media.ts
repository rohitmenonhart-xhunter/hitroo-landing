/*
 * Images and videos inside page content. Two forms render the same way:
 * - a file in public/ ("/photos/…"), shown through next/image as before;
 * - a file in object storage (Tigris, uploaded from the admin or `npm run media:upload`): an absolute URL with
 *   pre-sized WebP `variants`, shown as a plain <img srcset> so it never uses Vercel's image optimizer.
 * The admin's editor treats any object with a string `src` as a media slot.
 */

/** Public origin of the media bucket (preconnected in the root layout). */
export const MEDIA_ORIGIN = 'https://hitroo-media.fly.storage.tigris.dev';

/** One pre-sized copy of an uploaded image. */
export interface MediaVariant {
  w: number;
  url: string;
  bytes?: number;
}

export interface MediaImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Average colour (#rrggbb), shown while the picture loads. */
  tone?: string;
  /** Uploaded images: WebP copies, ascending by width. */
  variants?: MediaVariant[];
  /** CSS object-position, for crops that must keep the subject. */
  position?: string;
}

export interface MediaVideo {
  src: string;
  poster: string;
  width: number;
  height: number;
}

/**
 * Where the browser loads a storage file from. Images: our own origin (`/media/img/…`), which next.config.js rewrites
 * to the bucket and vercel.json caches on Vercel's CDN for a year. Same origin, HTTP/2 and the edge cache make it
 * several times faster than fetching from the bucket directly. Videos stream from the bucket itself: browsers fetch
 * them in byte ranges, and Vercel's cache would store the first range as the whole file. Other URLs are unchanged.
 */
export const mediaUrl = (url: string) => (url.startsWith(`${MEDIA_ORIGIN}/img/`) ? `/media${url.slice(MEDIA_ORIGIN.length)}` : url);

/** True for a file in object storage (or anywhere off-site); false for a file in public/. */
export const isRemote = (src: string) => /^https?:\/\//i.test(src);

/** An absolute URL for structured data: off-site files as they are, public/ files on the site's origin (no query). */
export const absoluteMedia = (src: string, abs: (path: string) => string) => (isRemote(src) ? src : abs(src.split('?')[0]));
