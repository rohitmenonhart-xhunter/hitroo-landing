import { Plus } from 'lucide-react';
import type { Qa } from '@/lib/faq';

/** Questions that open in place (native <details>, no script). Pair with faqLd() so answer engines see the same text. */
export default function FaqList({ items }: { items: Qa[] }) {
  return (
    <div className="grid max-w-3xl gap-2">
      {items.map((it) => (
        <details key={it.q} className="group rounded-xl px-1 py-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[18px] font-medium tracking-[-0.01em] text-ink outline-none transition-colors hover:text-cobalt focus-visible:text-cobalt">
            {it.q}
            <Plus aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-cobalt transition-transform duration-300 group-open:rotate-45" />
          </summary>
          <p className="mt-3 pr-11 text-[16px] leading-relaxed text-slate-600">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
