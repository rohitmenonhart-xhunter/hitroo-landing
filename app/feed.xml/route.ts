import { KIND_LABEL, listPosts, postUrl } from '@/lib/data/posts';
import { abs, SITE_URL } from '@/lib/seo';

// Refreshes on its own every 10 minutes (revalidatePath doesn't reach route handlers in Next 13.5).
export const revalidate = 600;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** /feed.xml — RSS 2.0 of the latest news, articles and blog posts, for readers, aggregators and AI crawlers. */
export async function GET() {
  const posts = await listPosts(undefined, 50);
  const items = posts
    .map((p) => {
      const url = abs(postUrl(p));
      return [
        '<item>',
        `<title>${esc(p.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${new Date(p.published_at).toUTCString()}</pubDate>`,
        `<category>${esc(KIND_LABEL[p.kind])}</category>`,
        p.category ? `<category>${esc(p.category)}</category>` : '',
        p.excerpt ? `<description>${esc(p.excerpt)}</description>` : '',
        '</item>',
      ].join('');
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>HITROO — news, articles and blog</title>
<link>${SITE_URL}</link>
<description>Custom software, automation and AI for business: news and insights from HITROO.</description>
<language>en</language>
<atom:link href="${abs('/feed.xml')}" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' } });
}
