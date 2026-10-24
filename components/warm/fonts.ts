import localFont from 'next/font/local';
import { Plus_Jakarta_Sans } from 'next/font/google';

/** Text and UI (`font-body`): Fustat, self-hosted (SIL Open Font License, app/fonts/Fustat-OFL.txt). */
export const body = localFont({
  src: '../../app/fonts/Fustat-Variable.ttf',
  variable: '--font-body',
  display: 'swap',
  weight: '200 800',
});

/** Headlines and the wordmark "hitroo" (`font-display`, `font-jakarta`), on screen and drawn in glass. */
export const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
