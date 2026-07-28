import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import {
    isSameOrigin,
    PayloadTooLargeError,
    readLimitedJson,
} from '@/lib/request-security';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

interface Article {
    id: string;
    title: string;
    body: string;
    category: string;
    date: string;
    createdAt: string;
}

interface NewsItem {
    id: string;
    title: string;
    body: string;
    date: string;
    highlight: boolean;
    createdAt: string;
}

interface ContentData {
    articles: Article[];
    news: NewsItem[];
}

function readData(): ContentData {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return { articles: [], news: [] };
    }
}

function writeData(data: ContentData): void {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function passwordMatches(candidate: string) {
    const configured = process.env.ADMIN_PASSWORD;
    if (!configured) return false;
    const actual = Buffer.from(configured);
    const provided = Buffer.from(candidate);
    return actual.length === provided.length && timingSafeEqual(actual, provided);
}

async function readMutationBody(request: NextRequest) {
    if (!request.headers.get('content-type')?.includes('application/json')) {
        return { error: NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 }) };
    }
    if (!isSameOrigin(request)) {
        return { error: NextResponse.json({ error: 'Cross-origin submissions are not allowed' }, { status: 403 }) };
    }
    try {
        return { data: await readLimitedJson(request, 64 * 1024) };
    } catch (error) {
        return {
            error: NextResponse.json(
                { error: error instanceof PayloadTooLargeError ? 'Request is too large' : 'Invalid JSON body' },
                { status: error instanceof PayloadTooLargeError ? 413 : 400 }
            ),
        };
    }
}

// GET - Fetch all content (public)
export async function GET() {
    const data = readData();
    return NextResponse.json(data, {
        headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
    });
}

// POST - Add new content (protected)
export async function POST(request: NextRequest) {
    try {
        const body = await readMutationBody(request);
        if (body.error) return body.error;
        const parsed = z.object({
            password: z.string().max(200),
            type: z.enum(['test', 'article', 'news']),
            item: z.record(z.unknown()).optional().default({}),
        }).strict().safeParse(body.data);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid content request' }, { status: 400 });
        }
        const { password, type, item } = parsed.data;

        // Verify password
        if (!passwordMatches(password)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (type === 'test') {
            return NextResponse.json({ success: true });
        }

        const data = readData();
        const id = Date.now().toString();

        if (type === 'article') {
            const article = z.object({
                title: z.string().trim().min(1).max(200),
                body: z.string().max(20_000).optional().default(''),
                category: z.enum(['Technology', 'Engineering', 'Insights', 'Product', 'Company']),
                date: z.string().trim().max(30).optional(),
            }).strict().safeParse(item);
            if (!article.success) {
                return NextResponse.json({ error: 'Invalid article' }, { status: 400 });
            }
            data.articles.unshift({
                id,
                title: article.data.title,
                body: article.data.body,
                category: article.data.category,
                date: article.data.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                createdAt: new Date().toISOString(),
            });
        } else if (type === 'news') {
            const newsItem = z.object({
                title: z.string().trim().min(1).max(200),
                body: z.string().max(20_000).optional().default(''),
                date: z.string().trim().max(30).optional(),
                highlight: z.boolean().optional().default(false),
            }).strict().safeParse(item);
            if (!newsItem.success) {
                return NextResponse.json({ error: 'Invalid news item' }, { status: 400 });
            }
            // Remove highlight from existing items when adding a new highlighted one
            if (newsItem.data.highlight) {
                data.news = data.news.map(n => ({ ...n, highlight: false }));
            }
            data.news.unshift({
                id,
                title: newsItem.data.title,
                body: newsItem.data.body,
                date: newsItem.data.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                highlight: newsItem.data.highlight,
                createdAt: new Date().toISOString(),
            });
        }

        writeData(data);
        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('Content API error:', error);
        return NextResponse.json({ error: 'Failed to add content' }, { status: 500 });
    }
}

// DELETE - Remove content (protected)
export async function DELETE(request: NextRequest) {
    try {
        const body = await readMutationBody(request);
        if (body.error) return body.error;
        const parsed = z.object({
            password: z.string().max(200),
            type: z.enum(['article', 'news']),
            id: z.string().min(1).max(100),
        }).strict().safeParse(body.data);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid delete request' }, { status: 400 });
        }
        const { password, type, id } = parsed.data;

        // Verify password
        if (!passwordMatches(password)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = readData();

        if (type === 'article') {
            data.articles = data.articles.filter(a => a.id !== id);
        } else if (type === 'news') {
            data.news = data.news.filter(n => n.id !== id);
        }

        writeData(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Content API error:', error);
        return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
    }
}
