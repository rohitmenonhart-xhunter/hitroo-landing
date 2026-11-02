import { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The message box: grows with the text, Enter sends and Shift + Enter starts a new line (on phones Enter is a
 * new line and the button sends). Without JavaScript it's a plain form to the dashboard's form handler.
 */
export default function Composer({ token, project, lead, value, onChange, onSend }: { token: string; project: string; lead: string; value: string; onChange: (v: string) => void; onSend: (text: string) => void }) {
  const box = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);
  const empty = !value.trim();
  return (
    <form
      method="post"
      action={`/d/${token}/send`}
      onSubmit={(e) => {
        e.preventDefault();
        if (!empty) onSend(value);
        box.current?.focus();
      }}
      className="rounded-[22px] bg-paper p-2 ring-1 ring-char/10 transition-shadow focus-within:bg-white focus-within:shadow-[0_6px_24px_rgba(18,17,11,0.08)] focus-within:ring-char/30"
    >
      <input type="hidden" name="do" value="message" />
      <input type="hidden" name="project" value={project} />
      <div className="flex items-end gap-2">
        <textarea
          ref={box}
          name="text"
          required
          rows={1}
          maxLength={2000}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
            if (window.matchMedia('(pointer: coarse)').matches) return;
            e.preventDefault();
            if (!empty) onSend(value);
          }}
          placeholder={`Message ${lead}…`}
          aria-label={`Message ${lead}`}
          className="max-h-[220px] min-h-[44px] flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-[16px] font-medium leading-[1.5] text-char placeholder:text-stone/70 focus:outline-none"
        />
        <button
          type="submit"
          aria-disabled={empty}
          aria-label="Send"
          className={cn('mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-char', empty ? 'bg-char/10 text-char/30' : 'bg-ember text-white hover:bg-ember-dark')}
        >
          <ArrowUp aria-hidden="true" className="h-5 w-5" strokeWidth={2.4} />
        </button>
      </div>
    </form>
  );
}
