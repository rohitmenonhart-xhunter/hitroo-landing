import { cn } from '@/lib/utils';
import Glass from './Glass';
import type { GlassName } from './glass-sizes';
import { H_S } from './ui';

/** Three or four equal white cards, each opened by its number in still glass; the line under each title is optional. */
export default function StepCards({ steps, className }: { steps: [string, string][]; className?: string }) {
  return (
    <ol className={cn('grid gap-4 sm:auto-rows-fr sm:grid-cols-2', steps.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4', className)}>
      {steps.map(([title, text], i) => (
        <li key={title} className="grid grid-rows-[auto_auto_1fr] rounded-[24px] bg-white p-7 ring-1 ring-char/5">
          <Glass name={`step-0${i + 1}` as GlassName} alt={`Step ${i + 1}`} className="h-[92px] w-auto" />
          <h3 className={cn(H_S, 'mt-8')}>{title}</h3>
          {text && <p className="mt-3 text-[16px] font-medium leading-relaxed text-char/75">{text}</p>}
        </li>
      ))}
    </ol>
  );
}
