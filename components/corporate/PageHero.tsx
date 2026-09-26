import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Container, Eyebrow } from './ui';

/** Page opener: title left, one line and actions right, optional wide photo below. Inner pages sit close
 * under the header; `spacious` keeps the home page's extra air. */
export default function PageHero({
  eyebrow,
  title,
  lede,
  actions,
  image,
  imageAlt = '',
  imagePosition,
  spacious,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  spacious?: boolean;
}) {
  return (
    <section aria-labelledby="page-title" className={cn('pb-8', spacious ? 'pt-16 sm:pt-24 lg:pt-32' : 'pt-10 sm:pt-12 lg:pt-16')}>
      <Container>
        <div className={cn('grid gap-8 lg:grid-cols-12 lg:gap-12', spacious ? 'lg:items-end' : 'lg:items-center')}>
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
