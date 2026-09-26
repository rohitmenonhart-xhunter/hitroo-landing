import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export interface FeaturedQuoteData {
  /** The speaker's exact words, from a source that can be linked. */
  quote: string;
  name: string;
  role: string;
  source: { label: string; href: string };
  /** A freely licensed photo (never a press photo, never generated); its credit is always shown. */
  photo: { src: string; alt: string; credit: string; creditHref: string; license: string; licenseHref: string; changes: string };
}

const CREDIT_LINK = 'underline-offset-2 transition-colors hover:text-slate-600 hover:underline';

/** A public figure's quote on a deep ink card: portrait left, the words large in white on the right. */
export default function FeaturedQuote({ quote, name, role, source, photo }: FeaturedQuoteData) {
  return (
    <section aria-label={`A word from ${name}`} className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-[1340px] px-5 sm:px-8 lg:px-[70px]">
        <figure className="grid overflow-hidden rounded-3xl bg-ink md:grid-cols-12">
          <div className="relative aspect-square md:col-span-5 md:aspect-auto md:min-h-[540px]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1340px) 500px, (min-width: 768px) 42vw, 100vw"
              className="object-cover object-[50%_22%]"
            />
          </div>
          <div className="flex flex-col justify-center px-8 py-12 sm:px-12 md:col-span-7 md:py-16 lg:px-16">
            <blockquote
              cite={source.href}
              className="text-[28px] font-light leading-[1.2] tracking-[-0.02em] text-white [text-wrap:balance] sm:text-[36px] lg:text-[44px]"
            >
              <p>“{quote}”</p>
            </blockquote>
            <figcaption className="mt-10">
              <span className="block text-[17px] font-medium text-white">{name}</span>
              <span className="mt-1 block text-[15px] text-white/60">{role}</span>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-medium text-cobalt-light transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt-light"
              >
                {source.label}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </figcaption>
          </div>
        </figure>
        <p className="mt-4 text-[12px] text-slate-400 md:text-right">
          Photo:{' '}
          <a href={photo.creditHref} target="_blank" rel="noopener noreferrer" className={CREDIT_LINK}>
            {photo.credit}
          </a>
          ,{' '}
          <a href={photo.licenseHref} target="_blank" rel="license noopener noreferrer" className={CREDIT_LINK}>
            {photo.license}
          </a>
          , {photo.changes}.
        </p>
      </div>
    </section>
  );
}
