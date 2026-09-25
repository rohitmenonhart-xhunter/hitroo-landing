import CtaBand from '@/components/corporate/CtaBand';
import PageHero from '@/components/corporate/PageHero';
import PostList from '@/components/corporate/PostList';
import { ArrowLink, Section, SectionHeader } from '@/components/corporate/ui';
import JsonLd from '@/components/seo/JsonLd';
import { listPosts } from '@/lib/data/posts';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

export const revalidate = 300;

const DESCRIPTION = 'Articles and news from HITROO on what’s changing in software, AI, automation and business around the world.';
export const metadata = pageMetadata({ title: 'Insights', description: DESCRIPTION, path: '/insights' });

export default async function InsightsPage() {
  const [articles, blog] = await Promise.all([listPosts('article', 4), listPosts('blog', 4)]);
  return (
    <>
      <JsonLd data={webPageLd('CollectionPage', 'Insights', '/insights', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Insights', path: '/insights' }])} />
      <PageHero eyebrow="Insights" title="What’s changing in software, AI and business." lede="Articles and news from the HITROO team." />

      <Section labelledBy="articles-title">
        <SectionHeader id="articles-title" title="Articles" action={<ArrowLink href="/articles">All articles</ArrowLink>} />
        <div className="mt-14 lg:mt-20">
          <PostList posts={articles} />
        </div>
      </Section>

      <Section labelledBy="blog-title">
        <SectionHeader id="blog-title" title="Blog" action={<ArrowLink href="/blog">All posts</ArrowLink>} />
        <div className="mt-14 lg:mt-20">
          <PostList posts={blog} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
