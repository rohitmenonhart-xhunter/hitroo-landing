import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Container } from './ui';

export interface Leader {
  /** The quote, one sentence per line; with two or more lines the last one is set in the brand blue. */
  lines: string[];
  name: string;
  role: string;
  /** A small round portrait — only for HITROO's own people, never a famous person's photo. */
  photo?: string;
  alt?: string;
  /** Where a quoted public figure said it. */
  source?: { label: string; href: string };
}

/** A quote set large, signed with the speaker's name and role (and a small photo or the source). */
export default function LeaderQuote({ lines, name, role, photo, alt = '', source }: Leader) {
  return (
    <section aria-label={`A word from ${name}`} className="py-24 sm:py-32 lg:py-40">
      <Container>
        <figure className="max-w-5xl">
          <blockquote cite={source?.href} className="text-[30px] font-light leading-[1.15] tracking-[-0.03em] text-ink [text-wrap:balance] sm:text-[40px] lg:text-[50px]">
            <p>
              {lines.map((line, i) => (
                <span key={line} className={cn('block', lines.length > 1 && i === lines.length - 1 && 'text-cobalt')}>
                  {i === 0 && '“'}
                  {line}
                  {i === lines.length - 1 && '”'}
                </span>
              ))}
            </p>
          </blockquote>
          <figcaption className="mt-10 flex items-center gap-4 lg:mt-12">
            {photo && <Image src={photo} alt={alt} width={64} height={64} className="h-14 w-14 rounded-full object-cover sm:h-16 sm:w-16" />}
            <span>
              <span className="block text-[17px] font-medium text-ink">{name}</span>
              <span className="block text-[15px] text-slate-500">{role}</span>
              {source && (
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block text-[15px] text-slate-500 underline-offset-4 transition-colors hover:text-cobalt hover:underline"
                >
                  {source.label}
                </a>
              )}
            </span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
