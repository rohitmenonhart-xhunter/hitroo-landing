import Wordmark from '@/components/brand/Wordmark';

/** Quotes, payments and invoices: a calm page with the logo, the way a client opens it from WhatsApp. */
export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="mx-auto flex max-w-[1100px] items-center justify-between px-5 pb-2 pt-7 sm:px-8 print:hidden">
        <Wordmark className="text-[26px] text-char" />
        <a href="https://www.hitroo.com/contact" className="text-[14px] font-semibold text-char/70 hover:text-char">
          Questions? Contact us
        </a>
      </header>
      <main id="main" className="mx-auto max-w-[1100px] px-5 pb-24 pt-8 sm:px-8 print:max-w-none print:p-0">
        {children}
      </main>
    </div>
  );
}
