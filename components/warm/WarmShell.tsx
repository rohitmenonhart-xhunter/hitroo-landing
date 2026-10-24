import type { ReactNode } from 'react';
import Analytics from '@/components/corporate/Analytics';
import CookieConsent from '@/components/corporate/CookieConsent';
import WarmFooter from './WarmFooter';
import WarmHeader from './WarmHeader';

/** Every page's frame: a skip link, the header, the page, the footer; first-party analytics and the cookie choice. */
export default function WarmShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-char px-5 py-3 text-[15px] font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      {/* Post covers in warm monochrome (clear glass on paper), whatever colours the uploaded image has. */}
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id="duotone-warm" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.165 0.165 0.250 0.370 0.474 0.570 0.660 0.746 0.829 0.910 0.988" />
            <feFuncG type="table" tableValues="0.149 0.149 0.234 0.355 0.458 0.554 0.644 0.730 0.813 0.894 0.973" />
            <feFuncB type="table" tableValues="0.125 0.125 0.212 0.335 0.441 0.538 0.630 0.718 0.803 0.885 0.965" />
          </feComponentTransfer>
        </filter>
      </svg>
      <WarmHeader />
      <main id="main">{children}</main>
      <WarmFooter />
      <Analytics />
      <CookieConsent />
    </>
  );
}
