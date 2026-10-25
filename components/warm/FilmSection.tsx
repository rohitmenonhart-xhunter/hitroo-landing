import { Plus } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import type { FilmContent } from '@/lib/films';
import { absoluteMedia } from '@/lib/media';
import { abs } from '@/lib/seo';
import ShowcaseVideo from './reels/ShowcaseVideo';
import { WSection } from './ui';

/**
 * A HITROO film in the section under a page's opening (`film:home`, `film:<division>`). It loads nothing until it
 * nears the screen, plays muted while on screen, and "Sound on" restarts it with sound; the transcript is one tap away (no credits line: the owner asked for none).
 */
export default function FilmSection({ film: f, className }: { film: FilmContent; className?: string }) {
  return (
    <WSection id="film-title" caption={f.caption} title={f.heading} className={className}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: f.title,
          description: f.description,
          thumbnailUrl: absoluteMedia(f.poster, abs),
          contentUrl: absoluteMedia(f.src, abs),
          uploadDate: f.uploadDate,
          duration: `PT${f.seconds}S`,
          transcript: f.transcript,
        }}
      />
      <ShowcaseVideo video={{ src: f.src, poster: f.poster, width: f.width, height: f.height, title: f.title, seconds: f.seconds }} className="w-full rounded-[32px]" />
      <div className="mt-5">
        <details className="group max-w-[720px] [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-3 text-[16px] font-medium text-char outline-none focus-visible:underline">
            Transcript
            <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-char/10 transition-transform group-open:rotate-45">
              <Plus className="h-3.5 w-3.5" />
            </span>
          </summary>
          <p className="mt-3 text-[16px] font-medium leading-relaxed text-char/80">{f.transcript}</p>
        </details>
      </div>
    </WSection>
  );
}
