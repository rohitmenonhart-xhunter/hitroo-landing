'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';

interface NewsItem {
    id: string;
    title: string;
    body: string;
    date: string;
    highlight: boolean;
}

export default function NewsPage() {
    const params = useParams();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                const found = data.news?.find((n: NewsItem) => n.id === params.id);
                if (found) {
                    setNews(found);
                } else {
                    setNotFound(true);
                }
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-[#0a0a0a] animate-spin" />
            </div>
        );
    }

    if (notFound || !news) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#0a0a0a] mb-2">News Not Found</h1>
                    <p className="text-sm text-[#4a4a4a] mb-6">The news item you are looking for does not exist.</p>
                    <Link href="/" className="text-sm font-semibold text-[#0a0a0a] hover:text-[#0a0a0a] transition-colors flex items-center gap-2 justify-center">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Nav />

            {/* Content */}
            <main className="pt-32 md:pt-40 pb-24 px-6">
                <article className="max-w-2xl mx-auto">
                    <span className="block h-1 w-16 rounded-full brand-bar-smooth mb-8" />
                    <div className="flex items-center gap-3 mb-4">
                        {news.highlight && <div className="w-2 h-2 rounded-full bg-[#0a0a0a] animate-pulse" />}
                        <span className="text-xs font-semibold uppercase tracking-widest text-[#0a0a0a]">News</span>
                        <span className="text-xs text-[#6b6b6b]">•</span>
                        <span className="text-xs text-[#6b6b6b]">{news.date}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] leading-tight mb-8 tracking-tight">
                        {news.title}
                    </h1>

                    <div className="max-w-none">
                        {news.body ? news.body.split('\n').map((paragraph, i) => (
                            paragraph.trim() && (
                                <p key={i} className="text-base text-[#2a2a2a] leading-relaxed mb-5">
                                    {paragraph}
                                </p>
                            )
                        )) : (
                            <p className="text-base text-[#6b6b6b] italic">No additional details available.</p>
                        )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-[#e5e5e5]">
                        <Link href="/" className="text-sm font-semibold text-[#0a0a0a] hover:text-[#0a0a0a] transition-colors flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Home
                        </Link>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
