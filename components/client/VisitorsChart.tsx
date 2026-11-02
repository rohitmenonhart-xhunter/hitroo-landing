'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const label = (d: string) => new Date(`${d}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });

/** Visitors per day over the last 30 days: one ember area, page views as a quiet line behind it. */
export default function VisitorsChart({ daily }: { daily: Array<{ date: string; visitors: number; views: number }> }) {
  return (
    <div className="h-[240px] w-full" role="img" aria-label={`Visitors per day: ${daily.map((d) => `${label(d.date)} ${d.visitors}`).join(', ')}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={daily} margin={{ top: 8, right: 4, bottom: 0, left: -24 }}>
          <defs>
            <linearGradient id="visitors-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5502F" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#F5502F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#12110B" strokeOpacity={0.06} />
          <XAxis dataKey="date" tickFormatter={label} tickLine={false} axisLine={false} minTickGap={28} tick={{ fill: '#6F6A61', fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={48} tick={{ fill: '#6F6A61', fontSize: 12 }} />
          <Tooltip
            cursor={{ stroke: '#12110B', strokeOpacity: 0.15 }}
            contentStyle={{ borderRadius: 14, border: 'none', boxShadow: '0 8px 30px rgba(18,17,11,0.12)', fontSize: 13, fontWeight: 600 }}
            labelFormatter={(d) => label(String(d))}
            formatter={(v, name) => [v, name === 'visitors' ? 'Visitors' : 'Page views']}
          />
          <Area type="monotone" dataKey="views" stroke="#12110B" strokeOpacity={0.25} strokeWidth={1.5} fill="none" dot={false} />
          <Area type="monotone" dataKey="visitors" stroke="#F5502F" strokeWidth={2.5} fill="url(#visitors-fill)" dot={false} activeDot={{ r: 4, fill: '#F5502F', stroke: '#fff', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
