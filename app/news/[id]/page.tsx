'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2 } from 'lucide-react';

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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-[#FF79C6] animate-spin" />
            </div>
        );
    }

    if (notFound || !news) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-medium text-white mb-2">News Not Found</h1>
                    <p className="text-xs text-white/40 mb-6">The news item you are looking for does not exist.</p>
                    <Link href="/" className="text-[10px] uppercase tracking-widest text-[#FF79C6] hover:text-white transition-colors flex items-center gap-2 justify-center">
                        <ArrowLeft className="h-3 w-3" /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/90 backdrop-blur-sm border-b border-white/5">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/favicon/favicon-96x96.png" alt="HITROO" width={28} height={28} className="rounded-sm" />
                        <span className="text-sm font-medium text-white">HITROO</span>
                    </Link>
                    <Link href="/" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="h-3 w-3" /> Back
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="pt-24 pb-20 px-6">
                <article className="max-w-2xl mx-auto">
                    {/* Date & Highlight */}
                    <div className="flex items-center gap-3 mb-4">
                        {news.highlight && <div className="w-2 h-2 rounded-full bg-[#FF79C6] animate-pulse" />}
                        <span className="text-[10px] uppercase tracking-widest text-[#FF79C6]">News</span>
                        <span className="text-[10px] text-white/30">•</span>
                        <span className="text-[10px] text-white/30">{news.date}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-medium text-white leading-tight mb-8">
                        {news.title}
                    </h1>

                    {/* Body */}
                    <div className="prose prose-invert prose-sm max-w-none">
                        {news.body ? news.body.split('\n').map((paragraph, i) => (
                            paragraph.trim() && (
                                <p key={i} className="text-sm text-white/70 leading-relaxed mb-4">
                                    {paragraph}
                                </p>
                            )
                        )) : (
                            <p className="text-sm text-white/40 italic">No additional details available.</p>
                        )}
                    </div>

                    {/* Back link */}
                    <div className="mt-12 pt-8 border-t border-white/5">
                        <Link href="/" className="text-[10px] uppercase tracking-widest text-[#FF79C6] hover:text-white transition-colors flex items-center gap-2">
                            <ArrowLeft className="h-3 w-3" /> Back to All News
                        </Link>
                    </div>
                </article>
            </main>
        </div>
    );
}
