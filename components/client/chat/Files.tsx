import { FileText, Film } from 'lucide-react';
import type { ChatFile } from '@/lib/client/types';
import { cn } from '@/lib/utils';
import { sizeText } from './uploads';

export type ShownFile = Pick<ChatFile, 'name' | 'type' | 'size' | 'kind' | 'url'> & { key: string };

/** A message's files: images as pictures, recordings as players, anything else (PDFs) as a link. */
export default function Files({ files, mine }: { files: ShownFile[]; mine?: boolean }) {
  if (!files.length) return null;
  const pictures = files.filter((f) => f.kind === 'image' && f.url && f.type !== 'image/heic');
  const videos = files.filter((f) => f.kind === 'video' && f.url);
  const others = files.filter((f) => !pictures.includes(f) && !videos.includes(f));
  return (
    <div className={cn('flex max-w-[min(85%,520px)] flex-col gap-2', mine ? 'items-end self-end' : 'items-start')}>
      {pictures.length > 0 && (
        <div className={cn('grid gap-1.5', pictures.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
          {pictures.map((f) => (
            <a key={f.key} href={f.url!} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-[16px] ring-1 ring-char/10">
              {/* eslint-disable-next-line @next/next/no-img-element -- a signed, short-lived link: not for the image optimizer */}
              <img src={f.url!} alt={f.name} loading="lazy" className={cn('block w-full object-cover', pictures.length > 1 ? 'aspect-square' : 'max-h-[340px]')} />
            </a>
          ))}
        </div>
      )}
      {videos.map((f) => (
        <video key={f.key} src={f.url!} controls preload="metadata" playsInline className="max-h-[360px] w-full max-w-[460px] rounded-[16px] bg-char ring-1 ring-char/10" aria-label={f.name} />
      ))}
      {others.map((f) =>
        f.url ? (
          <a key={f.key} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-[16px] bg-paper px-3.5 py-2.5 ring-1 ring-char/10 hover:ring-char/25">
            <Icon kind={f.kind} />
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-semibold text-char">{f.name}</span>
              <span className="block text-[12px] font-medium text-stone">{sizeText(f.size)}</span>
            </span>
          </a>
        ) : (
          <span key={f.key} className="flex items-center gap-3 rounded-[16px] bg-paper px-3.5 py-2.5 text-stone ring-1 ring-char/10">
            <Icon kind={f.kind} />
            <span className="text-[13.5px] font-medium">{f.name} · no longer available</span>
          </span>
        )
      )}
    </div>
  );
}

function Icon({ kind }: { kind: ChatFile['kind'] }) {
  const I = kind === 'video' ? Film : FileText;
  return (
    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white ring-1 ring-char/5">
      <I className="h-4 w-4 text-ember" />
    </span>
  );
}
