import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/lib/site-data';
import BrandIcon from './BrandIcon';

const ITEM = 'group flex flex-col gap-5';
const LABEL = 'flex items-center gap-1.5 text-[18px] font-medium leading-snug tracking-[-0.01em] transition-colors sm:text-[19px]';

/**
 * The services as an open grid of brand icons and short names — no lines, whitespace between.
 * All seven get a "talk to us" item (4 x 2); with one excluded (a service page's
 * "other services"), the six sit 3 x 2.
 */
export default function ServiceGrid({ exclude }: { exclude?: string }) {
  const items = services.filter((s) => s.slug !== exclude);
  const withTile = !exclude;
  return (
    <ul className={`grid grid-cols-2 gap-x-8 gap-y-14 ${withTile ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {items.map((s) => (
        <li key={s.slug}>
          <Link href={`/services/${s.slug}`} className={ITEM}>
            <BrandIcon src={s.icon} size={56} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className={`${LABEL} text-ink group-hover:text-cobalt`}>
              {s.label}
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-slate-400 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cobalt"
              />
            </span>
          </Link>
        </li>
      ))}
      {withTile && (
        <li>
          <Link href="/contact" className={ITEM}>
            <BrandIcon src="/icons/talk.png" size={56} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className={`${LABEL} text-cobalt`}>Not sure? Talk to us</span>
          </Link>
        </li>
      )}
    </ul>
  );
}
