import JsonLd from '@/components/seo/JsonLd';
import PageIntro from '@/components/warm/PageIntro';
import PostGrid from '@/components/warm/PostGrid';
import { WContainer } from '@/components/warm/ui';
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
      <PageIntro word="articles" caption="Insights" title="Articles" lede="In-depth thinking on software, AI and running a business on technology." />
      <WContainer className="pb-20 lg:pb-28">
        <PostGrid posts={posts} />
      </WContainer>
    </>
  );
}
