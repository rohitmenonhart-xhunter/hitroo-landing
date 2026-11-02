import { cn } from '@/lib/utils';

const day = (d: string) => new Date(`${d}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });

/** The last 30 days, one bar a day: green when up all day, ember when it was down for a while, sand before the checks began. */
export default function UptimeBars({ days }: { days: Array<{ date: string; pct: number | null }> }) {
  return (
    <div>
      <ol className="flex h-10 items-stretch gap-[3px]" aria-label="Uptime, day by day">
        {days.map((d) => (
          <li
            key={d.date}
            title={`${day(d.date)}: ${d.pct === null ? 'no checks yet' : `${d.pct}% up`}`}
            className={cn('flex-1 rounded-[3px]', d.pct === null ? 'bg-sand' : d.pct >= 99.5 ? 'bg-[#2F9E5B]' : d.pct >= 95 ? 'bg-[#E9A23B]' : 'bg-ember')}
          >
            <span className="sr-only">
              {day(d.date)}: {d.pct === null ? 'no checks yet' : `${d.pct}% up`}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex justify-between text-[12.5px] font-medium text-stone">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
