import Link from 'next/link';
import PageIntro from '@/components/warm/PageIntro';
import { WContainer } from '@/components/warm/ui';
import JsonLd from '@/components/seo/JsonLd';
import { KIND_LABEL, listPosts, postUrl } from '@/lib/data/posts';
import { getContent } from '@/lib/content';
import type { Division, Service } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

export const revalidate = 300;

const DESCRIPTION = 'Every page on the hitroo website in one place.';
export const metadata = pageMetadata({ title: 'Site map', description: DESCRIPTION, path: '/site-map' });

const groups = (DIVISIONS: Division[], services: Service[]): { title: string; links: [string, string][] }[] => [
  {
    title: 'Company',
    links: [
      ['/', 'Home'],
      ['/about', 'About'],
      ['/news', 'Newsroom'],
      ['/brand', 'Brand kit'],
      ['/careers', 'Careers'],
      ['/contact', 'Contact'],
    ],
  },
  { title: 'What we do', links: [['/services', 'All services'], ...DIVISIONS.map((d): [string, string] => [`/${d.slug}`, d.name])] },
  { title: 'Services', links: services.map((s): [string, string] => [`/services/${s.slug}`, s.label]) },
  {
    title: 'Resources',
    links: [
      ['/insights', 'Insights'],
      ['/blog', 'Blog'],
      ['/articles', 'Articles'],
      ['/research', 'Research'],
      ['/ai-perspective', 'Our view on AI'],
      ['/support', 'Support'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['/privacy', 'Privacy policy'],
      ['/cookies', 'Cookie policy'],
      ['/terms', 'Terms of use'],
      ['/accessibility', 'Accessibility'],
      ['/security', 'Security'],
    ],
  },
];

const LINK = 'text-[16px] font-medium text-char/75 transition-colors hover:text-ember';
const HEAD = 'text-[13px] font-medium uppercase tracking-[0.06em] text-stone';

export default async function SiteMapPage() {
  const [posts, divisions, services] = await Promise.all([listPosts(undefined, 12), getContent('divisions'), getContent('services')]);
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Site map', '/site-map', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Site map', path: '/site-map' }])} />
      <PageIntro word="sitemap" caption="Site map" title="Every page, in one place." />
      <WContainer className="pb-20 lg:pb-28">
        <div className="glass-warm grid gap-12 rounded-[32px] p-8 sm:grid-cols-3 sm:p-10 lg:grid-cols-5 lg:p-14">
          {groups(divisions, services).map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2 className={HEAD}>{g.title}</h2>
              <ul className="mt-5 space-y-3">
                {g.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className={LINK}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        {posts.length > 0 && (
          <nav aria-label="Latest posts" className="mt-4 rounded-[32px] bg-white p-8 ring-1 ring-char/5 sm:p-10 lg:p-14">
            <h2 className={HEAD}>Latest posts</h2>
            <ul className="mt-5 grid gap-3 md:grid-cols-2 md:gap-x-10">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link href={postUrl(p)} className={LINK}>
                    <span className="text-stone">{KIND_LABEL[p.kind]} · </span>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </WContainer>
    </>
  );
}
