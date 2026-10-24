import type { CaptionStyle, CreativeTint } from '@/lib/division-pages';
import { cn } from '@/lib/utils';

/* The trending caption looks, set in HTML over the reel. Sizes use container units (cqw), so a caption scales with
   its reel from a 150 px phone strip to the 260 px hero. Fonts beyond the site's two are system faces (no loading). */

const SERIF = { fontFamily: 'Georgia, "Times New Roman", serif' };
const MONO = { fontFamily: '"Courier New", Courier, ui-monospace, monospace' };
const MEME = { fontFamily: 'Impact, "Arial Narrow", "Helvetica Neue", sans-serif' };
const STROKE = '[paint-order:stroke] [-webkit-text-stroke:0.9cqw_#12110B]';

const BG: Record<CreativeTint, string> = {
  ember: 'bg-ember text-white',
  pink: 'bg-[#FF3E8A] text-white',
  yellow: 'bg-[#FFD23F] text-char',
  lime: 'bg-[#B6F33B] text-char',
  teal: 'bg-[#00A6A6] text-white',
  lilac: 'bg-[#B9A6F2] text-char',
  cobalt: 'bg-[#2350E8] text-white',
  char: 'bg-char text-white',
};
const FG: Record<CreativeTint, string> = {
  ember: 'text-ember',
  pink: 'text-[#FF5FA2]',
  yellow: 'text-[#FFD23F]',
  lime: 'text-[#B6F33B]',
  teal: 'text-[#3DE0D0]',
  lilac: 'text-[#CDBDFF]',
  cobalt: 'text-[#8FB0FF]',
  char: 'text-[#FFD23F]',
};

/** The word a caption leans on: its longest word (the later one on a tie, which is usually the payoff). */
function keyIndex(words: string[]) {
  let best = 0;
  words.forEach((w, i) => {
    if (w.replace(/[^\p{L}\p{N}]/gu, '').length >= words[best].replace(/[^\p{L}\p{N}]/gu, '').length) best = i;
  });
  return best;
}

/** Splits a caption into two lines at the space nearest its middle. */
function twoLines(text: string): [string, string] {
  const words = text.split(' ');
  if (words.length < 3) return [text, ''];
  let best = 1;
  let len = 0;
  const half = text.length / 2;
  words.forEach((w, i) => {
    len += w.length + 1;
    if (Math.abs(len - half) < Math.abs(words.slice(0, best).join(' ').length - half)) best = i + 1;
  });
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}

