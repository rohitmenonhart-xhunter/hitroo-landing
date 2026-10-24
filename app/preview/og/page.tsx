import Wordmark from '@/components/brand/Wordmark';
import Glass from '@/components/warm/Glass';
import { Tight } from '@/components/warm/ui';

/** The social card (public/og-image.png, 1200 × 675), captured from this page. Not linked, not indexed. */
export default function OgCard() {
  return (
    <div data-og className="relative flex h-[675px] w-[1200px] flex-col justify-between overflow-hidden bg-paper p-16">
      <Wordmark className="text-[40px] text-char" />
      <Glass name="wordmark" priority sizes="1000px" className="mx-auto h-auto w-[960px]" />
      <div className="flex items-end justify-between">
        <p className="font-display text-[34px] font-extrabold leading-[1.05] tracking-[-0.04em] text-char"><Tight>Software, automation, AI and creatives.</Tight></p>
        <p className="text-[22px] font-medium text-stone">hitroo.com</p>
      </div>
    </div>
  );
}
