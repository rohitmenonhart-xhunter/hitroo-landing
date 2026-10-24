import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import CoverImage from '@/components/corporate/CoverImage';
import PostBody from '@/components/corporate/PostBody';
import { getPost, POST_PATH, postUrl, readingMinutes, type PostKind } from '@/lib/data/posts';
import { getContent } from '@/lib/content';
import { postFaq } from '@/lib/faq';
import { articleLd, breadcrumbLd, faqLd, pageMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import ClosingCta from './ClosingCta';
import { Caption, H_PAGE, WContainer } from './ui';

const SECTION: Record<PostKind, string> = { article: 'Articles', blog: 'Blog', news: 'Newsroom' };

export async function postMetadata(kind: PostKind, slug: string): Promise<Metadata> {
  const post = await getPost(kind, slug);
  if (!post) return { title: 'Not found', robots: { index: false } };
  return {
    ...pageMetadata({
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || post.title,
      path: postUrl(post),
      type: 'article',
      image: post.cover_image,
    }),
    authors: [{ name: post.author }],
  };
}

/** One article, blog post or news item: back link, title, meta, optional cover, body, then the closing call to action. */
export default async function PostPage({ kind, slug }: { kind: PostKind; slug: string }) {
  const [post, COMPANY] = await Promise.all([getPost(kind, slug), getContent('company')]);
  if (!post) notFound();

  const path = postUrl(post);
  const faq = postFaq(post.body);
  return (
    <>
      {faq.length > 0 && <JsonLd data={faqLd(faq)} />}
      <JsonLd
        data={articleLd({
          kind,
          title: post.title,
          description: post.seo_description || post.excerpt || post.title,
          path,
          image: post.cover_image,
          published: new Date(post.published_at),
          modified: new Date(post.updated_at),
          author: post.author,
          category: post.category,
          words: post.body.split(/\s+/).filter(Boolean).length,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          ...(kind === 'news' ? [] : [{ name: 'Insights', path: '/insights' }]),
          { name: SECTION[kind], path: POST_PATH[kind] },
          { name: post.title, path },
        ])}
      />
      <article>
        <WContainer className="pb-20 pt-8 lg:pb-28 lg:pt-14">
          <div className="mx-auto max-w-[900px]">
            <Link
              href={POST_PATH[kind]}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[15px] font-medium text-char ring-1 ring-char/10 transition-colors hover:bg-[#FFF8F5]"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {SECTION[kind]}
            </Link>
            {post.category && <Caption className="mt-10">{post.category}</Caption>}
            <h1 className={`${H_PAGE} mt-6`}>{post.title}</h1>
            <p className="mt-7 text-[15px] font-medium text-stone">{[post.author, formatDate(post.published_at), `${readingMinutes(post.body)} min read`].join(' · ')}</p>
          </div>
          {post.cover_image && (
            <div className="relative mx-auto mt-12 aspect-[16/9] max-w-[1200px] overflow-hidden rounded-[32px] bg-sand lg:mt-16">
              <CoverImage src={post.cover_image} alt="" priority sizes="(min-width: 1280px) 1200px, 100vw" className="duotone-warm object-cover" />
            </div>
          )}
          <div data-article className="mx-auto mt-12 max-w-[760px] lg:mt-16">
            {post.excerpt && !post.body.trim().startsWith(post.excerpt.trim()) && (
              <p className="mb-10 font-display text-[24px] font-bold leading-snug tracking-[-0.025em] text-char">{post.excerpt}</p>
            )}
            <PostBody body={post.body} />
            {kind === 'news' && (
              <div className="glass-warm mt-16 rounded-[24px] p-7 text-[16px] font-medium leading-relaxed text-char/75 sm:p-8">
                <p className="text-[13px] uppercase tracking-[0.06em] text-char">About HITROO</p>
                <p className="mt-3">{COMPANY.about}</p>
                <p className="mt-4">
                  Press:{' '}
                  <a href={`mailto:${COMPANY.email}`} className="text-char underline decoration-char/30 underline-offset-4 hover:decoration-char">
                    {COMPANY.email}
                  </a>
                </p>
              </div>
            )}
          </div>
        </WContainer>
      </article>
      <ClosingCta title="Let’s talk about your project." line="Tell us what you need. We reply within a day." />
    </>
  );
}
