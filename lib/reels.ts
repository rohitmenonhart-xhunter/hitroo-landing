import type { ReelStyle } from './creatives-library';
import type { CaptionStyle, CreativeTint, Reel } from './division-pages';

/** Which caption looks each style rotates through, the way a real feed mixes them. */
const LOOKS: Record<string, CaptionStyle[]> = {
  vox: ['vox', 'voxLabel', 'typewriter', 'vox', 'boxWhite'],
  faceless: ['hormozi', 'box', 'karaoke', 'serif', 'subtitle', 'typewriter'],
  ads: ['serif', 'outline', 'pill', 'box', 'sticker'],
  characters: ['subtitle', 'hormozi', 'box', 'karaoke', 'meme'],
  trends: ['sticker', 'serif', 'pill', 'typewriter', 'boxWhite', 'karaoke'],
  animation: ['pill', 'sticker', 'subtitle', 'outline'],
};

/** Highlight colours rotate too, so neighbouring reels never match. */
const ACCENTS: CreativeTint[] = ['yellow', 'lime', 'pink', 'teal', 'ember', 'lilac', 'cobalt'];

/** A library reel as a card: its style's chip, colour and a caption look from the style's rotation. */
export const asReel = (style: ReelStyle, i: number): Reel => {
  const looks = LOOKS[style.key] ?? ['subtitle'];
  return {
    ...style.reels[i],
    format: style.short,
    tint: style.tint,
    captionStyle: looks[i % looks.length],
    captionTint: ACCENTS[(i * 3 + style.key.length) % ACCENTS.length],
  };
};
