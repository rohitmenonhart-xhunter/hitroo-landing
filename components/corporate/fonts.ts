import { Inter, Newsreader } from 'next/font/google';

/** Corporate theme typeface — a neutral grotesque in the family of the enterprise brand faces. */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/** Editorial serif for story moments (`font-serif`): the home carousel and featured cards. Not preloaded. */
export const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
  axes: ['opsz'],
  // Next 13.5 has no fallback metrics for Newsreader; fall back to Georgia (see tailwind `font-serif`).
  adjustFontFallback: false,
  fallback: ['Georgia', 'serif'],
});
