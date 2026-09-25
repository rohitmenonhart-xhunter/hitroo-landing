import JsonLd from '@/components/seo/JsonLd';
import PageHero from '@/components/corporate/PageHero';
import PostList from '@/components/corporate/PostList';
import { Section } from '@/components/corporate/ui';
import { listPosts } from '@/lib/data/posts';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

export const revalidate = 300;

const DESCRIPTION = 'In-depth articles from HITROO on software, AI, automation and running a business on technology.';
export const metadata = pageMetadata({ title: 'Articles', description: DESCRIPTION, path: '/articles' });

export default async function ArticlesPage() {
  const posts = await listPosts('article');
  return (
    <>
      <JsonLd data={webPageLd('CollectionPage', 'Articles', '/articles', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Insights', path: '/insights' }, { name: 'Articles', path: '/articles' }])} />
      <PageHero eyebrow="Insights" title="Articles" lede="In-depth thinking on software, AI and running a business on technology." />
      <Section labelledBy="page-title" className="pt-12 lg:pt-20">
        <PostList posts={posts} />
      </Section>
    </>
  );
}
