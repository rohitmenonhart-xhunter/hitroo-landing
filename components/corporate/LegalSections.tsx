import type { ReactNode } from 'react';
import { Container } from './ui';

export interface LegalSection {
  title: string;
  body: ReactNode[];
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** The body of a policy page (terms, cookies, accessibility, security): short titled sections, one column. */
export default function LegalSections({ sections }: { sections: LegalSection[] }) {
  return (
    <Container className="pb-32 pt-12 lg:pb-44 lg:pt-20">
      <div className="grid max-w-3xl gap-16">
        {sections.map((s) => (
          <section key={s.title} aria-labelledby={slug(s.title)}>
            <h2 id={slug(s.title)} className="text-[26px] font-light tracking-[-0.02em] text-ink">
              {s.title}
            </h2>
            <div className="mt-5 grid gap-4 text-[17px] leading-relaxed text-slate-600">
              {s.body.map((p, i) => (
                <div key={i}>{p}</div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
