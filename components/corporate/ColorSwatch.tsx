'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

/** A brand colour: the swatch, its name and role, and its hex, which copies on click. */
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
    <div>
      <div className={cn('aspect-[4/3] rounded-lg', hex === '#FFFFFF' && 'ring-1 ring-inset ring-line')} style={{ background: hex }} />
      <p className="mt-4 text-[17px] font-medium text-ink">{name}</p>
      <p className="mt-0.5 text-[14px] text-slate-500">{role}</p>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${name} ${hex}`}
        className="group mt-3 inline-flex items-center gap-1.5 rounded font-mono text-[14px] text-ink transition-colors hover:text-cobalt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
      >
        {hex}
        {copied ? <Check aria-hidden="true" className="h-3.5 w-3.5 text-cobalt" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5 text-slate-400 group-hover:text-cobalt" />}
        <span role="status" className="sr-only">
          {copied ? 'Copied' : ''}
        </span>
      </button>
      <p className="mt-1 font-mono text-[13px] text-slate-500">RGB {rgb}</p>
    </div>
  );
}
