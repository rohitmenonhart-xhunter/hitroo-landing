import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/** Search and AI answer engines are welcome everywhere except the admin and API. */
const AI_AND_SEARCH_BOTS = [
  'Googlebot',
  'Bingbot',
  'DuckDuckBot',
  'Applebot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'DuckAssistBot',
  'MistralAI-User',
  'cohere-ai',
  'Amazonbot',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin', '/api/'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: AI_AND_SEARCH_BOTS, allow: '/', disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
