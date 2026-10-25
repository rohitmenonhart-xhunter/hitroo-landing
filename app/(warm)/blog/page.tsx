import JsonLd from '@/components/seo/JsonLd';
import PageIntro from '@/components/warm/PageIntro';
import PostGrid from '@/components/warm/PostGrid';
import { WContainer } from '@/components/warm/ui';
import { listPosts } from '@/lib/data/posts';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

export const revalidate = 300;

const DESCRIPTION = 'The hitroo blog: news and quick takes on what’s happening across the world of software, AI and business.';
export const metadata = pageMetadata({ title: 'Blog', description: DESCRIPTION, path: '/blog' });

export default async function BlogPage() {
  const posts = await listPosts('blog');
  return (
    <>
      <JsonLd data={webPageLd('CollectionPage', 'Blog', '/blog', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Insights', path: '/insights' }, { name: 'Blog', path: '/blog' }])} />
      <PageIntro word="blog" caption="Insights" title="Blog" lede="News and quick takes on what’s happening across the world of technology." />
      <WContainer className="pb-20 lg:pb-28">
        <PostGrid posts={posts} />
      </WContainer>
    </>
  );
}
