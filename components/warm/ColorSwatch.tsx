'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

/** A brand colour as a white card: the swatch, its name and role, and its hex, which copies on click. */
export default function ColorSwatch({ name, role, hex, rgb }: { name: string; role: string; hex: string; rgb: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the hex stays visible to select by hand */
    }
  };
  return (
    <div className="flex h-full flex-col rounded-[24px] bg-white p-4 ring-1 ring-char/5">
      <div className={cn('aspect-[4/3] rounded-[16px]', (hex === '#FFFFFF' || hex === '#FCF8F6') && 'ring-1 ring-inset ring-char/10')} style={{ background: hex }} />
      <p className="mt-5 px-1 font-display text-[20px] font-bold tracking-[-0.025em] text-char">{name}</p>
      <p className="mt-0.5 px-1 text-[15px] font-medium text-stone">{role}</p>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${name} ${hex}`}
        className="group mx-1 mt-4 inline-flex items-center gap-1.5 self-start rounded text-[15px] font-bold text-char focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-char"
      >
        {hex}
        {copied ? <Check aria-hidden="true" className="h-4 w-4 text-ember" /> : <Copy aria-hidden="true" className="h-4 w-4 text-stone group-hover:text-char" />}
        <span role="status" className="sr-only">
          {copied ? 'Copied' : ''}
        </span>
      </button>
      <p className="mt-1 px-1 pb-1 text-[13px] font-medium text-stone">RGB {rgb}</p>
    </div>
  );
}
