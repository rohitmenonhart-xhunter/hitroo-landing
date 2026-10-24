import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import Glass from '@/components/warm/Glass';
import PageIntro from '@/components/warm/PageIntro';
import PostGrid from '@/components/warm/PostGrid';
import { Caption, H_M, P, TEXT_LINK, WContainer } from '@/components/warm/ui';
import { listPosts } from '@/lib/data/posts';
import { getContent } from '@/lib/content';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const revalidate = 300;

const DESCRIPTION = 'HITROO newsroom: company news and announcements, press contact and brand kit.';
export const metadata = pageMetadata({ title: 'Newsroom', description: DESCRIPTION, path: '/news' });

export default async function NewsPage() {
  const [news, COMPANY] = await Promise.all([listPosts('news'), getContent('company')]);
  return (
    <>
      <JsonLd data={webPageLd('CollectionPage', 'Newsroom', '/news', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Newsroom', path: '/news' }])} />
      <PageIntro word="news" caption="Newsroom" title="News from HITROO." lede="Company news and announcements." />

      <WContainer className="pb-20 lg:pb-28">
        <PostGrid posts={news} empty="News is on the way." />
      </WContainer>

      <section aria-labelledby="press-title" className="pb-20 lg:pb-28">
        <WContainer>
          <div className="glass-warm grid gap-10 rounded-[32px] p-8 sm:p-12 lg:grid-cols-[1fr_1fr_auto] lg:items-end lg:p-16">
            <div>
              <Caption>Press</Caption>
              <h2 id="press-title" className={cn(H_M, 'mt-6')}>
                Writing about us?
              </h2>
              <p className={cn(P, 'mt-4')}>
                Email{' '}
                <a href={`mailto:${COMPANY.email}`} className="text-char underline decoration-char/30 underline-offset-4 hover:decoration-char">
                  {COMPANY.email}
                </a>
                . We reply within a day.
              </p>
            </div>
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-stone">About HITROO</p>
              <p className="mt-3 text-[16px] font-medium leading-relaxed text-char/75">{COMPANY.about}</p>
              <Link href="/brand" className={cn(TEXT_LINK, 'mt-6')}>
                Brand kit
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <Glass name="hi" className="hidden h-[200px] w-auto lg:block" />
          </div>
        </WContainer>
      </section>
    </>
  );
}
