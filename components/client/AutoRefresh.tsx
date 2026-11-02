'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Reloads the page's data every few seconds while it's showing (a reply on its way, a payment being confirmed). */
export default function AutoRefresh({ every = 5000 }: { every?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') router.refresh();
    }, every);
    return () => window.clearInterval(id);
  }, [router, every]);
  return null;
}
