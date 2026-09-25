import type { MetadataRoute } from 'next';
import { listPosts, postUrl } from '@/lib/data/posts';
import { services } from '@/lib/site-data';
import { abs } from '@/lib/seo';

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') => ({
    url: abs(path),
    lastModified: now,
    changeFrequency,
    priority,
  });
  const posts = await listPosts(undefined, 1000);
  return [
    page('/', 1, 'weekly'),
    page('/services', 0.9),
    ...services.map((s) => page(`/services/${s.slug}`, 0.9)),
    page('/insights', 0.8, 'daily'),
    page('/articles', 0.7, 'daily'),
    page('/blog', 0.7, 'daily'),
    ...posts.map((p) => ({ url: abs(postUrl(p)), lastModified: new Date(p.updated_at), changeFrequency: 'monthly' as const, priority: 0.7 })),
    page('/ai-perspective', 0.7),
    page('/support', 0.7),
    page('/about', 0.7),
    page('/research', 0.6),
    page('/contact', 0.8),
    page('/careers', 0.5),
    page('/privacy', 0.2, 'yearly'),
  ];
}
