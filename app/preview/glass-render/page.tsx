'use client';

import { useRef } from 'react';
import { WORDMARK_GLASS } from '@/components/warm/glass-style';
import GlassWordmark from '@/components/clear/GlassWordmark';

/**
 * Renders each still glass asset once, at twice its CSS size in pixels so it stays sharp on 2x screens, to be
 * captured into public/glass/ (transparent images, so the live WebGL runs only in the home hero). Not linked, not indexed.
 */
const PAPER = '#FCF8F6';
const WHITE = '#FFFFFF';
const INK = '#12110B';

/** Page and service hero words. All share one box height, so every word gets the same letter size. They use a
 *  gentler corner rounding than the wordmark: the rounding erases strokes thinner than twice its radius, which took
 *  the crossbar out of "e" and broke up "a". */
const WORDS = [
  'software', 'automation', 'ai', 'creatives', 'services', 'custom', 'mobile', 'desktop', 'models', 'agents', 'vision', 'managed',
  'about', 'contact', 'support', 'careers', 'insights', 'articles', 'blog', 'news', 'research', 'perspective', 'brand',
  'privacy', 'terms', 'cookies', 'security', 'accessibility', 'sitemap', '404',
];

const ITEMS: { id: string; text: string; bg: string; w: number; h: number; fontFit?: boolean }[] = [
  ...['01', '02', '03', '04'].map((n) => ({ id: `division-${n}`, text: n, bg: PAPER, w: 1200, h: 820 })),
  ...['01', '02', '03', '04'].map((n) => ({ id: `step-${n}`, text: n, bg: WHITE, w: 640, h: 400 })),
  { id: 'hi', text: 'hi', bg: PAPER, w: 1000, h: 760 },
  { id: 'hi-ink', text: 'hi', bg: INK, w: 800, h: 640 },
  { id: 'question', text: '?', bg: PAPER, w: 700, h: 900 },
  { id: 'wordmark', text: 'hitroo', bg: PAPER, w: 2200, h: 760 },
  { id: 'code', text: '</>', bg: PAPER, w: 1400, h: 760 },
  ...WORDS.map((w) => ({ id: `word-${w}`, text: w, bg: PAPER, w: 300 * w.length + 400, h: 520, fontFit: true })),
];

function Item({ id, text, bg, w, h, fontFit }: (typeof ITEMS)[number]) {
  const boxRef = useRef<HTMLDivElement>(null);
  return (
    <div data-glass={id} data-bg={bg} className="relative isolate shrink-0" style={{ width: w, height: h, background: bg }}>
      <GlassWordmark hero={{ ...WORDMARK_GLASS, text, oneLine: true, lower: false, track: -0.02, fontFit, corner: fontFit ? 0.018 : WORDMARK_GLASS.corner }} boxRef={boxRef} plain background={bg} pixelRatio={2} fieldLimit={8000} />
      <div ref={boxRef} className="pointer-events-none absolute" style={{ inset: '7%' }} />
    </div>
  );
}

/** Browsers keep about 16 WebGL contexts per page, so the export renders a batch at a time: ?batch=0, 1, 2…
 *  (or ?only=id,id for a few). */
const BATCH = 10;

export default function GlassRender({ searchParams }: { searchParams: { batch?: string; only?: string } }) {
  const batch = Number(searchParams.batch ?? 0);
  const only = searchParams.only?.split(',');
  const items = only ? ITEMS.filter((it) => only.includes(it.id)) : ITEMS.slice(batch * BATCH, (batch + 1) * BATCH);
  return (
    <div className="flex flex-wrap gap-6 bg-[#888] p-6" data-batches={only ? 1 : Math.ceil(ITEMS.length / BATCH)}>
      {items.map((it) => (
        <Item key={it.id} {...it} />
      ))}
    </div>
  );
}
