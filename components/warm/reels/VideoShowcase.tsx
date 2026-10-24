import { ArrowUpRight, Plus } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import type { ShowcaseVideoContent } from '@/lib/creatives-video';
import { absoluteMedia } from '@/lib/media';
import { abs } from '@/lib/seo';
import { cn } from '@/lib/utils';
import { Caption, H_L, P, Tight, WContainer } from '../ui';
import ShowcaseVideo from './ShowcaseVideo';

/** One finished video, shown properly: the player beside what it is, with its transcript, sources and credits. */
export default function VideoShowcase({ video: v, copy }: { video: ShowcaseVideoContent; copy: { caption: string; title: string; text: string } }) {
  return (
    <section aria-labelledby="showcase-title" className="pb-20 lg:pb-28">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: v.title,
          description: v.description,
          thumbnailUrl: absoluteMedia(v.poster, abs),
          contentUrl: absoluteMedia(v.src, abs),
          uploadDate: v.uploadDate,
          duration: `PT${v.seconds}S`,
          transcript: v.transcript,
        }}
      />
      <WContainer className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
        <div className="order-2 md:order-1">
          <Caption>{copy.caption}</Caption>
          <h2 id="showcase-title" className={cn(H_L, 'mt-6 [text-wrap:balance]')}>
            <Tight>{copy.title}</Tight>
          </h2>
          <p className={cn(P, 'mt-5 max-w-[560px]')}>{copy.text}</p>
          <details className="group mt-8 max-w-[600px] border-t border-char/10 pt-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[18px] font-medium text-char outline-none focus-visible:underline">
              Transcript and sources
              <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-char/10 transition-transform group-open:rotate-45">
                <Plus className="h-4 w-4" />
              </span>
            </summary>
            <p className="mt-4 text-[16px] font-medium leading-relaxed text-char/80">{v.transcript}</p>
            <ul className="mt-5 grid gap-2">
              {v.sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 text-[14px] font-medium text-char underline decoration-char/25 underline-offset-4 hover:decoration-char">
                    {s.label}
                    <ArrowUpRight aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] font-medium text-stone">{v.credits}</p>
          </details>
        </div>
        <div className="order-1 flex justify-center md:order-2">
          <ShowcaseVideo video={{ src: v.src, poster: v.poster, width: v.width, height: v.height, title: v.title, seconds: v.seconds }} className="w-[min(78vw,340px)] lg:w-[360px]" />
        </div>
      </WContainer>
    </section>
  );
}
