import Image from 'next/image';
import type { ReactNode } from 'react';
import { Container, Eyebrow } from './ui';

/** Page opener: title left, one line and actions right, optional wide photo below. */
export default function PageHero({
  eyebrow,
  title,
  lede,
  actions,
  image,
  imageAlt = '',
  imagePosition,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
}) {
  return (
    <section aria-labelledby="page-title" className="pb-8 pt-16 sm:pt-24 lg:pt-32">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
            <h1
              id="page-title"
              className="text-[40px] font-light leading-[1.04] tracking-[-0.035em] text-ink [text-wrap:balance] sm:text-[54px] lg:text-[64px]"
            >
              {title}
            </h1>
          </div>
          {(lede || actions) && (
            <div className="lg:col-span-5 lg:pb-1.5">
              {lede && <p className="text-[18px] leading-relaxed text-slate-600">{lede}</p>}
              {actions && <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">{actions}</div>}
            </div>
          )}
        </div>
        {image && (
          <div className="relative mt-14 aspect-[4/3] overflow-hidden rounded-md bg-mist sm:aspect-[16/9] lg:mt-20 lg:aspect-[21/9]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="(min-width: 1240px) 1160px, 100vw"
              className="object-cover"
              style={imagePosition ? { objectPosition: imagePosition } : undefined}
            />
          </div>
        )}
      </Container>
    </section>
  );
}
