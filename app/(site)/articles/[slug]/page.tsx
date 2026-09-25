import PostPage, { postMetadata } from '@/components/corporate/PostPage';
import { listPosts } from '@/lib/data/posts';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await listPosts('article', 200)).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return postMetadata('article', params.slug);
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return <PostPage kind="article" slug={params.slug} />;
}
