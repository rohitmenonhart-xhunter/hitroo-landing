import { CheckCircle2, CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

/** What the client sees after sending something. Codes only travel in the address, never free text. */
const SENT: Record<string, string> = {
  new: 'Thanks! The team is pricing your new project. The quote will appear here shortly.',
  change: 'Thanks! The team is pricing your change. The quote will appear here shortly.',
  problem: 'Thanks for telling us. The team is on it, and you can follow it here.',
  newwork: "Thanks! That's something new rather than a fault in what we built, so it'll come as a quote, here on your dashboard.",
  answer: 'Thanks! Your answer is with the team, and the work carries on.',
  domain: "Got it. Add the DNS record below at your domain's company; it connects by itself, usually within the hour.",
  accepted: 'Thank you! The quote is accepted. The first payment is below.',
};
const ERROR: Record<string, string> = {
  short: 'Tell us a little more, so the team gets it right.',
  empty: 'Write something first.',
  domain: "That doesn't look like a domain we can connect. Check the spelling, for example bloomflorists.in or shop.bloomflorists.in.",
  answered: 'That question has already been answered.',
  refused: "We couldn't start that from here just now. Message your project lead in the chat and they'll help.",
  accept: 'Type your full name and tick the box to accept.',
  expired: 'This quote has expired. Ask your project lead for a fresh one.',
  busy: 'Too many tries in a short time. Please wait a few minutes and try again.',
  failed: 'Something went wrong on our side. Please try again in a minute.',
};

export function Notice({ sent, error, className }: { sent?: string; error?: string; className?: string }) {
  const ok = sent ? SENT[sent] : undefined;
  const bad = error ? ERROR[error] : undefined;
  if (!ok && !bad) return null;
  return (
    <p role={bad ? 'alert' : 'status'} className={cn('flex items-start gap-3 rounded-[18px] px-5 py-4 text-[15px] font-semibold leading-snug', bad ? 'bg-ember/10 text-ember-dark' : 'bg-[#2F9E5B]/10 text-[#1F6B41]', className)}>
      {bad ? <CircleAlert aria-hidden="true" className="mt-px h-5 w-5 shrink-0" /> : <CheckCircle2 aria-hidden="true" className="mt-px h-5 w-5 shrink-0" />}
      {bad ?? ok}
    </p>
  );
}

/** A query parameter's single value. */
export const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
