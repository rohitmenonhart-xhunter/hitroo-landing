import { MetadataRoute } from 'next';
import { services } from '@/lib/site-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://hitroo.com';
    const now = new Date();

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
        priority: 0.7,
    }));

    return [...staticRoutes, ...serviceRoutes];
}
