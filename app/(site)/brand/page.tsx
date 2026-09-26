import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowDown, X } from 'lucide-react';
import ColorSwatch from '@/components/corporate/ColorSwatch';
import PageHero from '@/components/corporate/PageHero';
import { ArrowLink, Section, SectionHeader } from '@/components/corporate/ui';
import JsonLd from '@/components/seo/JsonLd';
import { COMPANY } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

const DESCRIPTION = 'The HITROO brand kit: logo and mark downloads (SVG, PNG), colours, type and how to use them.';
export const metadata = pageMetadata({ title: 'Brand kit', description: DESCRIPTION, path: '/brand' });

const LOGO = { src: '/brand/hitroo-logo.svg', w: 126.6, h: 26 };
const MARK = { src: '/brand/hitroo-mark.svg', w: 36.4, h: 26 };

const COLOURS = [
  { name: 'Cobalt', role: 'Primary', hex: '#2451FF', rgb: '36 81 255' },
  { name: 'Navy', role: 'Logo, deep accents', hex: '#0A1B4A', rgb: '10 27 74' },
  { name: 'Ink', role: 'Text', hex: '#0A1633', rgb: '10 22 51' },
  { name: 'Mist', role: 'Soft backgrounds', hex: '#F4F6FA', rgb: '244 246 250' },
  { name: 'White', role: 'Page', hex: '#FFFFFF', rgb: '255 255 255' },
];

const DONTS: { label: string; tile?: string; photo?: boolean; style?: CSSProperties }[] = [
  { label: 'Don’t recolour it', style: { filter: 'hue-rotate(150deg) saturate(1.6)' } },
  { label: 'Don’t stretch it', style: { transform: 'scaleX(1.45)' } },
  { label: 'Don’t rotate it', style: { transform: 'rotate(-12deg)' } },
  { label: 'Don’t add effects', style: { filter: 'drop-shadow(0 6px 6px rgba(10,22,51,0.45)) blur(0.4px)' } },
  { label: 'Don’t place it on dark colours', tile: 'bg-navy' },
  { label: 'Don’t place it on busy photos', photo: true },
];

const DOWNLOAD = 'inline-flex items-center gap-1.5 text-[15px] font-medium text-cobalt hover:text-cobalt-dark';

function Download({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} download className={DOWNLOAD}>
      <ArrowDown aria-hidden="true" className="h-4 w-4" />
      {children}
    </a>
  );
}

function Logo({ mark, height, style }: { mark?: boolean; height: number; style?: CSSProperties }) {
  const a = mark ? MARK : LOGO;
  return <Image src={a.src} alt="" width={Math.round((a.w / a.h) * height)} height={height} unoptimized style={style} />;
}

