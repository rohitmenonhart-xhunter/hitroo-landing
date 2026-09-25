'use client';

/** Re-opens the cookie choice (footer link). */
export default function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event('hitroo:cookie-settings'))}>
      Cookie settings
    </button>
  );
}
