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

const FIELD = 'w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#e8eaed] rounded-lg text-sm text-[#202124] placeholder:text-[#80868b] focus:outline-none focus:border-[#4285F4] focus:bg-white focus:ring-4 focus:ring-[#4285F4]/10 transition-all';

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
            <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[20%] w-[22rem] h-[22rem] rounded-full bg-[#4285F4]/10 blur-[110px] animate-float-slow" />
                    <div className="absolute bottom-[20%] right-[20%] w-[20rem] h-[20rem] rounded-full bg-[#34A853]/10 blur-[110px] animate-float-slow" style={{ animationDelay: '-6s' }} />
                </div>
                <div className="relative z-10 w-full max-w-sm">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
                            <Image src="/favicon/favicon-96x96.png" alt="HITROO" width={32} height={32} className="rounded-lg" />
                            <span className="text-lg font-bold text-[#202124]">HITROO</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-[#202124]">Admin Access</h1>
                        <p className="text-sm text-[#5f6368] mt-2">Enter password to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 bg-white p-7 rounded-3xl card-soft">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#80868b]" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full pl-12 pr-4 py-3 bg-[#f8f9fa] border border-[#e8eaed] rounded-xl text-sm text-[#202124] placeholder:text-[#80868b] focus:outline-none focus:border-[#4285F4] focus:bg-white focus:ring-4 focus:ring-[#4285F4]/10 transition-all"
                            />
                        </div>
                        {authError && (
                            <p className="text-sm text-[#EA4335] text-center">{authError}</p>
                        )}
                        <button
                            type="submit"
                            className="btn-primary w-full py-3 text-sm font-medium rounded-xl"
                        >
                            Login
                        </button>
                    </form>

                    <Link href="/" className="flex items-center justify-center gap-2 mt-6 text-sm text-[#80868b] hover:text-[#4285F4] transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Admin dashboard
    return (
        <div className="min-h-screen bg-[#f8f9fa] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pt-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Image src="/favicon/favicon-96x96.png" alt="HITROO" width={32} height={32} className="rounded-lg" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-[#202124]">Content Manager</h1>
                            <p className="text-xs text-[#80868b] uppercase tracking-widest">Admin Dashboard</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-sm font-medium text-[#5f6368] hover:text-[#EA4335] transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-6 w-6 text-[#4285F4] animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Articles Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="h-5 w-5 text-[#4285F4]" />
                                <h2 className="text-base font-semibold text-[#202124]">Articles</h2>
                            </div>

                            {/* Add Article Form */}
                            <form onSubmit={addArticle} className="p-5 bg-white rounded-2xl card-soft space-y-3">
                                <input type="text" value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} placeholder="Article title" className={FIELD} />
                                <textarea value={articleBody} onChange={(e) => setArticleBody(e.target.value)} placeholder="Article content (supports multiple paragraphs)" rows={4} className={`${FIELD} resize-none`} />
                                <div className="flex gap-2">
                                    <select value={articleCategory} onChange={(e) => setArticleCategory(e.target.value)} className={FIELD}>
                                        <option value="Technology">Technology</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Insights">Insights</option>
                                        <option value="Product">Product</option>
                                        <option value="Company">Company</option>
                                    </select>
                                    <input type="text" value={articleDate} onChange={(e) => setArticleDate(e.target.value)} placeholder="Dec 2024" className={`${FIELD} w-28`} />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!articleTitle.trim() || addingArticle}
                                    className="btn-primary w-full py-2.5 text-sm font-medium rounded-lg disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-2"
                                >
                                    {addingArticle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                    Add Article
                                </button>
                            </form>

                            {/* Articles List */}
                            <div className="space-y-2">
                                {articles.length === 0 ? (
                                    <p className="text-sm text-[#80868b] text-center py-4">No articles yet</p>
                                ) : (
                                    articles.map((article) => (
                                        <div key={article.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#e8eaed]">
                                            <div>
                                                <p className="text-sm font-medium text-[#202124]">{article.title}</p>
                                                <p className="text-xs text-[#80868b]">{article.category} • {article.date}</p>
                                            </div>
                                            <button onClick={() => deleteItem('article', article.id)} className="p-2 text-[#80868b] hover:text-[#EA4335] transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* News Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Newspaper className="h-5 w-5 text-[#EA4335]" />
                                <h2 className="text-base font-semibold text-[#202124]">Latest News</h2>
                            </div>

                            {/* Add News Form */}
                            <form onSubmit={addNews} className="p-5 bg-white rounded-2xl card-soft space-y-3">
                                <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder="News headline" className={FIELD} />
                                <textarea value={newsBody} onChange={(e) => setNewsBody(e.target.value)} placeholder="News content (optional)" rows={3} className={`${FIELD} resize-none`} />
                                <div className="flex gap-2">
                                    <input type="text" value={newsDate} onChange={(e) => setNewsDate(e.target.value)} placeholder="Dec 2024" className={`${FIELD} flex-1`} />
                                    <label className="flex items-center gap-2 px-3 py-2.5 bg-[#f8f9fa] border border-[#e8eaed] rounded-lg cursor-pointer">
                                        <input type="checkbox" checked={newsHighlight} onChange={(e) => setNewsHighlight(e.target.checked)} className="accent-[#4285F4]" />
                                        <span className="text-sm text-[#5f6368]">Highlight</span>
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newsTitle.trim() || addingNews}
                                    className="btn-primary w-full py-2.5 text-sm font-medium rounded-lg disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-2"
                                >
                                    {addingNews ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                    Add News
                                </button>
                            </form>

                            {/* News List */}
                            <div className="space-y-2">
                                {news.length === 0 ? (
                                    <p className="text-sm text-[#80868b] text-center py-4">No news yet</p>
                                ) : (
                                    news.map((item) => (
                                        <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border ${item.highlight ? 'bg-[#4285F4]/5 border-[#4285F4]/30' : 'bg-white border-[#e8eaed]'}`}>
                                            <div className="flex items-center gap-2">
                                                {item.highlight && <div className="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />}
                                                <div>
                                                    <p className={`text-sm font-medium ${item.highlight ? 'text-[#4285F4]' : 'text-[#202124]'}`}>{item.title}</p>
                                                    <p className="text-xs text-[#80868b]">{item.date}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => deleteItem('news', item.id)} className="p-2 text-[#80868b] hover:text-[#EA4335] transition-colors">
                                                <Trash2 className="h-4 w-4" />
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
