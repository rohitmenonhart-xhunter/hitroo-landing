import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createPost, deletePost, listAllPosts, postUrl, slugify, updatePost, type PostInput } from '@/lib/data/posts';
import { readLimitedJson } from '@/lib/request-security';
import { noStore, requireAdmin } from '../auth';

const input = z
  .object({
    kind: z.enum(['article', 'blog']),
    title: z.string().trim().min(1).max(200),
    slug: z.string().trim().max(90).optional().default(''),
    excerpt: z.string().trim().max(400).optional().default(''),
    body: z.string().max(60_000).optional().default(''),
    category: z.string().trim().max(60).optional().default(''),
    cover_image: z.string().trim().max(500).optional().default(''),
    status: z.enum(['draft', 'published']).optional().default('published'),
    published_at: z.string().trim().max(40).optional().default(''),
    seo_title: z.string().trim().max(120).optional().default(''),
    seo_description: z.string().trim().max(200).optional().default(''),
  })
  .strict();

function toInput(d: z.infer<typeof input>): PostInput {
  const slug = slugify(d.slug || d.title);
  return {
    kind: d.kind,
    slug,
    title: d.title,
    excerpt: d.excerpt || d.body.split('\n').map((l) => l.trim()).find(Boolean)?.slice(0, 220) || '',
    body: d.body,
    category: d.category || null,
    cover_image: d.cover_image || null,
    status: d.status,
    published_at: d.published_at || null,
    seo_title: d.seo_title || null,
    seo_description: d.seo_description || null,
  };
}

function refresh(p: { kind: 'article' | 'blog'; slug: string }) {
  for (const path of ['/insights', '/articles', '/blog', postUrl(p), '/sitemap.xml', '/llms.txt']) revalidatePath(path);
}

async function body(request: NextRequest) {
  try {
    return await readLimitedJson(request, 128 * 1024);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  return NextResponse.json({ posts: await listAllPosts() }, noStore);
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const parsed = input.safeParse(await body(request));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid post' }, { status: 400 });
  const post = toInput(parsed.data);
  if (!post.slug) return NextResponse.json({ error: 'The title needs letters or numbers' }, { status: 400 });
  try {
    const id = await createPost(post);
    refresh(post);
    return NextResponse.json({ id, slug: post.slug }, noStore);
  } catch (err) {
    const dup = (err as { code?: string }).code === '23505';
    return NextResponse.json({ error: dup ? 'A post with that slug already exists' : 'Could not save the post' }, { status: dup ? 409 : 500 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const raw = (await body(request)) as { id?: unknown } | null;
  const id = z.string().uuid().safeParse(raw?.id);
  if (!id.success || !raw) return NextResponse.json({ error: 'Missing post id' }, { status: 400 });
  const { id: _omit, ...rest } = raw as Record<string, unknown>;
  void _omit;
  const parsed = input.safeParse(rest);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid post' }, { status: 400 });
  const post = toInput(parsed.data);
  try {
    await updatePost(id.data, post);
    refresh(post);
    return NextResponse.json({ ok: true }, noStore);
  } catch (err) {
    const dup = (err as { code?: string }).code === '23505';
    return NextResponse.json({ error: dup ? 'A post with that slug already exists' : 'Could not update the post' }, { status: dup ? 409 : 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const id = z.string().uuid().safeParse(request.nextUrl.searchParams.get('id'));
  if (!id.success) return NextResponse.json({ error: 'Missing post id' }, { status: 400 });
  await deletePost(id.data);
  for (const path of ['/insights', '/articles', '/blog', '/sitemap.xml', '/llms.txt']) revalidatePath(path);
  return NextResponse.json({ ok: true }, noStore);
}
