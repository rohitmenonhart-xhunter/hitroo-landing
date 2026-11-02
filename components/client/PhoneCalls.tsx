import { PhoneCall, ShieldCheck } from 'lucide-react';
import type { Phone } from '@/lib/client/types';
import { cn } from '@/lib/utils';
import { Card, CardHead, Field, INPUT, RING, SubmitButton } from './ui';

const QUIET = cn('text-[14px] font-semibold text-char underline decoration-char/25 underline-offset-[5px] hover:decoration-char', RING);

/**
 * Phone calls with the Project Lead (the factory's D44). The client verifies their mobile: a call to it reads
 * out a six-digit code, which they type here. From then on they can ring their lead from that number, and
 * the lead can ring them when the team needs them (they can turn that off). Every form works without JavaScript.
 */
export default function PhoneCalls({ token, lead, phone }: { token: string; lead: string; phone: Phone }) {
  const action = `/d/${token}/send`;
  return (
    <Card id="phone">
      <CardHead title="Phone calls" aside={phone.number ? <span className="inline-flex items-center gap-1.5 text-[#23794A]"><ShieldCheck aria-hidden="true" className="h-4 w-4" />Verified</span> : undefined} />

      {phone.number ? (
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-[15.5px] font-medium leading-relaxed text-char/75">
              Call {lead} from <span className="font-semibold text-char">{phone.number}</span>, any time. Calls from other numbers don’t get through.
            </p>
            <p className="mt-1.5 text-[14px] font-medium text-stone">
              {phone.calls ? `${lead} may call you when the team needs you, between ${phone.hours} India time, at most twice a day.` : `${lead} won't call you. You'll hear from ${lead} in the chat instead.`}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <form method="post" action={action}>
                <input type="hidden" name="do" value="phone-calls" />
                <input type="hidden" name="on" value={phone.calls ? 'no' : 'yes'} />
                <button type="submit" className={QUIET}>
                  {phone.calls ? `Don't let ${lead} call me` : `Let ${lead} call me`}
                </button>
              </form>
              <form method="post" action={action}>
                <input type="hidden" name="do" value="phone-remove" />
                <button type="submit" className={cn(QUIET, 'text-stone')}>
                  Remove my number
                </button>
              </form>
            </div>
          </div>
          <a href={`tel:${phone.leadNumberTel}`} className={cn('group inline-flex h-12 items-center gap-3 rounded-full bg-char pl-5 pr-1.5 text-[15.5px] font-semibold text-white transition-colors hover:bg-char/90', RING)}>
            <span>
              Call {lead} <span className="tabular-nums text-white/70">{phone.leadNumber}</span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember">
              <PhoneCall aria-hidden="true" className="h-4 w-4" />
            </span>
          </a>
        </div>
      ) : phone.verifying ? (
        <div className="mt-4 max-w-[520px]">
          <p className="text-[15.5px] font-medium leading-relaxed text-char/75">
            We’re calling <span className="font-semibold text-char">{phone.verifying}</span> and reading out a six-digit code. Type it here.
          </p>
          <form method="post" action={action} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="do" value="phone-confirm" />
            <div className="w-[200px]">
              <Field label="The code">
                <input name="code" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" maxLength={7} placeholder="123456" className={cn(INPUT, 'text-center font-semibold tracking-[0.3em] tabular-nums')} />
              </Field>
            </div>
            <SubmitButton>Verify</SubmitButton>
          </form>
          <form method="post" action={action} className="mt-3">
            <input type="hidden" name="do" value="phone-remove" />
            <p className="text-[14px] font-medium text-stone">
              No call?{' '}
              <button type="submit" className={QUIET}>
                Try again or use another number
              </button>
            </p>
          </form>
        </div>
      ) : (
        <div className="mt-4 max-w-[560px]">
          <p className="text-[15.5px] font-medium leading-relaxed text-char/75">
            Talk with {lead} on the phone. Verify your mobile once, then call {lead} from it any time, and {lead} can call you when the team needs a quick answer.
          </p>
          <form method="post" action={action} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="do" value="phone-start" />
            <div className="w-[240px]">
              <Field label="Your mobile number">
                <input name="phone" type="tel" required inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" maxLength={20} className={INPUT} />
              </Field>
            </div>
            <SubmitButton>Call me with a code</SubmitButton>
          </form>
          <p className="mt-3 text-[13.5px] font-medium text-stone">We’ll call this number and read out a six-digit code. Indian mobiles only, for now.</p>
        </div>
      )}
    </Card>
  );
}
