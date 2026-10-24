import Image from 'next/image';
import type { ReactNode } from 'react';
import { ArrowDown } from 'lucide-react';
import Wordmark from '@/components/brand/Wordmark';
import JsonLd from '@/components/seo/JsonLd';
import ColorSwatch from '@/components/warm/ColorSwatch';
import Glass from '@/components/warm/Glass';
import PageIntro from '@/components/warm/PageIntro';
import { WSection } from '@/components/warm/ui';
import { getContent } from '@/lib/content';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';
import { cn } from '@/lib/utils';

const DESCRIPTION = 'The HITROO brand kit: the wordmark (SVG, PNG), the glass wordmark, the app icon, colours, type and how to use them.';
export const metadata = pageMetadata({ title: 'Brand kit', description: DESCRIPTION, path: '/brand' });

const COLOURS = [
  { name: 'Paper', role: 'The page', hex: '#FCF8F6', rgb: '252 248 246' },
  { name: 'Char', role: 'Text and dark cards', hex: '#12110B', rgb: '18 17 11' },
  { name: 'Ember', role: 'The “hi” and accents', hex: '#F5502F', rgb: '245 80 47' },
  { name: 'Sand', role: 'Quiet fills', hex: '#F3EEE8', rgb: '243 238 232' },
  { name: 'Stone', role: 'Secondary text', hex: '#6F6A61', rgb: '111 106 97' },
  { name: 'White', role: 'Cards', hex: '#FFFFFF', rgb: '255 255 255' },
];

const TYPE = [
  { family: 'Plus Jakarta Sans', use: 'Headlines in ExtraBold and Bold, and the wordmark.', className: 'font-display font-extrabold tracking-[-0.05em]' },
  { family: 'Fustat', use: 'Text and interface, Medium for reading.', className: 'font-body font-medium tracking-[-0.03em]' },
];

const RULES = [
  'The wordmark is always lowercase “hitroo”. In writing, the company is HITROO.',
  '“hi” is always Ember; “troo” is Char on light backgrounds and Paper on dark ones.',
  'Keep clear space around the wordmark of at least the height of the “h”.',
  'Don’t recolour, stretch, rotate or outline the wordmark, or add shadows or glows.',
  'Glass stays clear: no colour tint, no glow, no drop shadow.',
];

const FILES = [
  { href: '/brand/hitroo-wordmark.svg', label: 'Wordmark (SVG)' },
  { href: '/brand/hitroo-wordmark.png', label: 'Wordmark (PNG)' },
  { href: '/brand/hitroo-wordmark-light.svg', label: 'On dark (SVG)' },
  { href: '/brand/hitroo-wordmark-light.png', label: 'On dark (PNG)' },
  { href: '/brand/hitroo-wordmark-glass.png', label: 'Glass wordmark (PNG)' },
  { href: '/brand/hitroo-icon.svg', label: 'App icon (SVG)' },
  { href: '/brand/hitroo-icon.png', label: 'App icon (PNG)' },
];

function Download({ href, children, strong }: { href: string; children: ReactNode; strong?: boolean }) {
  return (
    <a
      href={href}
      download
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-char',
        strong ? 'bg-char text-white hover:bg-black' : 'bg-white text-char ring-1 ring-char/10 hover:bg-[#FFF8F5]'
      )}
    >
      <ArrowDown aria-hidden="true" className="h-4 w-4" />
      {children}
    </a>
  );
}

const TILE = 'flex aspect-[4/3] items-center justify-center rounded-[24px]';

export default async function BrandPage() {
  const COMPANY = await getContent('company');
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Brand kit', '/brand', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Brand kit', path: '/brand' }])} />
      <PageIntro
        word="brand"
        caption="Brand"
        title="Brand kit"
        lede="Our wordmark, colours, type and glass, and how to use them."
        action={
          <Download href="/brand/hitroo-brand-kit.zip" strong>
            Download the kit (ZIP)
          </Download>
        }
      />

      <WSection id="logo-title" caption="Logo" title="One word, with “hi” in Ember." lede="Plus Jakarta Sans ExtraBold, lowercase. Shown in full everywhere except the app icon.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className={cn(TILE, 'bg-white ring-1 ring-char/5')}>
            <Wordmark className="text-[clamp(44px,5vw,72px)] text-char" />
          </div>
          <div className={cn(TILE, 'bg-char')}>
            <Wordmark className="text-[clamp(44px,5vw,72px)] text-paper" />
          </div>
          <div className={cn(TILE, 'bg-sand')}>
            <Image src="/brand/hitroo-icon.svg" alt="The HITROO app icon: “hi” in Ember on Paper" width={160} height={160} unoptimized className="h-[38%] w-auto rounded-[22%]" />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {FILES.map((f) => (
            <Download key={f.href} href={f.href}>
              {f.label}
            </Download>
          ))}
        </div>
      </WSection>

      <WSection id="glass-title" caption="Glass" title="Clear glass is part of the brand." lede="Words and numerals in glass that bends the light behind them. Always clear: no tint, no glow, no shadow.">
        <div className="glass-warm flex items-center justify-center rounded-[32px] px-6 py-14 sm:px-12 sm:py-20">
          <Glass name="wordmark" alt="The HITROO wordmark in clear glass" sizes="(min-width: 1024px) 900px, 90vw" className="h-auto w-full max-w-[900px]" />
        </div>
      </WSection>

      <WSection id="colours-title" caption="Colours" title="Warm paper, dark char, one ember.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {COLOURS.map((c) => (
            <ColorSwatch key={c.hex} {...c} />
          ))}
        </div>
      </WSection>

      <WSection id="type-title" caption="Type" title="Two typefaces.">
        <ul className="grid gap-4 md:grid-cols-2">
          {TYPE.map((t) => (
            <li key={t.family} className="rounded-[24px] bg-white p-8 ring-1 ring-char/5">
              <p className={cn('text-[clamp(72px,8vw,120px)] leading-none text-char', t.className)}>Aa</p>
              <p className="mt-10 font-display text-[24px] font-bold tracking-[-0.03em] text-char">{t.family}</p>
              <p className="mt-1 text-[16px] font-medium text-stone">{t.use}</p>
            </li>
          ))}
        </ul>
      </WSection>

      <WSection id="rules-title" caption="Use it well" title="Five rules.">
        <ol className="glass-warm rounded-[32px] px-7 sm:px-10">
          {RULES.map((r, i) => (
            <li key={r} className="flex gap-5 border-t border-char/10 py-6 first:border-t-0">
              <span className="font-jakarta text-[15px] font-extrabold tabular-nums text-ember">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[18px] font-medium leading-snug text-char sm:text-[20px]">{r}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-[16px] font-medium text-stone">
          Questions:{' '}
          <a href={`mailto:${COMPANY.email}`} className="text-char underline decoration-char/30 underline-offset-4 hover:decoration-char">
            {COMPANY.email}
          </a>
        </p>
      </WSection>
    </>
  );
}
