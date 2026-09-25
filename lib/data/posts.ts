import { cache } from 'react';
import { hasDatabase, sql } from '@/lib/db';

export type PostKind = 'article' | 'blog';

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

export const POST_PATH: Record<PostKind, string> = { article: '/articles', blog: '/blog' };
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

/* ---------------- admin ---------------- */

export async function listAllPosts(): Promise<Post[]> {
  return sql<Post>('SELECT * FROM web.posts ORDER BY published_at DESC');
}

export interface PostInput {
  kind: PostKind;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string | null;
  cover_image: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

export async function createPost(p: PostInput) {
  const rows = await sql<{ id: string }>(
    `INSERT INTO web.posts (kind, slug, title, excerpt, body, category, cover_image, status, published_at, seo_title, seo_description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9::timestamptz, now()), $10, $11) RETURNING id`,
    [p.kind, p.slug, p.title, p.excerpt, p.body, p.category, p.cover_image, p.status, p.published_at, p.seo_title, p.seo_description]
  );
  return rows[0].id;
}

export async function updatePost(id: string, p: PostInput) {
  await sql(
    `UPDATE web.posts SET kind = $2, slug = $3, title = $4, excerpt = $5, body = $6, category = $7, cover_image = $8,
       status = $9, published_at = COALESCE($10::timestamptz, published_at), seo_title = $11, seo_description = $12, updated_at = now()
     WHERE id = $1`,
    [id, p.kind, p.slug, p.title, p.excerpt, p.body, p.category, p.cover_image, p.status, p.published_at, p.seo_title, p.seo_description]
  );
}

export async function deletePost(id: string) {
  await sql('DELETE FROM web.posts WHERE id = $1', [id]);
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);

export const readingMinutes = (body: string) => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));
