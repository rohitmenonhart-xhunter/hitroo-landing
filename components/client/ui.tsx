import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tone } from '@/lib/client/types';

/* The client area's primitives, in the site's warm theme: paper page, white cards, Jakarta headings, one ember accent. */

export const RING = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-char';

/** A white card on the paper page. */
export function Card({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className={cn('rounded-[24px] bg-white p-6 ring-1 ring-char/5 sm:p-7', className)}>
      {children}
    </section>
  );
}

/** A card's heading, with an optional link or note on the right. */
export function CardHead({ title, aside, className }: { title: string; aside?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4', className)}>
      <h2 className="font-display text-[19px] font-bold tracking-[-0.025em] text-char">{title}</h2>
      {aside && <div className="shrink-0 text-[14px] font-medium text-stone">{aside}</div>}
    </div>
  );
}

const TONES: Record<Tone | 'bad', string> = {
  neutral: 'bg-sand text-char/70',
  waiting: 'bg-ember/10 text-ember-dark',
  live: 'bg-[#2F9E5B]/10 text-[#23794A]',
  bad: 'bg-ember text-white',
};
const DOTS: Record<Tone | 'bad', string> = { neutral: 'bg-stone/60', waiting: 'bg-ember', live: 'bg-[#2F9E5B]', bad: 'bg-white' };

/** A status in a small pill: neutral, waiting for the client (ember) or live (green). */
export function Pill({ tone = 'neutral', children, className }: { tone?: Tone | 'bad'; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12.5px] font-semibold leading-none', TONES[tone], className)}>
      <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', DOTS[tone])} />
      {children}
    </span>
  );
}

/** The main action: an ember pill with the arrow, as on the site. `dark` for a char pill. */
export function ActionLink({ href, children, dark, external, className }: { href: string; children: ReactNode; dark?: boolean; external?: boolean; className?: string }) {
  const cls = cn(
    'group inline-flex h-11 items-center gap-2.5 rounded-full pl-5 pr-1.5 text-[15px] font-semibold transition-colors',
    dark ? 'bg-char text-white hover:bg-char/90' : 'bg-white text-char ring-1 ring-char/10 hover:bg-[#FFF8F5]',
    RING,
    className
  );
  const inner = (
    <>
      {children}
      <span className={cn('flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45', dark ? 'bg-ember' : 'bg-ember')}>
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** A form's submit button, in the same shape. */
export function SubmitButton({ children, className, dark = true }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <button
      type="submit"
      className={cn(
        'group inline-flex h-11 items-center gap-2.5 rounded-full pl-5 pr-1.5 text-[15px] font-semibold transition-colors',
        dark ? 'bg-char text-white hover:bg-char/90' : 'bg-white text-char ring-1 ring-char/10 hover:bg-[#FFF8F5]',
        RING,
        className
      )}
    >
      {children}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember text-white transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </span>
    </button>
  );
}

/** A quiet text link. */
export function QuietLink({ href, children, external, className }: { href: string; children: ReactNode; external?: boolean; className?: string }) {
  const cls = cn('inline-flex items-center gap-1 text-[14px] font-semibold text-char underline decoration-char/25 underline-offset-[5px] hover:decoration-char', RING, className);
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** A small number with its label, for the top row of a page. */
export function Stat({ label, value, note, children, className }: { label: string; value: ReactNode; note?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <Card className={cn('flex flex-col justify-between gap-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14px] font-medium text-stone">{label}</p>
        {children}
      </div>
      <div>
        <p className="font-display text-[34px] font-extrabold leading-none tracking-[-0.04em] text-char tabular-nums">{value}</p>
        {note && <p className="mt-2 text-[13.5px] font-medium text-stone">{note}</p>}
      </div>
    </Card>
  );
}

/** When there's nothing to show yet. */
export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-[16px] bg-paper px-5 py-6 text-center text-[15px] font-medium text-stone">{children}</p>;
}

/** A form field's label and its control. */
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[14px] font-semibold text-char">{label}</span>
      {hint && <span className="mt-0.5 block text-[13.5px] font-medium text-stone">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

export const INPUT =
  'w-full rounded-[14px] border-0 bg-paper px-4 py-3 text-[16px] font-medium text-char ring-1 ring-char/10 placeholder:text-stone/70 focus:outline-none focus:ring-2 focus:ring-char';
