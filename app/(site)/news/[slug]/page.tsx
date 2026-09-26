import PostPage, { postMetadata } from '@/components/corporate/PostPage';
import { listPosts } from '@/lib/data/posts';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await listPosts('news', 200)).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return postMetadata('news', params.slug);
}

export default function NewsPostPage({ params }: { params: { slug: string } }) {
  return <PostPage kind="news" slug={params.slug} />;
}
