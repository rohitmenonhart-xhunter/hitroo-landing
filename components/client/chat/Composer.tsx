import { useEffect, useRef } from 'react';
import { ArrowUp, FileText, Film, Paperclip, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ACCEPT, sizeText, type Pending } from './uploads';

const RING = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-char';

/**
 * The message box: files on top (attached with the clip, by pasting or by dropping them on the chat), then
 * the text, which grows as you write. Enter sends and Shift + Enter starts a new line (on phones Enter is a
 * new line and the button sends). Without JavaScript it's a plain form to the dashboard's form handler.
 */
export default function Composer({
  token,
  project,
  lead,
  value,
  onChange,
  onSend,
  uploads,
  onAttach,
  onRemove,
}: {
  token: string;
  project: string;
  lead: string;
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  uploads: Pending[];
  onAttach: (files: FileList | File[]) => void;
  onRemove: (key: string) => void;
}) {
  const box = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);
  const uploading = uploads.some((u) => !u.id && !u.error);
  const ready = uploads.some((u) => u.id);
  const canSend = (Boolean(value.trim()) || ready) && !uploading;
  return (
    <form
      method="post"
      action={`/d/${token}/send`}
      onSubmit={(e) => {
        e.preventDefault();
        if (canSend) onSend();
        box.current?.focus();
      }}
      className="rounded-[22px] bg-paper p-2 ring-1 ring-char/10 transition-shadow focus-within:bg-white focus-within:shadow-[0_6px_24px_rgba(18,17,11,0.08)] focus-within:ring-char/30"
    >
      <input type="hidden" name="do" value="message" />
      <input type="hidden" name="project" value={project} />
      {uploads.length > 0 && (
        <ul className="flex gap-2 overflow-x-auto px-1 pb-2 pt-1" aria-label="Files to send">
          {uploads.map((u) => (
            <li key={u.key} className={cn('relative flex w-[200px] shrink-0 items-center gap-2.5 rounded-[14px] bg-white p-2 pr-8 ring-1', u.error ? 'ring-ember/40' : 'ring-char/10')}>
              {u.preview && u.kind === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element -- a local preview of the picked file
                <img src={u.preview} alt="" className="h-10 w-10 shrink-0 rounded-[8px] object-cover" />
              ) : (
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-sand">
                  {u.kind === 'video' ? <Film className="h-4 w-4 text-ember" /> : <FileText className="h-4 w-4 text-ember" />}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-char">{u.name}</span>
                {u.error ? (
                  <span className="block text-[11.5px] font-semibold leading-tight text-ember-dark">{u.error}</span>
                ) : u.id ? (
                  <span className="block text-[11.5px] font-medium text-stone">{sizeText(u.size)} · ready</span>
                ) : (
                  <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-char/10" role="progressbar" aria-label={`Uploading ${u.name}`} aria-valuenow={Math.round(u.progress * 100)}>
                    <span className="block h-full rounded-full bg-ember transition-[width]" style={{ width: `${Math.max(4, u.progress * 100)}%` }} />
                  </span>
                )}
              </span>
              <button type="button" onClick={() => onRemove(u.key)} aria-label={`Remove ${u.name}`} className={cn('absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-stone hover:bg-paper hover:text-char', RING)}>
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-end gap-1.5">
        <input
          ref={picker}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) onAttach(e.target.files);
            e.target.value = '';
          }}
        />
        <button type="button" onClick={() => picker.current?.click()} aria-label="Attach a screenshot, recording or PDF" title="Attach a screenshot, recording or PDF" className={cn('mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:bg-sand hover:text-char', RING)}>
          <Paperclip aria-hidden="true" className="h-5 w-5" />
        </button>
        <textarea
          ref={box}
          name="text"
          required={!ready}
          rows={1}
          maxLength={2000}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={(e) => {
            const files = Array.from(e.clipboardData.files);
            if (files.length) {
              onAttach(files);
              if (!e.clipboardData.getData('text')) e.preventDefault();
            }
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
            if (window.matchMedia('(pointer: coarse)').matches) return;
            e.preventDefault();
            if (canSend) onSend();
          }}
          placeholder={`Message ${lead}…`}
          aria-label={`Message ${lead}`}
          className="max-h-[220px] min-h-[44px] flex-1 resize-none border-0 bg-transparent px-1.5 py-2.5 text-[16px] font-medium leading-[1.5] text-char placeholder:text-stone/70 focus:outline-none"
        />
        <button
          type="submit"
          aria-disabled={!canSend}
          aria-label={uploading ? 'Uploading…' : 'Send'}
          className={cn('mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors', RING, canSend ? 'bg-ember text-white hover:bg-ember-dark' : 'bg-char/10 text-char/30')}
        >
          <ArrowUp aria-hidden="true" className="h-5 w-5" strokeWidth={2.4} />
        </button>
      </div>
    </form>
  );
}
