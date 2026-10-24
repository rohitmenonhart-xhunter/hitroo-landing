import { Check, type LucideIcon } from 'lucide-react';
import type { DivisionImage } from '@/lib/division-pages';
import type { Point } from '@/lib/site-data';
import { cn } from '@/lib/utils';
import Media from './Media';
import { Caption, H_L, H_S, Tight, WContainer } from './ui';

/** The dark card: a heading and six glass tiles, each with its own icon; optionally over a division's image. */
export function StandardsCard({ id, caption, title, items, icons, image }: { id: string; caption: string; title: string; items: Point[]; icons: LucideIcon[]; image?: DivisionImage | null }) {
  return (
    <section aria-labelledby={id} className="pb-20 lg:pb-28">
      <WContainer>
        <div className="relative isolate overflow-hidden rounded-[32px] bg-char p-8 text-white sm:p-12 lg:p-16">
          {image && (
            <>
              <Media image={image} alt="" sizes="(min-width: 1440px) 1360px, 100vw" className="-z-10 object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-char" style={{ opacity: image.dim ?? 0.75 }} />
            </>
          )}
          <Caption className="text-white/80">{caption}</Caption>
          <h2 id={id} className={cn(H_L, 'mt-6 max-w-[900px] text-white [text-wrap:balance]')}>
            <Tight>{title}</Tight>
          </h2>
          <ul className={cn('mt-12 grid gap-4 sm:auto-rows-fr sm:grid-cols-2', items.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4')}>
            {items.map((c, i) => {
              const Icon = icons[i % icons.length];
              return (
                <li key={c.title} className="glass-ink grid grid-rows-[auto_auto_1fr] rounded-[22px] p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <Icon aria-hidden="true" className="h-5 w-5 text-ember" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-8 font-display text-[22px] font-bold leading-[1.15] tracking-[-0.03em]">{c.title}</h3>
                  <p className="mt-2 text-[16px] font-medium leading-relaxed text-white/70">{c.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </WContainer>
    </section>
  );
}

/** Ways to work with us: one frosted card split into equal columns. */
export function Engagements({ items }: { items: { title: string; text: string; fit?: string }[] }) {
  return (
    <ul className={cn('glass-warm grid rounded-[32px]', items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
      {items.map((e, i) => (
        <li key={e.title} className="flex flex-col border-t border-char/10 p-8 first:border-t-0 sm:p-10 md:border-l md:border-t-0 md:first:border-l-0">
          <span className="font-jakarta text-[15px] font-extrabold tabular-nums text-ember">{String(i + 1).padStart(2, '0')}</span>
          <h3 className={cn(H_S, 'mt-8')}>{e.title}</h3>
          <p className="mt-3 text-[16px] font-medium leading-relaxed text-char/75">{e.text}</p>
          {e.fit && <p className="mt-auto pt-8 text-[15px] font-bold text-char">{e.fit}</p>}
        </li>
      ))}
    </ul>
  );
}

/** One process start to finish: numbered stops on a line, inside a frosted card. */
export function FlowCard({ steps }: { steps: Point[] }) {
  return (
    <ol className="glass-warm grid gap-8 rounded-[32px] p-8 sm:p-10 md:grid-cols-5 md:gap-6 lg:p-12">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 md:block">
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="absolute left-[22px] top-12 h-[calc(100%-8px)] border-l border-dashed border-char/20 md:left-12 md:top-[22px] md:h-0 md:w-[calc(100%-24px)] md:border-l-0 md:border-t" />
          )}
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white font-jakarta text-[15px] font-extrabold tabular-nums text-ember ring-1 ring-char/10">
            {i + 1}
          </span>
          <span className="block md:mt-6">
            <span className="block font-display text-[22px] font-bold tracking-[-0.03em] text-char">{s.title}</span>
            <span className="mt-1.5 block text-[16px] font-medium leading-relaxed text-char/75">{s.text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Two equal lists side by side: a frosted card and a dark one. */
export function SplitCards({ left, right }: { left: { label: string; items: string[] }; right: { label: string; items: string[] } }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[left, right].map((side, k) => (
        <div key={side.label} className={cn('rounded-[32px] p-8 sm:p-10', k === 0 ? 'glass-warm' : 'bg-char text-white')}>
          <p className={cn('text-[13px] font-medium uppercase tracking-[0.06em]', k === 0 ? 'text-stone' : 'text-white/60')}>{side.label}</p>
          <ul className="mt-6 grid gap-4">
            {side.items.map((x) => (
              <li key={x} className="flex items-start gap-3 font-display text-[clamp(20px,1.7vw,24px)] font-bold leading-snug tracking-[-0.025em]">
                <span className={cn('mt-[3px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full', k === 0 ? 'bg-ember text-white' : 'bg-white/10 text-ember ring-1 ring-white/20')}>
                  <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
