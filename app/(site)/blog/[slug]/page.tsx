import PostPage, { postMetadata } from '@/components/corporate/PostPage';
import { listPosts } from '@/lib/data/posts';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await listPosts('blog', 200)).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return postMetadata('blog', params.slug);
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <PostPage kind="blog" slug={params.slug} />;
}
