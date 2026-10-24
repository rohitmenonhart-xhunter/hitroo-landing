import type { HeroStyle } from '@/components/clear/GlassWordmark';
import { jakarta } from './fonts';

/** The glass look of the wordmark and every still glass word: Plus Jakarta Sans ExtraBold, a soft pillow bevel. */
export const WORDMARK_GLASS: HeroStyle = { family: jakarta.style.fontFamily, weight: 800, lower: true, profile: 'pillow', corner: 0.06, track: -0.04, dispersion: 0.035 };
