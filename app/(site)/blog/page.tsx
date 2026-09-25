import JsonLd from '@/components/seo/JsonLd';
import PageHero from '@/components/corporate/PageHero';
import PostList from '@/components/corporate/PostList';
import { Section } from '@/components/corporate/ui';
import { listPosts } from '@/lib/data/posts';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

export const revalidate = 300;

const DESCRIPTION = 'The HITROO blog: news and quick takes on what’s happening across the world of software, AI and business.';
export const metadata = pageMetadata({ title: 'Blog', description: DESCRIPTION, path: '/blog' });

export default async function BlogPage() {
  const posts = await listPosts('blog');
  return (
    <>
      <JsonLd data={webPageLd('CollectionPage', 'Blog', '/blog', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Insights', path: '/insights' }, { name: 'Blog', path: '/blog' }])} />
      <PageHero eyebrow="Insights" title="Blog" lede="News and quick takes on what’s happening across the world of technology." />
      <Section labelledBy="page-title" className="pt-12 lg:pt-20">
        <PostList posts={posts} />
      </Section>
    </>
  );
}
