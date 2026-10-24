import type { ReactNode } from 'react';
import { WContainer } from '@/components/warm/ui';

export interface LegalSection {
  title: string;
  body: ReactNode[];
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** The body of a policy page (privacy, terms, cookies, accessibility, security): one frosted card, each section a row, title left, text right. */
export default function LegalSections({ sections }: { sections: LegalSection[] }) {
  return (
    <WContainer className="pb-20 lg:pb-28">
      <div className="glass-warm rounded-[32px] px-7 sm:px-10 lg:px-14">
        {sections.map((s) => (
          <section key={s.title} aria-labelledby={slug(s.title)} className="grid gap-4 border-t border-char/10 py-9 first:border-t-0 md:grid-cols-[1fr_2fr] md:gap-8 lg:py-11">
            <h2 id={slug(s.title)} className="font-display text-[22px] font-bold tracking-[-0.03em] text-char sm:text-[24px]">
              {s.title}
            </h2>
            <div className="grid max-w-[760px] gap-4 text-[16px] font-medium leading-relaxed text-char/75 sm:text-[17px] [&_a]:text-char [&_a]:underline [&_a]:decoration-char/25 [&_a]:underline-offset-4 hover:[&_a]:decoration-char">
              {s.body.map((p, i) => (
                <div key={i}>{p}</div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </WContainer>
  );
}
