import type { ReactNode } from 'react';
import type { DivisionHero } from '@/lib/division-pages';
import { cn } from '@/lib/utils';
import { GlassWord, type GlassWordName } from './Glass';
import Media from './Media';
import { Caption, Tight, WContainer } from './ui';

/**
 * A division's signature opening: its name in glass, then one large card with the division's image as the
 * background and the headline over it (char on light images, white over a soft scrim on dark ones).
 */
export default function SignatureIntro({
  word,
  caption,
  title,
  lede,
  action,
  hero,
}: {
  word: GlassWordName;
  caption: string;
  title: string;
  lede?: string;
  action?: ReactNode;
  hero: DivisionHero;
}) {
  const dark = hero.theme === 'dark';
  return (
    <section aria-labelledby="hero-title" className="pb-20 lg:pb-28">
      <WContainer className="pt-6 lg:pt-10">
        <GlassWord word={word} />
      </WContainer>
      <WContainer className="mt-8 lg:mt-12">
        <div
          className={cn(
            'relative isolate flex overflow-hidden rounded-[32px]',
            dark ? 'min-h-[560px] items-end bg-char sm:min-h-[620px]' : 'flex-col bg-paper ring-1 ring-char/5 md:flex-row md:items-start md:ring-0',
            'md:min-h-[620px] lg:min-h-[min(78vh,760px)]'
          )}
        >
          {/* Dark images sit behind the text everywhere; light ones stack under it on phones and go behind it from md up. */}
          <div className={cn(dark ? 'absolute inset-0 -z-10' : 'relative order-2 aspect-[4/3] md:absolute md:inset-0 md:-z-10 md:aspect-auto')}>
            <Media image={hero} priority sizes="(min-width: 1440px) 1360px, 100vw" className={cn('object-cover', hero.flip && '-scale-x-100')} />
          </div>
          {/* Legibility: a char scrim under white text on dark images, a paper fade under char text on light ones. */}
          {dark ? (
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-char/90 from-10% via-char/45 via-45% to-transparent" />
          ) : (
            <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 hidden h-[62%] bg-gradient-to-b from-paper from-30% via-paper/75 to-transparent md:block" />
          )}
          <div className="order-1 grid w-full gap-8 p-7 sm:p-10 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-16 lg:p-14">
            <div>
              <Caption className={dark ? 'text-white/90' : undefined}>{caption}</Caption>
              <h1 id="hero-title" className={cn('mt-6 font-display text-[clamp(36px,5vw,76px)] font-extrabold leading-[0.98] tracking-[-0.045em] [text-wrap:balance]', dark ? 'text-white' : 'text-char')}>
                <Tight>{title}</Tight>
              </h1>
            </div>
            {(lede || action) && (
              <div>
                {lede && <p className={cn('text-[17px] font-medium leading-[1.5] tracking-[-0.01em] sm:text-[19px]', dark ? 'text-white/90' : 'text-char/80')}>{lede}</p>}
                {action && <div className="mt-7">{action}</div>}
              </div>
            )}
          </div>
        </div>
      </WContainer>
    </section>
  );
}
