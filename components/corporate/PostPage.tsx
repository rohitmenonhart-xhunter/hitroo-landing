import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import CoverImage from './CoverImage';
import CtaBand from './CtaBand';
import PostBody from './PostBody';
import { formatDate } from './PostList';
import { Container, Eyebrow } from './ui';
import { getPost, POST_PATH, postUrl, readingMinutes, type PostKind } from '@/lib/data/posts';
import { articleLd, breadcrumbLd, pageMetadata } from '@/lib/seo';

const SECTION: Record<PostKind, string> = { article: 'Articles', blog: 'Blog' };

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

/** One article or blog post: title, meta, optional cover, body, then the closing call to action. */
export default async function PostPage({ kind, slug }: { kind: PostKind; slug: string }) {
  const post = await getPost(kind, slug);
  if (!post) notFound();

  const path = postUrl(post);
  return (
    <>
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
        })}
      />
      <JsonLd data={breadcrumbLd([{ name: 'Insights', path: '/insights' }, { name: SECTION[kind], path: POST_PATH[kind] }, { name: post.title, path }])} />
      <article>
        <Container className="pb-8 pt-16 sm:pt-24 lg:pt-32">
          <div className="mx-auto max-w-3xl">
            <Link href={POST_PATH[kind]} className="inline-flex items-center gap-2 text-[14px] font-medium text-cobalt hover:text-cobalt-dark">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {SECTION[kind]}
            </Link>
            {post.category && <Eyebrow className="mt-10">{post.category}</Eyebrow>}
            <h1 className="mt-5 text-[38px] font-light leading-[1.08] tracking-[-0.035em] text-ink [text-wrap:balance] sm:text-[50px] lg:text-[58px]">{post.title}</h1>
            <p className="mt-6 text-[15px] text-slate-500">
              {[post.author, formatDate(post.published_at), `${readingMinutes(post.body)} min read`].join(' · ')}
            </p>
          </div>
          {post.cover_image && (
            <div className="relative mx-auto mt-14 aspect-[16/9] max-w-5xl overflow-hidden rounded-md bg-mist lg:mt-20">
              <CoverImage src={post.cover_image} alt="" priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
            </div>
          )}
          <div className="mx-auto mt-14 max-w-3xl lg:mt-20">
            {post.excerpt && !post.body.trim().startsWith(post.excerpt.trim()) && (
              <p className="mb-10 text-[22px] font-light leading-relaxed tracking-[-0.01em] text-ink">{post.excerpt}</p>
            )}
            <PostBody body={post.body} />
          </div>
        </Container>
      </article>
      <CtaBand />
    </>
  );
}
