import JsonLd from '@/components/seo/JsonLd';
import PageHero from '@/components/corporate/PageHero';
import PostList from '@/components/corporate/PostList';
import { ArrowLink, Eyebrow, Section } from '@/components/corporate/ui';
import { listPosts } from '@/lib/data/posts';
import { COMPANY } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

export const revalidate = 300;

const DESCRIPTION = 'HITROO newsroom: company news and announcements, press contact and brand kit.';
export const metadata = pageMetadata({ title: 'Newsroom', description: DESCRIPTION, path: '/news' });

export default async function NewsPage() {
  const news = await listPosts('news');
  return (
    <>
      <JsonLd data={webPageLd('CollectionPage', 'Newsroom', '/news', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Newsroom', path: '/news' }])} />
      <PageHero eyebrow="Newsroom" title="News from HITROO." lede="Company news and announcements." />

      <Section labelledBy="page-title" className="pt-12 lg:pt-20">
        <PostList posts={news} empty="News is on the way." />
      </Section>

      <Section labelledBy="press-title">
        <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Press</Eyebrow>
            <h2 id="press-title" className="mt-4 text-[32px] font-light leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px]">
              Writing about us?
            </h2>
            <p className="mt-5 text-[18px] leading-relaxed text-slate-600">
              Email{' '}
              <a href={`mailto:${COMPANY.email}`} className="font-medium text-cobalt hover:text-cobalt-dark">
                {COMPANY.email}
              </a>
              . We reply within a day.
            </p>
          </div>
          <div className="md:pt-10">
            <p className="text-[15px] font-medium text-ink">About HITROO</p>
            <p className="mt-2 text-[16px] leading-relaxed text-slate-600">{COMPANY.about}</p>
            <p className="mt-8 text-[18px] leading-relaxed text-slate-600">Logo, colours and type, ready to download.</p>
            <ArrowLink href="/brand" className="mt-5">
              Brand kit
            </ArrowLink>
          </div>
        </div>
      </Section>
    </>
  );
}
