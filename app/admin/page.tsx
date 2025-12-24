'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Loader2, Lock, Newspaper, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Article {
    id: string;
    title: string;
    body: string;
    category: string;
    date: string;
}

interface NewsItem {
    id: string;
    title: string;
    body: string;
    date: string;
    highlight: boolean;
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    const [articles, setArticles] = useState<Article[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Article form
    const [articleTitle, setArticleTitle] = useState('');
    const [articleBody, setArticleBody] = useState('');
    const [articleCategory, setArticleCategory] = useState('Technology');
    const [articleDate, setArticleDate] = useState('');

    // News form
    const [newsTitle, setNewsTitle] = useState('');
    const [newsBody, setNewsBody] = useState('');
    const [newsDate, setNewsDate] = useState('');
    const [newsHighlight, setNewsHighlight] = useState(false);

    const [addingArticle, setAddingArticle] = useState(false);
    const [addingNews, setAddingNews] = useState(false);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/content');
            const data = await res.json();
            setArticles(data.articles || []);
            setNews(data.news || []);
        } catch {
            // Handle error silently
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchContent();
        }
    }, [isAuthenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Test password by attempting a protected action
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, type: 'test', item: {} }),
            });

            if (res.status === 401) {
                setAuthError('Invalid password');
            } else {
                setIsAuthenticated(true);
                setAuthError('');
            }
        } catch {
            setAuthError('Connection error');
        }
    };

    const addArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!articleTitle.trim()) return;

        setAddingArticle(true);
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password,
                    type: 'article',
                    item: {
                        title: articleTitle,
                        body: articleBody,
                        category: articleCategory,
                        date: articleDate || undefined,
                    },
                }),
            });

            if (res.ok) {
                setArticleTitle('');
                setArticleBody('');
                setArticleDate('');
                fetchContent();
            }
        } catch {
            // Handle error
        } finally {
            setAddingArticle(false);
        }
    };

    const addNews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsTitle.trim()) return;

        setAddingNews(true);
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password,
                    type: 'news',
                    item: {
                        title: newsTitle,
                        body: newsBody,
                        date: newsDate || undefined,
                        highlight: newsHighlight,
                    },
                }),
            });

            if (res.ok) {
                setNewsTitle('');
                setNewsBody('');
                setNewsDate('');
                setNewsHighlight(false);
                fetchContent();
            }
        } catch {
            // Handle error
        } finally {
            setAddingNews(false);
        }
    };

    const deleteItem = async (type: 'article' | 'news', id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            await fetch('/api/content', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, type, id }),
            });
            fetchContent();
        } catch {
            // Handle error
        }
    };

    // Login screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <Image src="/favicon/favicon-96x96.png" alt="HITROO" width={32} height={32} className="rounded-sm" />
                            <span className="text-lg font-medium text-white">HITROO</span>
                        </Link>
                        <h1 className="text-xl font-medium text-white">Admin Access</h1>
                        <p className="text-xs text-white/40 mt-2">Enter password to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50"
                            />
                        </div>
                        {authError && (
                            <p className="text-xs text-red-400 text-center">{authError}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full py-3 bg-[#FF79C6] text-black text-xs uppercase tracking-widest font-medium rounded-lg hover:bg-[#FF79C6]/90 transition-colors"
                        >
                            Login
                        </button>
                    </form>

                    <Link href="/" className="flex items-center justify-center gap-2 mt-6 text-xs text-white/30 hover:text-white/50 transition-colors">
                        <ArrowLeft className="h-3 w-3" /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Admin dashboard
    return (
        <div className="min-h-screen bg-black p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Image src="/favicon/favicon-96x96.png" alt="HITROO" width={28} height={28} className="rounded-sm" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-medium text-white">Content Manager</h1>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">Admin Dashboard</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-[10px] text-white/40 hover:text-white transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-6 w-6 text-[#FF79C6] animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Articles Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="h-4 w-4 text-[#FF79C6]" />
                                <h2 className="text-sm font-medium text-white">Articles</h2>
                            </div>

                            {/* Add Article Form */}
                            <form onSubmit={addArticle} className="p-4 border border-white/10 rounded-lg space-y-3">
                                <input
                                    type="text"
                                    value={articleTitle}
                                    onChange={(e) => setArticleTitle(e.target.value)}
                                    placeholder="Article title"
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50"
                                />
                                <textarea
                                    value={articleBody}
                                    onChange={(e) => setArticleBody(e.target.value)}
                                    placeholder="Article content (supports multiple paragraphs)"
                                    rows={4}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50 resize-none"
                                />
                                <div className="flex gap-2">
                                    <select
                                        value={articleCategory}
                                        onChange={(e) => setArticleCategory(e.target.value)}
                                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#FF79C6]/50"
                                    >
                                        <option value="Technology">Technology</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Insights">Insights</option>
                                        <option value="Product">Product</option>
                                        <option value="Company">Company</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={articleDate}
                                        onChange={(e) => setArticleDate(e.target.value)}
                                        placeholder="Dec 2024"
                                        className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!articleTitle.trim() || addingArticle}
                                    className="w-full py-2 bg-[#FF79C6] text-black text-xs uppercase tracking-widest rounded hover:bg-[#FF79C6]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {addingArticle ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                                    Add Article
                                </button>
                            </form>

                            {/* Articles List */}
                            <div className="space-y-2">
                                {articles.length === 0 ? (
                                    <p className="text-xs text-white/30 text-center py-4">No articles yet</p>
                                ) : (
                                    articles.map((article) => (
                                        <div key={article.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <div>
                                                <p className="text-xs font-medium text-white">{article.title}</p>
                                                <p className="text-[10px] text-white/40">{article.category} • {article.date}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteItem('article', article.id)}
                                                className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* News Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Newspaper className="h-4 w-4 text-[#FF79C6]" />
                                <h2 className="text-sm font-medium text-white">Latest News</h2>
                            </div>

                            {/* Add News Form */}
                            <form onSubmit={addNews} className="p-4 border border-white/10 rounded-lg space-y-3">
                                <input
                                    type="text"
                                    value={newsTitle}
                                    onChange={(e) => setNewsTitle(e.target.value)}
                                    placeholder="News headline"
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50"
                                />
                                <textarea
                                    value={newsBody}
                                    onChange={(e) => setNewsBody(e.target.value)}
                                    placeholder="News content (optional)"
                                    rows={3}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50 resize-none"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newsDate}
                                        onChange={(e) => setNewsDate(e.target.value)}
                                        placeholder="Dec 2024"
                                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50"
                                    />
                                    <label className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newsHighlight}
                                            onChange={(e) => setNewsHighlight(e.target.checked)}
                                            className="accent-[#FF79C6]"
                                        />
                                        <span className="text-xs text-white/60">Highlight</span>
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newsTitle.trim() || addingNews}
                                    className="w-full py-2 bg-[#FF79C6] text-black text-xs uppercase tracking-widest rounded hover:bg-[#FF79C6]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {addingNews ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                                    Add News
                                </button>
                            </form>

                            {/* News List */}
                            <div className="space-y-2">
                                {news.length === 0 ? (
                                    <p className="text-xs text-white/30 text-center py-4">No news yet</p>
                                ) : (
                                    news.map((item) => (
                                        <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${item.highlight ? 'bg-[#FF79C6]/10 border border-[#FF79C6]/30' : 'bg-white/5'}`}>
                                            <div className="flex items-center gap-2">
                                                {item.highlight && <div className="w-2 h-2 rounded-full bg-[#FF79C6] animate-pulse" />}
                                                <div>
                                                    <p className={`text-xs font-medium ${item.highlight ? 'text-[#FF79C6]' : 'text-white'}`}>{item.title}</p>
                                                    <p className="text-[10px] text-white/40">{item.date}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteItem('news', item.id)}
                                                className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
