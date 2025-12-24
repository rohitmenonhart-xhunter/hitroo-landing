import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

// GET - Fetch all content (public)
export async function GET() {
    const data = readData();
    return NextResponse.json(data);
}

// POST - Add new content (protected)
export async function POST(request: NextRequest) {
    try {
        const { password, type, item } = await request.json();

        // Verify password
        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = readData();
        const id = Date.now().toString();

        if (type === 'article') {
            data.articles.unshift({
                id,
                title: item.title,
                body: item.body || '',
                category: item.category,
                date: item.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                createdAt: new Date().toISOString(),
            });
        } else if (type === 'news') {
            // Remove highlight from existing items when adding a new highlighted one
            if (item.highlight) {
                data.news = data.news.map(n => ({ ...n, highlight: false }));
            }
            data.news.unshift({
                id,
                title: item.title,
                body: item.body || '',
                date: item.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                highlight: item.highlight || false,
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
        const { password, type, id } = await request.json();

        // Verify password
        if (password !== process.env.ADMIN_PASSWORD) {
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
