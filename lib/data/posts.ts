import { cache } from 'react';
import { hasDatabase, sql } from '@/lib/db';

export type PostKind = 'article' | 'blog' | 'news';

export interface Post {
  id: string;
  kind: PostKind;
  slug: string;
  legacy_id: string | null;
  title: string;
  excerpt: string;
  body: string;
  category: string | null;
  cover_image: string | null;
  author: string;
  status: 'draft' | 'published';
  published_at: Date;
  updated_at: Date;
  seo_title: string | null;
  seo_description: string | null;
}

export type PostSummary = Pick<Post, 'id' | 'kind' | 'slug' | 'title' | 'excerpt' | 'category' | 'cover_image' | 'published_at' | 'updated_at'>;

export const POST_PATH: Record<PostKind, string> = { article: '/articles', blog: '/blog', news: '/news' };
export const KIND_LABEL: Record<PostKind, string> = { article: 'Article', blog: 'Blog', news: 'News' };
export const postUrl = (p: Pick<Post, 'kind' | 'slug'>) => `${POST_PATH[p.kind]}/${p.slug}`;

const SUMMARY = 'id, kind, slug, title, excerpt, category, cover_image, published_at, updated_at';

/** Published posts, newest first. Returns [] if the database is unreachable (pages still render). */
export async function listPosts(kind?: PostKind, limit = 60): Promise<PostSummary[]> {
  if (!hasDatabase()) return [];
  try {
    return await sql<PostSummary>(
      `SELECT ${SUMMARY} FROM web.posts
       WHERE status = 'published' AND published_at <= now() AND ($1::text IS NULL OR kind = $1)
       ORDER BY published_at DESC LIMIT $2`,
      [kind ?? null, limit]
    );
  } catch (err) {
    console.error('listPosts failed:', (err as Error).message);
    return [];
  }
}

/** A published post by slug. (Old JSON-CMS ids are redirected in next.config.js.) */
export const getPost = cache(async (kind: PostKind, slug: string): Promise<Post | null> => {
  if (!hasDatabase()) return null;
  try {
    const rows = await sql<Post>(
      `SELECT * FROM web.posts
       WHERE kind = $1 AND status = 'published' AND published_at <= now() AND slug = $2
       LIMIT 1`,
      [kind, slug]
    );
    return rows[0] ?? null;
  } catch (err) {
    console.error('getPost failed:', (err as Error).message);
    return null;
  }
});

// Posts are written in the admin app (hitroo_admin_page), which calls /api/revalidate after each change.

export const readingMinutes = (body: string) => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));
