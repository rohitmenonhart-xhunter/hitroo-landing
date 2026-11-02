import type { Metadata } from 'next';
import Wordmark from '@/components/brand/Wordmark';
import { ActionLink } from '@/components/client/ui';

export const metadata: Metadata = { title: 'Your dashboard' };

/** my.hitroo.com without a link: where to get one. */
export default function DashboardHome() {
  return <SignInHelp title="Your hitroo dashboard" text="Every client has a private dashboard with their projects, quotes, payments, invoices and site numbers. Your link comes from your project lead on WhatsApp; ask them for it any time." />;
}

export function SignInHelp({ title, text }: { title: string; text: string }) {
  return (
    <main className="flex min-h-screen flex-col bg-paper px-5 py-8 sm:px-10">
      <Wordmark className="text-[28px] text-char" />
      <div className="mx-auto my-auto w-full max-w-[640px] py-16">
        <p className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.05em] text-char/70">
          <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-ember" />
          Client area
        </p>
        <h1 className="mt-4 font-display text-[clamp(36px,5vw,60px)] font-extrabold leading-[1] tracking-[-0.045em] [text-wrap:balance]">{title}</h1>
        <p className="mt-5 text-[18px] font-medium leading-relaxed text-char/75">{text}</p>
        <div className="mt-8">
          <ActionLink href="https://www.hitroo.com/contact">Contact hitroo</ActionLink>
        </div>
      </div>
    </main>
  );
}
