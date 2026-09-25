import CoverImage from './CoverImage';
import Link from 'next/link';
import { postUrl, type PostSummary } from '@/lib/data/posts';

export const formatDate = (d: Date | string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

/** Posts as an open, spacious grid — no cards, no lines. */
export default function PostList({ posts, empty = 'New posts are on the way.' }: { posts: PostSummary[]; empty?: string }) {
  if (!posts.length) return <p className="text-[18px] text-slate-500">{empty}</p>;
  return (
    <ul className="grid gap-x-16 gap-y-16 md:grid-cols-2">
      {posts.map((p) => (
        <li key={p.id}>
          <Link href={postUrl(p)} className="group block">
            {p.cover_image && (
              <div className="relative mb-7 aspect-[16/9] overflow-hidden rounded-md bg-mist">
                <CoverImage src={p.cover_image} sizes="(min-width: 768px) 560px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
            )}
            <p className="text-[13px] font-medium text-slate-500">
              {[p.kind === 'blog' ? 'Blog' : 'Article', p.category, formatDate(p.published_at)].filter(Boolean).join(' · ')}
            </p>
            <h3 className="mt-3 text-[26px] font-light leading-snug tracking-[-0.02em] text-ink [text-wrap:balance] group-hover:text-cobalt">{p.title}</h3>
            {p.excerpt && <p className="mt-3 line-clamp-3 text-[16px] leading-relaxed text-slate-600">{p.excerpt}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
