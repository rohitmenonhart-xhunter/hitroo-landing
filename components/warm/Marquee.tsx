import { cn } from '@/lib/utils';

/** A slow, endless band of large words between hairlines; it pauses on hover and stands still for reduced motion. */
export default function Marquee({ items, label }: { items: string[]; label: string }) {
  const row = (copy: boolean) => (
    <ul aria-hidden={copy || undefined} className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <li key={it} className="flex items-center whitespace-nowrap">
          <span className={cn('px-8 font-display text-[clamp(40px,6vw,92px)] font-extrabold leading-none tracking-[-0.045em]', i % 2 ? 'text-stone' : 'text-char')}>{it}</span>
          <span aria-hidden="true" className="h-3 w-3 rotate-45 rounded-[2px] bg-ember sm:h-4 sm:w-4" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={label} className="mb-20 overflow-hidden border-y border-char/10 py-8 lg:mb-28 lg:py-10">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
