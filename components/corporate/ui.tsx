import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type LinkProps = ComponentProps<typeof Link>;

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt';

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10', className)}>{children}</div>;
}

const BUTTON = {
  primary: 'bg-cobalt text-white hover:bg-cobalt-dark',
  outline: 'border border-ink/20 text-ink hover:border-ink',
  light: 'bg-white text-ink hover:bg-cobalt-soft',
};

/** Pill call-to-action with a trailing arrow. */
export function Button({ variant = 'primary', className, children, ...rest }: LinkProps & { variant?: keyof typeof BUTTON }) {
  return (
    <Link
      className={cn(
        'group inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium transition-colors',
        FOCUS,
        BUTTON[variant],
        className
      )}
      {...rest}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}

/** Inline text link with an arrow. */
export function ArrowLink({ className, children, ...rest }: LinkProps) {
  return (
    <Link className={cn('group inline-flex items-center gap-1.5 text-[15px] font-medium text-cobalt hover:text-cobalt-dark', FOCUS, className)} {...rest}>
      <span className="underline-offset-4 group-hover:underline">{children}</span>
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn('text-[12px] font-semibold uppercase tracking-[0.16em] text-cobalt', className)}>{children}</p>;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  lede,
  action,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12', className)}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <h2 id={id} className="text-[32px] font-light leading-[1.1] tracking-[-0.03em] text-ink [text-wrap:balance] sm:text-[40px] lg:text-[44px]">
          {title}
        </h2>
        {lede && <p className="mt-6 text-[17px] leading-relaxed text-slate-600 lg:text-[18px]">{lede}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** A page section on plain white. No divider lines: whitespace does the separating. */
export function Section({ labelledBy, className, children }: { labelledBy?: string; className?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={labelledBy} className={cn('py-24 sm:py-32 lg:py-40', className)}>
      <Container>{children}</Container>
    </section>
  );
}

/** A large one- or two-line statement; the last line of two is set in the brand blue. */
export function Statement({ id, eyebrow, lines, action }: { id: string; eyebrow?: string; lines: string[]; action?: ReactNode }) {
  return (
    <section aria-labelledby={id} className="py-28 sm:py-36 lg:py-48">
      <Container>
        {eyebrow && <Eyebrow className="mb-8">{eyebrow}</Eyebrow>}
        <h2 id={id} className="max-w-5xl text-[32px] font-light leading-[1.15] tracking-[-0.03em] text-ink [text-wrap:balance] sm:text-[44px] lg:text-[56px]">
          {lines.map((line, i) => (
            <span key={line} className={cn('block', lines.length > 1 && i === lines.length - 1 && 'text-cobalt')}>
              {line}
            </span>
          ))}
        </h2>
        {action && <div className="mt-12">{action}</div>}
      </Container>
    </section>
  );
}
