import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Glass from './Glass';
import { Caption, H_M, WContainer } from './ui';

/** Questions as native <details>, with the glass question mark beside the heading. Pair with faqLd(). */
export default function FaqSection({ items, title = 'Frequently asked questions', className }: { items: { q: string; a: string }[]; title?: string; className?: string }) {
  return (
    <section aria-labelledby="faq-title" className={cn('pb-20 lg:pb-28', className)}>
      <WContainer className="grid gap-10 md:grid-cols-[1fr_2.4fr] md:gap-16">
        <div>
          <Caption>Questions</Caption>
          <h2 id="faq-title" className={cn(H_M, 'mt-6')}>
            {title}
          </h2>
          <Glass name="question" className="mt-10 hidden h-[220px] w-auto md:block" />
        </div>
        <div className="border-t border-char/10">
          {items.map((f) => (
            <details key={f.q} className="group border-b border-char/10 py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[19px] font-medium text-char outline-none focus-visible:underline sm:text-[21px]">
                {f.q}
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-char/10 transition-transform group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-3 max-w-[720px] pr-12 text-[17px] font-medium leading-relaxed text-char/75">{f.a}</p>
            </details>
          ))}
        </div>
      </WContainer>
    </section>
  );
}
