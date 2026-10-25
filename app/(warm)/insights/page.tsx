import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import ClosingCta from '@/components/warm/ClosingCta';
import PageIntro from '@/components/warm/PageIntro';
import PostGrid from '@/components/warm/PostGrid';
import { LinkCards, TEXT_LINK, WSection } from '@/components/warm/ui';
import { listPosts } from '@/lib/data/posts';
import { getContent } from '@/lib/content';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const revalidate = 300;

const DESCRIPTION = 'Articles and news from hitroo on what’s changing in software, AI, automation and business around the world.';
export const metadata = pageMetadata({ title: 'Insights', description: DESCRIPTION, path: '/insights' });

function AllLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className={cn(TEXT_LINK, 'mt-10')}>
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}

export default async function InsightsPage() {
  const [articles, blog, news, DIVISIONS] = await Promise.all([listPosts('article', 3), listPosts('blog', 6), listPosts('news', 3), getContent('divisions')]);
  return (
    <>
      <JsonLd data={webPageLd('CollectionPage', 'Insights', '/insights', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Insights', path: '/insights' }])} />
      <PageIntro word="insights" caption="Insights" title="What’s changing in software, AI and business." lede="Articles and news from the hitroo team." />

      <WSection id="articles-title" caption="Articles" title="In-depth reads." lede="Longer pieces for when you’re planning something big.">
        <PostGrid posts={articles} />
        <AllLink href="/articles">All articles</AllLink>
      </WSection>

      <WSection id="blog-title" caption="Blog" title="Quick takes." lede="What’s changing in technology, and what it means for your business.">
        <PostGrid posts={blog} />
        <AllLink href="/blog">All posts</AllLink>
      </WSection>

      {news.length > 0 && (
        <WSection id="news-title" caption="Newsroom" title="News from hitroo." lede="Company news and announcements.">
          <PostGrid posts={news} />
          <AllLink href="/news">All news</AllLink>
        </WSection>
      )}

      <WSection id="topics-title" caption="Explore by division" title="Read about what you need.">
        <LinkCards items={DIVISIONS.map((d) => ({ href: `/${d.slug}`, title: d.name, text: d.line }))} />
      </WSection>

      <ClosingCta title="Have a question we haven’t written about?" line="Ask us directly. We reply within a day." />
    </>
  );
}
