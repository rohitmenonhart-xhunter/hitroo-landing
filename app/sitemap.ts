import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { services } from '@/lib/site-data';

const baseUrl = 'https://hitroo.com';

function getContent(): { articles: { id: string }[]; news: { id: string }[] } {
    try {
        const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'content.json'), 'utf-8');
        const data = JSON.parse(raw);
        return { articles: data.articles || [], news: data.news || [] };
    } catch {
        return { articles: [], news: [] };
    }
}

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const { articles, news } = getContent();

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
        { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/support`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/research`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ];

    const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
        url: `${baseUrl}/articles/${a.id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
    }));

    const newsRoutes: MetadataRoute.Sitemap = news.map((n) => ({
        url: `${baseUrl}/news/${n.id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
    }));

    return [...staticRoutes, ...serviceRoutes, ...articleRoutes, ...newsRoutes];
}
