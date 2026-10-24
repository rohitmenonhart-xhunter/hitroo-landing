import { cn } from '@/lib/utils';
import Glass from './Glass';
import { TouchPill } from './WarmHeader';
import { H_L, P, Tight, WContainer } from './ui';

/** The page's last word: one line, one action, and the glass "hi" on a frosted card. */
export default function ClosingCta({ title, line, label = 'Get in touch', href }: { title: string; line: string; label?: string; href?: string }) {
  return (
    <section aria-labelledby="closing-title" className="pb-20 lg:pb-28">
      <WContainer>
        <div className="glass-warm grid items-center gap-10 rounded-[32px] p-8 sm:p-12 md:grid-cols-[1.5fr_1fr] lg:p-16">
          <div>
            <h2 id="closing-title" className={cn(H_L, '[text-wrap:balance]')}>
              <Tight>{title}</Tight>
            </h2>
            <p className={cn(P, 'mt-5 max-w-[560px]')}>{line}</p>
            <TouchPill className="mt-9" label={label} href={href} />
          </div>
          <Glass name="hi" className="hidden h-[260px] w-auto justify-self-end md:block lg:h-[300px]" />
        </div>
      </WContainer>
    </section>
  );
}
