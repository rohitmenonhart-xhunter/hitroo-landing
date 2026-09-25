import Header from '@/components/corporate/Header';
import Footer from '@/components/corporate/Footer';
import Analytics from '@/components/corporate/Analytics';
import CookieConsent from '@/components/corporate/CookieConsent';

/** Every marketing page: one header, one footer, plain white; first-party analytics and the cookie choice. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <Analytics />
      <CookieConsent />
    </>
  );
}
