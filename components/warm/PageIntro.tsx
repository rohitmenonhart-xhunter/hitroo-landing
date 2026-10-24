import type { ReactNode } from 'react';
import { GlassWord, type GlassWordName } from './Glass';
import { Caption, H_PAGE, P, Tight, WContainer } from './ui';

/** A page's opening: its name in glass across the top, then the caption and headline left, the line and action right. */
export default function PageIntro({ word, caption, title, lede, action }: { word: GlassWordName; caption: string; title: string; lede?: string; action?: ReactNode }) {
  return (
    <section aria-labelledby="hero-title">
      <WContainer className="pt-6 lg:pt-10">
        <GlassWord word={word} />
      </WContainer>
      <WContainer className="grid gap-8 pb-20 pt-12 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-16 lg:pb-28">
        <div>
          <Caption>{caption}</Caption>
          <h1 id="hero-title" className={`${H_PAGE} mt-6`}>
            <Tight>{title}</Tight>
          </h1>
        </div>
        {(lede || action) && (
          <div>
            {lede && <p className={P}>{lede}</p>}
            {action && <div className="mt-7">{action}</div>}
          </div>
        )}
      </WContainer>
    </section>
  );
}
