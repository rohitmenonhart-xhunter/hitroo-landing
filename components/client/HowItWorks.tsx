import { Card } from './ui';

const STEPS = [
  ['You tell us', 'A few sentences about what you need.'],
  ['You get a quote', 'A fixed price, with what is and isn’t included, usually the same day.'],
  ['You accept and pay the first part', 'Online, by UPI, card or net banking. Work starts right away.'],
  ['You follow it here', 'Progress, designs to review, and questions from the team, until it’s live.'],
] as const;

/** The four steps from an idea to a live project. */
export default function HowItWorks() {
  return (
    <Card className="h-fit bg-sand/60 ring-0">
      <h2 className="font-display text-[19px] font-bold tracking-[-0.025em]">How it works</h2>
      <ol className="mt-5 space-y-5">
        {STEPS.map(([title, text], i) => (
          <li key={title} className="flex gap-4">
            <span className="font-display text-[15px] font-extrabold tabular-nums text-ember">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className="block text-[15px] font-bold">{title}</span>
              <span className="block text-[14px] font-medium leading-relaxed text-char/70">{text}</span>
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
