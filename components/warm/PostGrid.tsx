import Link from 'next/link';
import CoverImage from '@/components/corporate/CoverImage';
import { KIND_LABEL, postUrl, type PostSummary } from '@/lib/data/posts';
import { formatDate } from '@/lib/utils';
import Glass from './Glass';

/** Posts as equal white cards: cover (or the glass "hi" on sand), meta line, title, excerpt. */
export default function PostGrid({ posts, empty = 'New posts are on the way.' }: { posts: PostSummary[]; empty?: string }) {
  if (!posts.length) return <p className="text-[18px] font-medium text-stone">{empty}</p>;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {posts.map((p) => (
        <li key={p.id}>
          <Link href={postUrl(p)} className="group flex h-full flex-col rounded-[28px] bg-white p-5 ring-1 ring-char/5 transition-colors hover:ring-char/20 sm:p-6">
            <span className="relative block aspect-[16/10] overflow-hidden rounded-[20px] bg-sand">
              {p.cover_image ? (
                <CoverImage src={p.cover_image} sizes="(min-width: 1280px) 420px, (min-width: 640px) 50vw, 100vw" className="duotone-warm object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Glass name="hi" className="h-[46%] w-auto" />
                </span>
              )}
            </span>
            <span className="mt-6 block text-[14px] font-medium text-stone">{[KIND_LABEL[p.kind], p.category, formatDate(p.published_at)].filter(Boolean).join(' · ')}</span>
            <span className="mt-2 block font-display text-[clamp(21px,1.7vw,25px)] font-bold leading-[1.15] tracking-[-0.03em] text-char [text-wrap:balance] group-hover:text-ember">
              {p.title}
            </span>
            {p.excerpt && <span className="mt-2 line-clamp-2 block text-[15px] font-medium leading-relaxed text-char/70">{p.excerpt}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
