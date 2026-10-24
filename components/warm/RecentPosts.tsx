import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { postUrl, type PostSummary } from '@/lib/data/posts';
import { formatDate } from '@/lib/utils';
import { Caption, H_M, TEXT_LINK, Tight, WContainer } from './ui';

/** Recent posts as a list: heading and "All insights" left, date and title rows right. */
export default function RecentPosts({ posts, title = 'Recent articles' }: { posts: PostSummary[]; title?: string }) {
  if (!posts.length) return null;
  return (
    <section aria-labelledby="writing-title" className="pb-20 lg:pb-28">
      <WContainer className="grid gap-10 md:grid-cols-[1fr_2.4fr] md:gap-16">
        <div>
          <Caption>Insights</Caption>
          <h2 id="writing-title" className={`${H_M} mt-6`}>
            {title}
          </h2>
          <Link href="/insights" className={`${TEXT_LINK} mt-6`}>
            All insights
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <ul className="border-t border-char/10">
          {posts.map((p) => (
            <li key={p.id} className="border-b border-char/10">
              <Link href={postUrl(p)} className="group grid gap-2 py-6 sm:grid-cols-[150px_1fr_auto] sm:items-baseline sm:gap-6">
                <span className="text-[14px] font-medium text-stone">{formatDate(p.published_at)}</span>
                <span className="font-display text-[20px] font-bold leading-snug tracking-[-0.03em] text-char group-hover:text-ember sm:text-[24px]">
                  <Tight>{p.title}</Tight>
                </span>
                <ArrowUpRight aria-hidden="true" className="hidden h-5 w-5 text-stone group-hover:text-ember sm:block" />
              </Link>
            </li>
          ))}
        </ul>
      </WContainer>
    </section>
  );
}
