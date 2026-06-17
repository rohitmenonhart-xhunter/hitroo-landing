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
                <Loader2 className="h-6 w-6 text-[#4285F4] animate-spin" />
            </div>
        );
    }

    if (notFound || !news) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#202124] mb-2">News Not Found</h1>
                    <p className="text-sm text-[#5f6368] mb-6">The news item you are looking for does not exist.</p>
                    <Link href="/" className="text-sm font-semibold text-[#4285F4] hover:text-[#202124] transition-colors flex items-center gap-2 justify-center">
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
                        {news.highlight && <div className="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />}
                        <span className="text-xs font-semibold uppercase tracking-widest text-[#4285F4]">News</span>
                        <span className="text-xs text-[#80868b]">•</span>
                        <span className="text-xs text-[#80868b]">{news.date}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-[#202124] leading-tight mb-8 tracking-tight">
                        {news.title}
                    </h1>

                    <div className="max-w-none">
                        {news.body ? news.body.split('\n').map((paragraph, i) => (
                            paragraph.trim() && (
                                <p key={i} className="text-base text-[#3c4043] leading-relaxed mb-5">
                                    {paragraph}
                                </p>
                            )
                        )) : (
                            <p className="text-base text-[#80868b] italic">No additional details available.</p>
                        )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-[#e8eaed]">
                        <Link href="/" className="text-sm font-semibold text-[#4285F4] hover:text-[#202124] transition-colors flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Home
                        </Link>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
