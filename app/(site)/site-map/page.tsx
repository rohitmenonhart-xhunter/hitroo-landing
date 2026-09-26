import Link from 'next/link';
import PageHero from '@/components/corporate/PageHero';
import { Section } from '@/components/corporate/ui';
import JsonLd from '@/components/seo/JsonLd';
import { KIND_LABEL, listPosts, postUrl } from '@/lib/data/posts';
import { services } from '@/lib/site-data';
import { breadcrumbLd, pageMetadata, webPageLd } from '@/lib/seo';

export const revalidate = 300;

const DESCRIPTION = 'Every page on the HITROO website in one place.';
export const metadata = pageMetadata({ title: 'Site map', description: DESCRIPTION, path: '/site-map' });

const GROUPS: { title: string; links: [string, string][] }[] = [
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
  { title: 'Services', links: [['/services', 'All services'], ...services.map((s): [string, string] => [`/services/${s.slug}`, s.label])] },
  {
    title: 'Resources',
    links: [
      ['/insights', 'Insights'],
      ['/blog', 'Blog'],
      ['/articles', 'Articles'],
      ['/research', 'Research'],
      ['/ai-perspective', 'Our view on AI'],
      ['/support', 'Support app'],
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

const LINK = 'text-[16px] text-slate-600 transition-colors hover:text-cobalt';

export default async function SiteMapPage() {
  const posts = await listPosts(undefined, 12);
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Site map', '/site-map', DESCRIPTION)} />
      <JsonLd data={breadcrumbLd([{ name: 'Site map', path: '/site-map' }])} />
      <PageHero eyebrow="Site map" title="Every page, in one place." />
      <Section labelledBy="page-title" className="pt-12 lg:pt-20">
        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {GROUPS.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2 className="text-[17px] font-medium tracking-[-0.01em] text-ink">{g.title}</h2>
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
          <nav aria-label="Latest posts" className="mt-20">
            <h2 className="text-[17px] font-medium tracking-[-0.01em] text-ink">Latest posts</h2>
            <ul className="mt-5 grid gap-3 md:grid-cols-2 md:gap-x-10">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link href={postUrl(p)} className={LINK}>
                    <span className="text-slate-400">{KIND_LABEL[p.kind]} · </span>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Section>
    </>
  );
}
