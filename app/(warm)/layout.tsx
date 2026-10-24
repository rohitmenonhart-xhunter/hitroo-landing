import WarmShell from '@/components/warm/WarmShell';

/**
 * Every marketing page: paper page, Plus Jakarta Sans headlines, Fustat text, set on the root layout. Pages are
 * static and refresh at most every five minutes (sooner when the admin saves content or posts: /api/revalidate),
 * because their copy and the footer come from web.content.
 */
export const revalidate = 300;

export default function WarmLayout({ children }: { children: React.ReactNode }) {
  return <WarmShell>{children}</WarmShell>;
}
