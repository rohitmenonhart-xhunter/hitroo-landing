'use client';

import { useEffect, useState } from 'react';

/** The time at our office (India, UTC+5:30), updated every minute. Renders nothing until mounted. */
export default function LocalTime({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return null;
  return <span className={className}>It’s {now} at our office</span>;
}
