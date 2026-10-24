import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Founder } from '@/lib/site-data';
import { cn } from '@/lib/utils';
import Media from './Media';
import { roleWithoutCompany } from './QuoteBlock';
import { Caption, H_M, P, TEXT_LINK, Tight, WContainer } from './ui';

/** The founder's photo and words: who you'll work with. */
export default function FounderBlock({ founder, link = true }: { founder: Founder; link?: boolean }) {
  return (
    <section aria-labelledby="people-title" className="pb-20 lg:pb-28">
      <WContainer className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-16">
        <div className="relative aspect-[4/5] max-w-[460px] overflow-hidden rounded-[28px] bg-sand">
          <Media image={founder.photo} sizes="(min-width: 768px) 460px, 100vw" className="object-cover" />
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[15px] font-medium text-char backdrop-blur">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ember" />
            {founder.name}, {roleWithoutCompany(founder.role)}
          </span>
        </div>
        <div>
          <Caption>{founder.caption}</Caption>
          <h2 id="people-title" className="sr-only">
            {founder.caption}
          </h2>
          <blockquote className={cn(H_M, 'mt-6')}>
            <p>
              <Tight>{`“${founder.lines[0]} ${founder.lines[1]}”`}</Tight>
            </p>
          </blockquote>
          <p className={cn(P, 'mt-6 max-w-[560px]')}>{founder.text}</p>
          {link && (
            <Link href="/about" className={cn(TEXT_LINK, 'mt-8 text-[17px]')}>
              About HITROO
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          )}
        </div>
      </WContainer>
    </section>
  );
}
