import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { findDivision, getContent, getDivisionVisuals } from '@/lib/content';
import type { DivisionSlug } from '@/lib/site-data';
import { cn } from '@/lib/utils';
import { DivisionVisual } from './DivisionVisual';
import { Caption, H_L, Tight, WContainer } from './ui';

/** The divisions as equal cards, each with its image (or glass numeral); on a division's page, the other three. */
export default async function OtherDivisions({
  current,
  caption = 'Other divisions',
  title = 'Explore the other divisions.',
}: {
  current?: DivisionSlug;
  caption?: string;
  title?: string;
}) {
  const [showcase, divisions, visuals] = await Promise.all([getContent('showcase'), getContent('divisions'), getDivisionVisuals()]);
  return (
    <section aria-labelledby="divisions-title" className="pb-20 lg:pb-28">
      <WContainer>
        <Caption>{caption}</Caption>
        <h2 id="divisions-title" className={cn(H_L, 'mt-6 max-w-[900px] [text-wrap:balance]')}>
          <Tight>{title}</Tight>
        </h2>
        <ul className={cn('mt-12 grid gap-4', current ? 'md:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4')}>
          {showcase.map((d, i) =>
            d.slug === current ? null : (
              <li key={d.slug}>
                <Link href={`/${d.slug}`} className="group flex h-full flex-col rounded-[28px] bg-white p-5 ring-1 ring-char/5 transition-colors hover:ring-char/20 sm:p-6">
                  <DivisionVisual visual={visuals[d.slug]} n={String(i + 1).padStart(2, '0')} sizes="(min-width: 768px) 420px, 90vw" className="aspect-[16/10] w-full" />
                  <span className="mt-6 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.06em] text-char">
                    {d.name}
                    {findDivision(divisions, d.slug)?.isNew && <span className="rounded-full bg-char px-2.5 py-0.5 text-[11px] font-bold tracking-[0.08em] text-white">NEW</span>}
                  </span>
                  <span className="mt-3 flex items-start justify-between gap-4">
                    <span className="font-display text-[clamp(22px,1.9vw,28px)] font-bold leading-[1.12] tracking-[-0.03em] text-char">
                      <Tight>{d.title}</Tight>
                    </span>
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember text-white transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </span>
                </Link>
              </li>
            )
          )}
        </ul>
      </WContainer>
    </section>
  );
}
