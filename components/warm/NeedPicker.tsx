'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/** "I need…": tap what you need (`items`), then go to the contact form with it filled in (as `?need=`). */
export default function NeedPicker({ items, prompt, placeholder }: { items: string[]; prompt: string; placeholder: string }) {
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  const next = () => router.push(picked.length ? `/contact?need=${encodeURIComponent(picked.join('; '))}` : '/contact');

  return (
    <div>
      <div className="glass-warm flex min-h-[64px] flex-wrap items-center gap-2 rounded-[20px] p-2 pl-5">
        <span className="font-display text-[22px] font-extrabold tracking-[-0.03em] text-char">{prompt}</span>
        {picked.length === 0 && <span className="text-[17px] font-medium text-stone">{placeholder}</span>}
        {picked.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => toggle(n)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-sand px-4 text-[15px] font-medium text-char hover:bg-[#EAE3DB]"
            aria-label={`Remove ${n}`}
          >
            {n}
            <Plus aria-hidden="true" className="h-4 w-4 rotate-45" />
          </button>
        ))}
        <button
          type="button"
          onClick={next}
          className={cn(
            'ml-auto inline-flex h-12 items-center gap-2 rounded-full px-5 text-[16px] font-medium transition-colors',
            picked.length ? 'bg-char text-white hover:bg-black' : 'bg-sand text-stone'
          )}
        >
          Next
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((n) => {
          const on = picked.includes(n);
          return (
            <li key={n} className="border-b border-char/10">
              <button
                type="button"
                onClick={() => toggle(n)}
                aria-pressed={on}
                className="group flex w-full items-center justify-between gap-4 py-4 text-left text-[18px] font-medium text-char"
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className={cn('h-2 w-2 rounded-full transition-colors', on ? 'bg-ember' : 'bg-char/20')} />
                  {n}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    on ? 'bg-ember text-white' : 'bg-white text-char ring-1 ring-char/10 group-hover:bg-sand'
                  )}
                >
                  {on ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
