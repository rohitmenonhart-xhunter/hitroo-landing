import { Bug, Rocket, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, Field, INPUT, SubmitButton } from './ui';

const KINDS = {
  new: { icon: Rocket, title: 'Start a new project', lead: 'Tell us what you want built. The team prices it and the quote appears here, usually the same day.', label: 'What do you need?', placeholder: 'For example: a booking website for my salon, with online payments and booking reminders.', button: 'Get a quote' },
  change: { icon: Sparkles, title: 'Ask for a change', lead: 'Something new or different. The team prices it, and nothing starts or is charged until you accept the quote.', label: 'What should change?', placeholder: 'For example: add gift wrapping as an option at checkout, with a note card.', button: 'Get a quote' },
  problem: { icon: Bug, title: 'Report a problem', lead: "Something that doesn't work the way it should. Faults in what we built are fixed free.", label: "What's wrong?", placeholder: 'What you did, what you expected, and what happened instead. Which page, and on phone or computer?', button: 'Send to the team' },
} as const;

/** One request: a new project, a change (both become quotes) or a problem (a free fix). */
export default function RequestForm({ token, project, kind }: { token: string; project?: string; kind: keyof typeof KINDS }) {
  const k = KINDS[kind];
  const Icon = k.icon;
  return (
    <Card className="max-w-[760px]">
      <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-sand">
        <Icon className="h-5 w-5 text-ember" strokeWidth={1.8} />
      </span>
      <h2 className="mt-6 font-display text-[26px] font-extrabold tracking-[-0.035em]">{k.title}</h2>
      <p className="mt-2 text-[15.5px] font-medium leading-relaxed text-char/75">{k.lead}</p>
      <form method="post" action={`/d/${token}/send`} className="mt-6 space-y-5">
        <input type="hidden" name="do" value={kind} />
        {project && <input type="hidden" name="project" value={project} />}
        <Field label={k.label} hint="A few sentences is plenty. The team will ask if anything is missing.">
          <textarea name="text" required minLength={20} maxLength={4000} rows={7} placeholder={k.placeholder} className={cn(INPUT, 'resize-y leading-relaxed')} />
        </Field>
        <SubmitButton>{k.button}</SubmitButton>
      </form>
    </Card>
  );
}
