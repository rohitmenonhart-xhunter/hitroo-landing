import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import type { Point } from '@/lib/site-data';
import { cn } from '@/lib/utils';

/* Warm theme primitives: paper page, Plus Jakarta Sans headlines, Fustat text. */

export function WContainer({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10', className)}>{children}</div>;
}

/** A small uppercase caption with an ember mark, used to open a section. */
export function Caption({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn('flex items-start gap-2.5 text-[13px] font-medium uppercase leading-snug tracking-[0.04em] text-char', className)}>
      <span aria-hidden="true" className="mt-[3px] h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] bg-ember" />
      <span>{children}</span>
    </p>
  );
}

/** Headline sizes (Plus Jakarta Sans, the wordmark's face). */
export const H_XL = 'font-display text-[clamp(52px,9vw,140px)] font-extrabold leading-[0.92] tracking-[-0.05em] text-char';
/** A page's h1, under its glass word. */
export const H_PAGE = 'font-display text-[clamp(34px,4.4vw,64px)] font-extrabold leading-[1] tracking-[-0.045em] text-char [text-wrap:balance]';
export const H_L = 'font-display text-[clamp(38px,5.2vw,76px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-char';
export const H_M = 'font-display text-[clamp(28px,3.1vw,44px)] font-bold leading-[1.08] tracking-[-0.035em] text-char';
export const H_S = 'font-display text-[clamp(22px,1.9vw,28px)] font-bold leading-[1.12] tracking-[-0.03em] text-char';
/** Body copy. */
export const P = 'text-[17px] font-medium leading-[1.5] tracking-[-0.01em] text-char/80 sm:text-[19px]';
/** A white card on the paper page. */
export const CARD = 'rounded-[24px] bg-white p-7 ring-1 ring-char/5';
/** An underlined text link with an arrow. */
export const TEXT_LINK = 'inline-flex items-center gap-2 text-[16px] font-medium text-char underline decoration-char/30 underline-offset-[6px] hover:decoration-char';

/**
 * Headline text with its punctuation pulled in: Plus Jakarta Sans gives commas, full stops and colons a
 * wide left side bearing, which reads as a gap ("grow .") at headline sizes.
 */
export function Tight({ children }: { children: string }) {
  return (
    <>
      {children.split(/([.,:;])/).map((part, i) =>
        /^[.,:;]$/.test(part) ? (
          <span key={i} className="-ml-[0.09em]">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

/** A section: caption, a large heading, an optional line, then its content. Every section has a plain heading. */
export function WSection({
  id,
  caption,
  title,
  lede,
  className,
  children,
}: {
  id: string;
  caption: string;
  title: string;
  lede?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={cn('pb-20 lg:pb-28', className)}>
      <WContainer>
        <Caption>{caption}</Caption>
        <h2 id={id} className={cn(H_L, 'mt-6 max-w-[1000px] [text-wrap:balance]')}>
          <Tight>{title}</Tight>
        </h2>
        {lede && <p className={cn(P, 'mt-5 max-w-[640px]')}>{lede}</p>}
        {children && <div className="mt-12">{children}</div>}
      </WContainer>
    </section>
  );
}

/** Two large lines: the point, then the turn in a quieter tone. */
export function Statement({ id, caption, lines, action }: { id: string; caption: string; lines: [string, string]; action?: ReactNode }) {
  return (
    <section aria-labelledby={id} className="pb-20 lg:pb-28">
      <WContainer>
        <Caption>{caption}</Caption>
        <h2 id={id} className={cn(H_L, 'mt-6 max-w-[1100px] [text-wrap:balance]')}>
          <Tight>{lines[0]}</Tight>{' '}
          <span className="text-stone">
            <Tight>{lines[1]}</Tight>
          </span>
        </h2>
        {action && <div className="mt-9">{action}</div>}
      </WContainer>
    </section>
  );
}

const COLUMNS = { 2: 'md:grid-cols-2 md:auto-rows-fr', 3: 'md:grid-cols-3', 4: 'sm:grid-cols-2 sm:auto-rows-fr lg:grid-cols-4' } as const;

/** Equal white cards, each opened by an icon (or its number), with a title and one line. */
export function PointCards({ items, icons, columns = 3 }: { items: Point[]; icons?: LucideIcon[]; columns?: 2 | 3 | 4 }) {
  return (
    <ul className={cn('grid gap-4', COLUMNS[columns])}>
      {items.map((p, i) => {
        const Icon = icons?.[i];
        return (
          <li key={p.title} className={cn(CARD, 'grid grid-rows-[auto_auto_1fr]')}>
            {Icon ? (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand">
                <Icon aria-hidden="true" className="h-5 w-5 text-ember" strokeWidth={1.75} />
              </span>
            ) : (
              <span className="font-jakarta text-[15px] font-extrabold tabular-nums text-ember">{String(i + 1).padStart(2, '0')}</span>
            )}
            <h3 className={cn(H_S, Icon ? 'mt-10' : 'mt-8')}>{p.title}</h3>
            <p className="mt-3 text-[16px] font-medium leading-relaxed text-char/75">{p.text}</p>
          </li>
        );
      })}
    </ul>
  );
}

/** Equal cards that lead elsewhere: title, one line and the ember arrow. */
export function LinkCards({ items }: { items: { href: string; title: string; text: string }[] }) {
  return (
    <ul className={cn('grid gap-4', items.length === 2 ? 'md:grid-cols-2' : items.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2 sm:auto-rows-fr lg:grid-cols-4')}>
      {items.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className={cn(CARD, 'group flex h-full flex-col transition-colors hover:ring-char/20')}>
            <span className="flex items-start justify-between gap-4">
              <span className={H_S}>{l.title}</span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </span>
            <span className="mt-3 text-[16px] font-medium leading-relaxed text-char/75">{l.text}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
