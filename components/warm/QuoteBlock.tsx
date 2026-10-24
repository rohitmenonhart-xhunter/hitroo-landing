import { ArrowUpRight } from 'lucide-react';
import type { Quote } from '@/lib/site-data';
import { cn } from '@/lib/utils';
import Media from './Media';
import { Caption, H_M, Tight, WContainer } from './ui';

const CREDIT = 'underline-offset-2 hover:text-char hover:underline';

/** "Founder and CEO, NVIDIA" → "Founder and CEO": the pill on the photo leaves out the company. */
export const roleWithoutCompany = (role: string) => (role.includes(', ') ? role.slice(0, role.lastIndexOf(', ')) : role);

/**
 * A public figure's words beside their portrait (the same layout as the founder block). The source is linked and the
 * photo credit is always shown; nothing here suggests the speaker endorses HITROO.
 */
export default function QuoteBlock({ quote: q }: { quote: Quote }) {
  const { quote, name, role, source, photo } = q;
  return (
    <section aria-labelledby="quote-title" className="pb-20 lg:pb-28">
      <WContainer className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-16">
        <figure>
          <div className="relative aspect-[4/5] max-w-[460px] overflow-hidden rounded-[28px] bg-sand">
            <Media image={photo} sizes="(min-width: 768px) 460px, 100vw" className="object-cover" />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[15px] font-medium text-char backdrop-blur">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ember" />
              {name}, {roleWithoutCompany(role)}
            </span>
          </div>
          <figcaption className="mt-3 max-w-[460px] text-[12px] font-medium text-stone">
            Photo:{' '}
            <a href={photo.creditHref} target="_blank" rel="noopener noreferrer" className={CREDIT}>
              {photo.credit}
            </a>
            ,{' '}
            <a href={photo.licenseHref} target="_blank" rel="license noopener noreferrer" className={CREDIT}>
              {photo.license}
            </a>
            , {photo.changes}.
          </figcaption>
        </figure>
        <div>
          <Caption>{q.caption}</Caption>
          <h2 id="quote-title" className="sr-only">
            {q.caption}: a word from {name}
          </h2>
          <blockquote cite={source.href} className={cn(H_M, 'mt-6 [text-wrap:balance]')}>
            {/* A dash never starts a line: it stays with the word before it. */}
            <p>
              <Tight>{`“${quote.replace(/ — /g, ' — ')}”`}</Tight>
            </p>
          </blockquote>
          <p className="mt-6 text-[17px] font-medium text-char">
            {name} <span className="text-stone">· {role}</span>
          </p>
          <a
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-[16px] font-medium text-char underline decoration-char/30 underline-offset-[6px] hover:decoration-char"
          >
            {source.label}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </WContainer>
    </section>
  );
}
