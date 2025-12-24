'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface Article {
    id: string;
    title: string;
    body: string;
    category: string;
    date: string;
}

export default function ArticlePage() {
    const params = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                const found = data.articles?.find((a: Article) => a.id === params.id);
                if (found) {
                    setArticle(found);
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

    if (notFound || !article) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-medium text-white mb-2">Article Not Found</h1>
                    <p className="text-xs text-white/40 mb-6">The article you are looking for does not exist.</p>
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
                    {/* Category & Date */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-[#FF79C6]">{article.category}</span>
                        <span className="text-[10px] text-white/30">•</span>
                        <span className="text-[10px] text-white/30">{article.date}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-medium text-white leading-tight mb-8">
                        {article.title}
                    </h1>

                    {/* Body */}
                    <div className="prose prose-invert prose-sm max-w-none">
                        {article.body ? article.body.split('\n').map((paragraph, i) => (
                            paragraph.trim() && (
                                <p key={i} className="text-sm text-white/70 leading-relaxed mb-4">
                                    {paragraph}
                                </p>
                            )
                        )) : (
                            <p className="text-sm text-white/40 italic">No content available.</p>
                        )}
                    </div>

                    {/* Back link */}
                    <div className="mt-12 pt-8 border-t border-white/5">
                        <Link href="/" className="text-[10px] uppercase tracking-widest text-[#FF79C6] hover:text-white transition-colors flex items-center gap-2">
                            <ArrowLeft className="h-3 w-3" /> Back to All Articles
                        </Link>
                    </div>
                </article>
            </main>
        </div>
    );
}