export default function BrandPage() {
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Brand kit', '/brand', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Brand kit', path: '/brand' }])} />
      <PageHero
        eyebrow="Brand"
        title="Brand kit"
        lede="Our logo, colours and type, and how to use them."
        actions={
          <a
            href="/brand/hitroo-brand-kit.zip"
            download
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-cobalt px-6 text-[15px] font-medium text-white transition-colors hover:bg-cobalt-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
          >
            Download all
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </a>
        }
      />

      <Section labelledBy="logo-title">
        <SectionHeader id="logo-title" title="Logo" lede="Always blue and black, on white. Write the name HITROO, in capitals." />
        <div className="mt-14 grid gap-10 md:grid-cols-5 lg:mt-20">
          <div className="md:col-span-3">
            <div role="img" aria-label="The HITROO logo" className="flex aspect-[16/9] items-center justify-center rounded-xl bg-white ring-1 ring-inset ring-line md:aspect-auto md:h-[360px]">
              <Logo height={64} />
            </div>
            <p className="mt-5 text-[17px] font-medium text-ink">Logo</p>
            <p className="mt-0.5 text-[14px] text-slate-500">Rings and name together. Use it everywhere.</p>
            <div className="mt-3 flex gap-6">
              <Download href="/brand/hitroo-logo.svg">SVG</Download>
              <Download href="/brand/hitroo-logo.png">PNG</Download>
            </div>
          </div>
          <div className="md:col-span-2">
            <div role="img" aria-label="The HITROO mark" className="flex aspect-[16/9] items-center justify-center rounded-xl bg-white ring-1 ring-inset ring-line md:aspect-auto md:h-[360px]">
              <Logo mark height={80} />
            </div>
            <p className="mt-5 text-[17px] font-medium text-ink">Mark</p>
            <p className="mt-0.5 text-[14px] text-slate-500">The rings alone, for app icons and favicons.</p>
            <div className="mt-3 flex gap-6">
              <Download href="/brand/hitroo-mark.svg">SVG</Download>
              <Download href="/brand/hitroo-mark.png">PNG</Download>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="space-title">
        <SectionHeader id="space-title" title="Space and size" lede="Keep the height of the H clear on every side. Never smaller than 20 px tall on screen, or 8 mm in print." />
        <div className="mt-14 flex aspect-[16/9] items-center justify-center rounded-xl bg-mist sm:aspect-[21/9] lg:mt-20">
          <div className="p-[27px] outline-dashed outline-1 outline-cobalt/50">
            <Logo height={52} />
          </div>
        </div>
      </Section>

      <Section labelledBy="colour-title">
        <SectionHeader id="colour-title" title="Colours" lede="One blue for trust, with navy and ink. Click a code to copy it." />
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-5 lg:mt-20">
          {COLOURS.map((c) => (
            <ColorSwatch key={c.hex} {...c} />
          ))}
        </div>
      </Section>

      <Section labelledBy="type-title">
        <SectionHeader id="type-title" title="Type" lede="Inter for everything; Newsreader for story moments only." />
        <div className="mt-14 grid gap-12 md:grid-cols-2 lg:mt-20 lg:gap-16">
          <div className="rounded-xl bg-mist p-8 lg:p-10">
            <p className="text-[96px] font-light leading-none tracking-[-0.04em] text-ink">Aa</p>
            <p className="mt-8 text-[22px] font-medium text-ink">Inter</p>
            <ul className="mt-4 space-y-2 text-[17px] text-slate-600">
              <li className="font-light">Light — headlines</li>
              <li>Regular — text</li>
              <li className="font-semibold">SemiBold — labels and the logo</li>
            </ul>
            <ArrowLink href="https://fonts.google.com/specimen/Inter" target="_blank" rel="noopener noreferrer" className="mt-6">
              Get Inter
            </ArrowLink>
          </div>
          <div className="rounded-xl bg-mist p-8 lg:p-10">
            <p className="font-serif text-[96px] leading-none text-ink">Aa</p>
            <p className="mt-8 font-serif text-[22px] text-ink">Newsreader</p>
            <ul className="mt-4 space-y-2 text-[17px] text-slate-600">
              <li>Story headlines only</li>
              <li>Never for body text</li>
            </ul>
            <ArrowLink href="https://fonts.google.com/specimen/Newsreader" target="_blank" rel="noopener noreferrer" className="mt-6">
              Get Newsreader
            </ArrowLink>
          </div>
        </div>
      </Section>

      <Section labelledBy="donts-title">
        <SectionHeader id="donts-title" title="Please don’t" />
        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {DONTS.map((d) => (
            <li key={d.label}>
              <div className={`relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl ${d.tile ?? 'bg-white ring-1 ring-inset ring-line'}`}>
                {d.photo && <Image src="/photos/process-discover.webp" alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover" />}
                <span className="relative">
                  <Logo height={36} style={d.style} />
                </span>
              </div>
              <p className="mt-4 flex items-center gap-2 text-[16px] text-ink">
                <X aria-hidden="true" className="h-4 w-4 text-slate-400" strokeWidth={2.5} />
                {d.label}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-14 max-w-2xl text-[17px] leading-relaxed text-slate-600">Use our logo only to refer to HITROO, never to suggest we endorse something.</p>
      </Section>

      <Section labelledBy="brand-contact-title">
        <h2 id="brand-contact-title" className="text-[32px] font-light leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px]">
          Questions about the brand?
        </h2>
        <p className="mt-5 text-[18px] leading-relaxed text-slate-600">
          Email{' '}
          <a href={`mailto:${COMPANY.email}`} className="font-medium text-cobalt hover:text-cobalt-dark">
            {COMPANY.email}
          </a>
          .
        </p>
        <ArrowLink href="/news" className="mt-8">
          Newsroom
        </ArrowLink>
      </Section>
    </>
  );
}