export default function ReelCaption({ text, look, tint = 'yellow' }: { text: string; look: CaptionStyle; tint?: CreativeTint }) {
  const words = text.split(' ');
  const k = keyIndex(words);
  // Unknown colours (typed in the admin) fall back to yellow.
  const accent = tint === 'char' || !(tint in BG) ? 'yellow' : tint;

  switch (look) {
    case 'vox':
      return (
        <p className="absolute inset-x-[6cqw] top-[15%] font-display text-[8.5cqw] font-extrabold leading-[1.3] tracking-[-0.02em] text-char">
          <span className="box-decoration-clone bg-[#FFD23F] px-[1.5cqw] py-[0.5cqw]">{text}</span>
        </p>
      );
    case 'voxLabel':
      return (
        <p className="absolute left-[7cqw] right-[10cqw] top-[12%] -rotate-2 bg-[#FCF8F6] px-[4cqw] py-[3cqw] font-display text-[7.5cqw] font-extrabold leading-[1.15] tracking-[-0.02em] text-char ring-1 ring-char/10">
          {text}
          <span className="mt-[2cqw] block h-[1cqw] w-[45%] rounded-full bg-[#E5332A]" />
        </p>
      );
    case 'box':
      return (
        <p className="absolute inset-x-[7cqw] top-[62%] text-center font-display text-[7.5cqw] font-bold leading-[1.45] text-white">
          <span className="box-decoration-clone rounded-[1.5cqw] bg-char/90 px-[2.5cqw] py-[1cqw]">{text}</span>
        </p>
      );
    case 'boxWhite':
      return (
        <p className="absolute inset-x-[7cqw] top-[18%] text-center font-display text-[7.5cqw] font-bold leading-[1.45] text-char">
          <span className="box-decoration-clone rounded-[1.5cqw] bg-white px-[2.5cqw] py-[1cqw]">{text}</span>
        </p>
      );
    case 'hormozi':
      return (
        <p className={cn('absolute inset-x-[5cqw] top-[55%] text-center font-display text-[10cqw] font-extrabold uppercase leading-[1.05] tracking-[-0.01em] text-white', STROKE)}>
          {words.map((w, i) => (
            <span key={i} className={cn(i === k && FG[accent])}>
              {w}{' '}
            </span>
          ))}
        </p>
      );
    case 'karaoke':
      return (
        <p className={cn('absolute inset-x-[6cqw] top-[66%] text-center font-display text-[8.5cqw] font-extrabold leading-[1.35] text-white', STROKE)}>
          {words.map((w, i) => (
            <span key={i}>
              <span className={cn(i === k && cn('rounded-[1.5cqw] px-[1.5cqw] [-webkit-text-stroke:0]', BG[accent]))}>{w}</span>{' '}
            </span>
          ))}
        </p>
      );
    case 'pill': {
      const [a, b] = twoLines(text);
      return (
        <div className="absolute inset-x-[5cqw] top-[20%] flex flex-col items-center gap-[1.5cqw]">
          {[a, b].filter(Boolean).map((line, i) => (
            <span
              key={i}
              className={cn('rounded-full px-[4cqw] py-[1.5cqw] text-center font-display text-[7.5cqw] font-extrabold leading-tight', i === 0 ? BG[accent] : 'bg-white text-char')}
              style={{ rotate: i === 0 ? '-3deg' : '2deg' }}
            >
              {line}
            </span>
          ))}
        </div>
      );
    }
    case 'serif':
      return (
        <>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-char/70 to-transparent" />
          <p className="absolute inset-x-[8cqw] bottom-[17%] text-center text-[9cqw] italic leading-[1.1] text-white" style={SERIF}>
            {text.toLowerCase()}
          </p>
        </>
      );
    case 'typewriter':
      return (
        <p className="absolute inset-x-0 top-[44%] bg-white/95 px-[5cqw] py-[2.5cqw] text-center text-[6.5cqw] font-bold leading-[1.3] text-char" style={MONO}>
          {text.toLowerCase()}
        </p>
      );
    case 'sticker': {
      const [a, b] = twoLines(text);
      return (
        <div className="absolute left-[6cqw] right-[6cqw] top-[13%] flex flex-col items-start gap-[1cqw]">
          {[a, b].filter(Boolean).map((line, i) => (
            <span
              key={i}
              className={cn('rounded-[2cqw] px-[3cqw] py-[1.2cqw] font-display text-[8cqw] font-extrabold uppercase leading-none tracking-[-0.01em] ring-[0.8cqw] ring-white', i === 0 ? 'bg-char text-white' : BG[accent])}
              style={{ rotate: i === 0 ? '-4deg' : '3deg', marginLeft: i ? '8cqw' : 0 }}
            >
              {line}
            </span>
          ))}
        </div>
      );
    }
    case 'outline': {
      // A two-tone title: white over a dark outline, then the payoff in the accent colour.
      const [a, b] = twoLines(text);
      return (
        <p className={cn('absolute inset-x-[6cqw] top-[15%] font-display text-[11cqw] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]', STROKE)}>
          <span className="block text-white">{a}</span>
          {b && <span className={cn('block', FG[accent])}>{b}</span>}
        </p>
      );
    }
    case 'meme':
      return (
        <p className={cn('absolute inset-x-[4cqw] top-[7%] text-center text-[11cqw] uppercase leading-[1] tracking-[0.01em] text-white', STROKE)} style={MEME}>
          {text}
        </p>
      );
    case 'subtitle':
    default:
      return (
        <p className={cn('absolute inset-x-[7cqw] top-[58%] text-center font-display text-[8.5cqw] font-extrabold leading-tight tracking-[-0.01em] text-white', STROKE)}>{text}</p>
      );
  }
}
