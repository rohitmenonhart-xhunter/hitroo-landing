'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Mic,
  CheckSquare,
  Lightbulb,
  GraduationCap,
  Megaphone,
  ChevronDown,
  Sparkles,
  Keyboard,
  MessageSquare,
  Wand2,
  Building2,
  Users,
  TrendingUp,
  Loader2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LaserFlow from '@/components/LaserFlow';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // AI Chat state
  const [userMessage, setUserMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Lead capture state (AI Chat)
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const [leadContext, setLeadContext] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Early Access popup state
  const [showEarlyAccess, setShowEarlyAccess] = useState(false);
  const [eaName, setEaName] = useState('');
  const [eaEmail, setEaEmail] = useState('');
  const [eaPhone, setEaPhone] = useState('');
  const [eaReason, setEaReason] = useState('');
  const [isSubmittingEa, setIsSubmittingEa] = useState(false);
  const [eaSubmitted, setEaSubmitted] = useState(false);

  // Dynamic content state
  interface Article { id: string; title: string; category: string; date: string; }
  interface NewsItem { id: string; title: string; date: string; highlight: boolean; }
  const [articles, setArticles] = useState<Article[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  // Fetch dynamic content
  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setNewsItems(data.news || []);
      })
      .catch(() => { });
  }, []);

  const sendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;

    setIsLoading(true);
    setShowResponse(true);
    setAiResponse('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiResponse(data.response);

        // Check if user wants to create something
        if (data.wantsToCreate && data.context) {
          setLeadContext(data.context);
          setTimeout(() => {
            setShowLeadPopup(true);
          }, 1500); // Show popup after AI response
        }
      } else {
        setAiResponse('Something went wrong. Please try again.');
      }
    } catch {
      setAiResponse('Unable to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitLead = async () => {
    if (!leadPhone.trim() && !leadEmail.trim()) return;

    setIsSubmittingLead(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          context: leadContext,
          leadType: 'ai_chat'
        }),
      });

      if (response.ok) {
        setLeadSubmitted(true);
        setTimeout(() => {
          setShowLeadPopup(false);
          setLeadSubmitted(false);
          setLeadName('');
          setLeadEmail('');
          setLeadPhone('');
        }, 2000);
      }
    } catch {
      // Silently fail
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const submitEarlyAccess = async () => {
    if (!eaPhone.trim() && !eaEmail.trim()) return;

    setIsSubmittingEa(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: eaName,
          email: eaEmail,
          phone: eaPhone,
          context: eaReason,
          leadType: 'early_access'
        }),
      });

      if (response.ok) {
        setEaSubmitted(true);
        setTimeout(() => {
          setShowEarlyAccess(false);
          setEaSubmitted(false);
          setEaName('');
          setEaEmail('');
          setEaPhone('');
          setEaReason('');
        }, 2000);
      }
    } catch {
      // Silently fail
    } finally {
      setIsSubmittingEa(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeResponse = () => {
    setShowResponse(false);
    setAiResponse('');
    setUserMessage('');
    setIsExpanded(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1200);
    };

    // Initial check
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const products = [
    {
      name: 'Capsona',
      tagline: 'Voice-First Intelligence',
      status: 'Flagship • Coming Soon',
      image: '/productimage/capsona_usage.png',
      description:
        'Revolutionary voice utility software that transforms your speech into perfectly formatted, high-quality text. Simply speak, and watch your words come to life.',
      features: [
        {
          icon: Mic,
          title: 'Speak & Type',
          description: 'High-quality voice-to-text that just works',
        },
        {
          icon: Sparkles,
          title: 'AI Intelligence',
          description: 'Say "give a birthday wish for my friend" and get it instantly',
        },
        {
          icon: Keyboard,
          title: 'Tone Changing',
          description: 'Transform your message tone with keyboard shortcuts',
        },
        {
          icon: MessageSquare,
          title: 'Auto Response',
          description: 'Intelligent automated responses that save hours',
        },
      ],
      accent: 'from-violet-500/10 to-purple-500/10',
      borderAccent: 'hover:border-violet-500/30',
      color: '#8B5CF6',
    },
    {
      name: 'Attyn',
      tagline: 'AI-Powered Task Management',
      status: 'Under Development',
      image: '/productimage/attyn_usage.png',
      description:
        'Smart task management that thinks ahead. Attyn uses AI to prioritize, organize, and help you accomplish more with less cognitive overhead.',
      features: [
        {
          icon: CheckSquare,
          title: 'Intelligent Prioritization',
          description: 'AI-driven task ranking and scheduling',
        },
        {
          icon: Wand2,
          title: 'Smart Automation',
          description: 'Automated workflows that adapt to your patterns',
        },
      ],
      accent: 'from-blue-500/10 to-cyan-500/10',
      borderAccent: 'hover:border-blue-500/30',
      color: '#3B82F6',
    },
    {
      name: 'Belecure',
      tagline: 'Lighting Design, Reimagined',
      status: 'Partnership with Lightscape',
      image: '/productimage/belecure_usage.png',
      description:
        'The Canva for lighting design. Create stunning lighting simulations with floorplans, visualize your space, and bring your lighting vision to life.',
      features: [
        {
          icon: Lightbulb,
          title: 'Visual Simulation',
          description: 'Real-time lighting visualization on floorplans',
        },
        {
          icon: Wand2,
          title: 'Drag & Drop Design',
          description: 'Intuitive interface for professionals and beginners',
        },
      ],
      accent: 'from-amber-500/10 to-yellow-500/10',
      borderAccent: 'hover:border-amber-500/30',
      color: '#F59E0B',
    },
    {
      name: 'Mockello',
      tagline: 'Bridging Education & Industry',
      status: 'Building the Future of Hiring',
      image: '/productimage/mockello_usage.png',
      description:
        'End-to-end platform connecting colleges, companies, and students. Train students on real-world skills, allocate opportunities fairly, and ensure every student gets their chance.',
      features: [
        {
          icon: GraduationCap,
          title: 'Student Training',
          description: 'Comprehensive skill development programs',
        },
        {
          icon: Building2,
          title: 'Company Integration',
          description: 'Direct pipeline to industry opportunities',
        },
        {
          icon: Users,
          title: 'Fair Allocation',
          description: 'Every student gets an equal opportunity',
        },
      ],
      accent: 'from-emerald-500/10 to-green-500/10',
      borderAccent: 'hover:border-emerald-500/30',
      color: '#10B981',
    },
    {
      name: 'AI Marketing Agent',
      tagline: 'Your Distribution Engine',
      status: 'Expanding to Partners',
      image: '/productimage/ai_marketer_usage.png',
      description:
        'Started with a vision of having our own distribution stream across all platforms. Now, we\'re bringing this powerful marketing automation to other companies as well.',
      features: [
        {
          icon: Megaphone,
          title: 'Multi-Platform',
          description: 'Unified distribution across all channels',
        },
        {
          icon: TrendingUp,
          title: 'Growth Automation',
          description: 'AI-powered marketing that scales',
        },
      ],
      accent: 'from-rose-500/10 to-pink-500/10',
      borderAccent: 'hover:border-rose-500/30',
      color: '#F43F5E',
    },
  ];

  return (
    <>
      {/* Intro Video Splash */}
      {showIntro && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
          {/* Vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, transparent 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%)',
            }}
          />

          {/* Video container - small centered with glow */}
          <div className="relative flex items-center justify-center">
            {/* Outer glow */}
            <div
              className="absolute rounded-xl"
              style={{
                width: '340px',
                height: '340px',
                background: 'radial-gradient(circle, rgba(255, 121, 198, 0.4) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }}
            />
            {/* Video with border */}
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                border: '1px solid rgba(255, 121, 198, 0.4)',
                boxShadow: '0 0 30px rgba(255, 121, 198, 0.3), 0 0 60px rgba(255, 121, 198, 0.15), inset 0 0 20px rgba(255, 121, 198, 0.05)',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onEnded={() => setShowIntro(false)}
                className="w-[300px] h-auto object-contain"
              >
                <source src="/intro/Metal_Shine_Logo_Animation (online-video-cutter.com) (3).mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          {/* Glow effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(255, 121, 198, 0.15) 0%, transparent 50%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Skip button */}
          <button
            onClick={() => setShowIntro(false)}
            className="absolute bottom-8 right-8 text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
          >
            Skip
          </button>

          {/* Fade out transition */}
          <style jsx>{`
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; pointer-events: none; }
            }
          `}</style>
        </div>
      )}

      {/* Main Content */}
      <div className={`min-h-screen bg-black transition-opacity duration-700 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
          <div
            className={`max-w-6xl mx-auto px-6 py-5 flex items-center justify-between transition-all duration-300 ${scrollY > 50 ? 'bg-black/90 backdrop-blur-xl border-b border-white/5' : ''
              }`}
          >
            <Link href="/" className="flex items-center gap-2">
              <Image src="/favicon/favicon-96x96.png" alt="HITROO" width={28} height={28} className="rounded-sm" />
              <span className="text-lg font-bold tracking-tight text-white">HITROO</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#products"
                className="text-xs font-medium text-white/50 hover:text-[#FF79C6] transition-colors"
              >
                Products
              </a>
              <Link
                href="/about"
                className="text-xs font-medium text-white/50 hover:text-[#FF79C6] transition-colors"
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-xs font-medium text-white/50 hover:text-[#FF79C6] transition-colors"
              >
                Services
              </Link>
              <Button
                variant="default"
                className="bg-[#FF79C6] text-black hover:bg-[#FF79C6]/90 text-xs h-9 px-4 font-semibold"
                onClick={() => setShowEarlyAccess(true)}
              >
                Get Started
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section with LaserFlow */}
        <section className="relative min-h-screen flex flex-col items-center bg-black overflow-hidden">
          {/* LaserFlow Background */}
          <div className="absolute inset-0 z-0 w-full h-full" style={{ minHeight: '100vh' }}>
            <LaserFlow
              color="#FF79C6"
              wispDensity={1}
              mouseTiltStrength={0.01}
              horizontalBeamOffset={0.0}
              verticalBeamOffset={isMobile ? 0.01 : isTablet ? -0.05 : -0.15}
              flowSpeed={0.35}
              verticalSizing={isMobile ? 9.0 : isTablet ? 3.0 : 2.0}
              horizontalSizing={isMobile ? 1.5 : isTablet ? 1.0 : 0.5}
              fogIntensity={0.5}
              fogScale={0.3}
              wispSpeed={15.0}
              wispIntensity={5.0}
              flowStrength={0.25}
              decay={1.1}
              falloffStart={1.2}
              fogFallSpeed={0.6}
              coreWidth={isMobile ? 2 : isTablet ? 1.5 : 1.0}
            />
          </div>

          {/* Main Layout - Responsive */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 min-h-screen flex flex-col justify-center">

            {/* Top Section - Text Content (3-column at all sizes to keep text around beam) */}
            <div className="flex items-center pt-20 sm:pt-16 lg:pt-16 pb-4">
              <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 items-center">

                {/* Left */}
                <div className="text-right space-y-1 sm:space-y-2 animate-in fade-in slide-in-from-left-6 duration-1000 lg:-mt-12">
                  <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium tracking-tight leading-tight text-white">
                    What would
                    <br />
                    <span className="text-[#FF79C6]">you like</span>
                  </h1>
                </div>

                {/* Center - Spacer for beam (visible at all sizes) */}
                <div className="flex items-center justify-center">
                  <div className="w-8 sm:w-16 lg:w-24 h-20 sm:h-24 lg:h-32" />
                </div>

                {/* Right */}
                <div className="text-left space-y-1 sm:space-y-2 animate-in fade-in slide-in-from-right-6 duration-1000 delay-200 lg:mt-12">
                  <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium tracking-tight leading-tight">
                    <span className="text-[#FF79C6]">to create</span>
                    <br />
                    <span className="text-white">today?</span>
                  </h1>
                  <p className="text-[8px] sm:text-[10px] text-white/40 max-w-[100px] sm:max-w-xs leading-relaxed">
                    Ask us anything.
                  </p>
                </div>
              </div>
            </div>

            {/* Input Box - Responsive margins using JS breakpoints */}
            <div
              className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 relative"
              style={{ marginTop: isMobile ? '2rem' : isTablet ? '3rem' : '9rem' }}
            >
              <div className="relative group">
                {/* Animated pink border glow */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#FF79C6]/0 via-[#FF79C6]/60 to-[#FF79C6]/0 rounded-lg opacity-100 animate-pulse"
                  style={{
                    animation: 'borderFlow 3s ease-in-out infinite',
                    background: 'linear-gradient(90deg, transparent 0%, #FF79C6 50%, transparent 100%)',
                    backgroundSize: '200% 100%'
                  }}
                />

                {/* Solid black container */}
                <div className="relative bg-black rounded-lg border border-[#FF79C6]/30 overflow-hidden">
                  {/* Top pink accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF79C6] to-transparent" />

                  <div className="relative p-5">
                    <textarea
                      ref={textareaRef}
                      placeholder="Ask anything about HITROO..."
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full h-16 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none resize-none"
                      style={{ caretColor: '#FF79C6' }}
                      disabled={isLoading}
                    />

                    {/* Bottom bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#FF79C6]/10">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-[#FF79C6]/10 hover:bg-[#FF79C6]/20 transition-colors border border-[#FF79C6]/20">
                          <Mic className="h-3.5 w-3.5 text-[#FF79C6]" />
                        </button>
                        <span className="text-[10px] text-white/30">voice</span>
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={isLoading || !userMessage.trim()}
                        className="text-[10px] uppercase tracking-widest bg-[#FF79C6] text-black px-4 py-2 rounded hover:bg-[#FF79C6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Thinking
                          </>
                        ) : (
                          'Send'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bottom pink accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF79C6]/50 to-transparent" />
                </div>
              </div>

              {/* AI Response Floating Bubble - Absolute positioned overlay */}
              {showResponse && (
                <div className="absolute left-0 right-0 top-full mt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-[#FF79C6]/10 rounded-lg blur-lg" />

                    {/* Response container */}
                    <div className="relative bg-black/95 backdrop-blur-xl rounded-lg border border-[#FF79C6]/20 overflow-hidden">
                      {/* Top accent */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF79C6]/50 to-transparent" />

                      <div className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* HITROO Logo */}
                          <Image
                            src="/favicon/favicon-96x96.png"
                            alt="HITROO"
                            width={20}
                            height={20}
                            className="rounded-sm flex-shrink-0"
                          />

                          {/* Response text */}
                          <div className="flex-1 min-w-0">
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <span className="w-1.5 h-1.5 bg-[#FF79C6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <span className="w-1.5 h-1.5 bg-[#FF79C6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <span className="w-1.5 h-1.5 bg-[#FF79C6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                              </div>
                            ) : (
                              <p className={`text-xs text-white/80 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                                {aiResponse}
                              </p>
                            )}
                          </div>

                          {/* Expand/Collapse button */}
                          {!isLoading && aiResponse && (
                            <button
                              onClick={() => setIsExpanded(!isExpanded)}
                              className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
                              title={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              <ChevronDown className={`h-3 w-3 text-white/40 hover:text-white transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}

                          {/* Close button */}
                          <button
                            onClick={closeResponse}
                            className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
                          >
                            <X className="h-3 w-3 text-white/40 hover:text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF79C6]/30 to-transparent" />
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions - Minimal */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {['What is Capsona?', 'Tell me about HITROO', 'Your products', 'Get early access'].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setUserMessage(s);
                      textareaRef.current?.focus();
                    }}
                    className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[10px] text-white/30 hover:text-white/60 hover:border-white/10 transition-all hover:bg-white/[0.06]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Scroll */}
            <div className="pb-6 animate-bounce flex justify-center">
              <ChevronDown className="h-4 w-4 text-white/20" />
            </div>
          </div>
        </section>

        {/* What's New - Minimal */}
        <section className="py-16 px-6 border-t border-white/5 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF79C6]">New</span>
                <h2 className="text-xl font-semibold text-white">Capsona</h2>
                <p className="text-xs text-white/40 leading-relaxed">
                  Voice-first intelligence. Speak, and watch your words become perfectly formatted text.
                </p>
                <button className="text-[10px] uppercase tracking-widest text-[#FF79C6] hover:text-white transition-colors flex items-center gap-2 mt-2">
                  Explore <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="lg:col-span-3 relative group">
                <div className="absolute -inset-1 bg-[#FF79C6]/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative overflow-hidden rounded-lg border border-white/5">
                  <Image
                    src="/productimage/capsona_usage.png"
                    alt="Capsona"
                    width={600}
                    height={340}
                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats - Minimal */}
        <section className="py-20 px-6 border-t border-white/5 bg-black">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-16 md:gap-24">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-light text-white">100<span className="text-[#FF79C6]">+</span></div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-2">Projects</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-light text-white">5<span className="text-[#FF79C6]">+</span></div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-2">Products</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-light text-white/50">∞</div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-2">Ambition</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team - Minimal */}
        <section className="py-20 px-6 border-t border-white/5 bg-black">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Team</span>
            </div>

            <div className="flex justify-center">
              <div className="group text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FF79C6]/20 to-transparent border border-white/5 flex items-center justify-center group-hover:border-[#FF79C6]/30 transition-colors">
                  <span className="text-2xl font-light text-[#FF79C6]">R</span>
                </div>
                <h3 className="text-sm font-medium text-white">Rohit</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#FF79C6]/70 mt-1">Founder</p>
              </div>
            </div>
          </div>
        </section>

        {/* Flagship Product - Capsona */}
        <section id="products" className="py-20 px-6 border-t border-white/5 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF79C6]">Flagship</span>
              <h2 className="text-2xl md:text-3xl font-medium text-white mt-2">Capsona</h2>
              <p className="text-xs text-white/40 mt-2">Voice-First Intelligence</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative group order-2 lg:order-1">
                <div className="absolute -inset-2 bg-[#FF79C6]/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative overflow-hidden rounded-lg border border-white/5">
                  <Image
                    src="/productimage/capsona_usage.png"
                    alt="Capsona"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>
              </div>

              <div className="space-y-6 order-1 lg:order-2">
                <p className="text-xs text-white/50 leading-relaxed">
                  {products[0].description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {products[0].features.map((feature, index) => (
                    <div key={index} className="p-3 border border-white/5 rounded-lg hover:border-white/10 transition-colors">
                      <feature.icon className="h-4 w-4 mb-2 text-[#FF79C6]" />
                      <h3 className="text-[11px] font-medium text-white">{feature.title}</h3>
                      <p className="text-[10px] text-white/30 mt-1">{feature.description}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowEarlyAccess(true)}
                  className="text-[10px] uppercase tracking-widest text-[#FF79C6] hover:text-white transition-colors flex items-center gap-2"
                >
                  Get Early Access <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Other Products - Minimal */}
        <section className="py-20 px-6 border-t border-white/5 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Products</span>
              <h2 className="text-xl md:text-2xl font-medium text-white mt-2">Building the Future</h2>
            </div>

            <div className="space-y-16">
              {products.slice(1).map((product, index) => (
                <div
                  key={index}
                  className={`grid lg:grid-cols-5 gap-8 items-center ${index % 2 === 1 ? '' : ''}`}
                >
                  <div className={`lg:col-span-3 relative group ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="absolute -inset-1 bg-[#FF79C6]/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative overflow-hidden rounded-lg border border-white/5">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={600}
                        height={380}
                        className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
                      />
                      <span className="absolute top-3 left-3 text-[8px] uppercase tracking-widest text-[#FF79C6]/70 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                        {product.status}
                      </span>
                    </div>
                  </div>

                  <div className={`lg:col-span-2 space-y-4 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div>
                      <h3 className="text-lg font-medium text-white">{product.name}</h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#FF79C6]/70 mt-1">{product.tagline}</p>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">{product.description}</p>
                    <div className="space-y-2 pt-2">
                      {product.features.slice(0, 2).map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2">
                          <feature.icon className="h-3 w-3 text-[#FF79C6]/50" />
                          <span className="text-[10px] text-white/50">{feature.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy - Minimal */}
        <section className="py-20 px-6 border-t border-white/5 bg-black">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Philosophy</span>
            <h2 className="text-lg font-medium text-white mt-3 mb-8">Engineering That Matters</h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                'Engineering before aesthetics',
                'Reality before hype',
                'Systems before features',
                'Long-term impact',
              ].map((principle, index) => (
                <div key={index} className="p-4 border border-white/5 rounded-lg hover:border-white/10 transition-colors">
                  <p className="text-[11px] text-white/60">{principle}</p>
                </div>
              ))}
            </div>

            <Link href="/about">
              <button className="text-[10px] uppercase tracking-widest text-[#FF79C6] hover:text-white transition-colors flex items-center gap-2 mx-auto mt-8">
                Learn More <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-20 px-6 border-t border-white/5 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Resources</span>
              <h2 className="text-xl font-medium text-white mt-2">Articles</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {articles.length > 0 ? articles.slice(0, 3).map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`}>
                  <div className="group p-5 border border-white/5 rounded-lg hover:border-[#FF79C6]/30 transition-all cursor-pointer h-full">
                    <span className="text-[8px] uppercase tracking-widest text-[#FF79C6]/70">{article.category}</span>
                    <h3 className="text-sm font-medium text-white mt-2 group-hover:text-[#FF79C6] transition-colors">{article.title}</h3>
                    <p className="text-[10px] text-white/30 mt-3">{article.date}</p>
                  </div>
                </Link>
              )) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-xs text-white/30">No articles yet. Check back soon!</p>
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <button className="text-[10px] uppercase tracking-widest text-white/50 hover:text-[#FF79C6] transition-colors">
                View All Articles
              </button>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="py-20 px-6 border-t border-white/5 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF79C6]">Updates</span>
              <h2 className="text-xl font-medium text-white mt-2">Latest News</h2>
            </div>

            <div className="space-y-4">
              {newsItems.length > 0 ? newsItems.slice(0, 4).map((news) => (
                <Link key={news.id} href={`/news/${news.id}`}>
                  <div className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${news.highlight ? 'border-[#FF79C6]/30 bg-[#FF79C6]/5' : 'border-white/5 hover:border-white/10'}`}>
                    <div className="flex items-center gap-4">
                      {news.highlight && <div className="w-2 h-2 rounded-full bg-[#FF79C6] animate-pulse" />}
                      <h3 className={`text-xs font-medium ${news.highlight ? 'text-[#FF79C6]' : 'text-white/80'}`}>{news.title}</h3>
                    </div>
                    <span className="text-[10px] text-white/30">{news.date}</span>
                  </div>
                </Link>
              )) : (
                <div className="text-center py-8">
                  <p className="text-xs text-white/30">No news yet. Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA - Minimal */}
        <section className="py-24 px-6 border-t border-white/5 bg-black">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-xl font-medium text-white">Ready to build the future?</h2>
            <p className="text-xs text-white/40">Join us in making intelligent systems accessible.</p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setShowEarlyAccess(true)}
                className="text-[10px] uppercase tracking-widest bg-[#FF79C6] text-black px-5 py-2.5 rounded hover:bg-[#FF79C6]/90 transition-colors"
              >
                Get Early Access
              </button>
              <Link href="/about">
                <span className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                  Learn More
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/5 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div className="md:col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <Image src="/favicon/favicon-96x96.png" alt="HITROO" width={24} height={24} className="rounded-sm" />
                  <span className="text-sm font-medium text-white">HITROO</span>
                </Link>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Intelligence, Unbound.
                </p>
              </div>

              {/* Products */}
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-white/50 mb-4">Products</h4>
                <div className="space-y-2">
                  {['Capsona', 'Attyn', 'Belecure', 'Mockello', 'AI Marketing'].map((item) => (
                    <a key={item} href="#products" className="block text-xs text-white/40 hover:text-[#FF79C6] transition-colors">{item}</a>
                  ))}
                </div>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-white/50 mb-4">Company</h4>
                <div className="space-y-2">
                  <Link href="/about" className="block text-xs text-white/40 hover:text-[#FF79C6] transition-colors">About</Link>
                  <a href="#" className="block text-xs text-white/40 hover:text-[#FF79C6] transition-colors">Articles</a>
                  <a href="#" className="block text-xs text-white/40 hover:text-[#FF79C6] transition-colors">News</a>
                  <Link href="/careers" className="block text-xs text-white/40 hover:text-[#FF79C6] transition-colors">Careers</Link>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-white/50 mb-4">Contact</h4>
                <div className="space-y-3">
                  <a href="mailto:Hello@hitroo.com" className="flex items-center gap-2 text-xs text-white/40 hover:text-[#FF79C6] transition-colors">
                    <span>Hello@hitroo.com</span>
                  </a>
                  <a href="tel:+917550000805" className="flex items-center gap-2 text-xs text-white/40 hover:text-[#FF79C6] transition-colors">
                    <span>+91 7550000805</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[10px] text-white/20">© {new Date().getFullYear()} HITROO. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-[10px] text-white/20 hover:text-white/50 transition-colors">Privacy</a>
                <a href="#" className="text-[10px] text-white/20 hover:text-white/50 transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Lead Capture Popup */}
        {showLeadPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isSubmittingLead && setShowLeadPopup(false)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
              {/* Glow */}
              <div className="absolute -inset-1 bg-[#FF79C6]/20 rounded-2xl blur-xl" />

              <div className="relative bg-black border border-[#FF79C6]/30 rounded-2xl overflow-hidden">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF79C6] to-transparent" />

                <div className="p-6">
                  {leadSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#FF79C6]/20 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-[#FF79C6]" />
                      </div>
                      <h3 className="text-lg font-medium text-white">We will reach out soon</h3>
                      <p className="text-xs text-white/40 mt-2">Our team will contact you shortly.</p>
                    </div>
                  ) : (
                    <>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src="/favicon/favicon-96x96.png"
                            alt="HITROO"
                            width={24}
                            height={24}
                            className="rounded-sm"
                          />
                          <div>
                            <h3 className="text-sm font-medium text-white">Let us help you build it</h3>
                            <p className="text-[10px] text-white/40">Share your number, we will call you back</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowLeadPopup(false)}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                        >
                          <X className="h-4 w-4 text-white/40 hover:text-white" />
                        </button>
                      </div>

                      {/* Context */}
                      <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-[10px] uppercase tracking-widest text-[#FF79C6]/70 mb-1">Your requirement</p>
                        <p className="text-xs text-white/70 line-clamp-2">{leadContext}</p>
                      </div>

                      {/* Name Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50 transition-colors"
                          style={{ caretColor: '#FF79C6' }}
                        />
                      </div>

                      {/* Email Input */}
                      <div className="mb-3">
                        <input
                          type="email"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="Email address"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50 transition-colors"
                          style={{ caretColor: '#FF79C6' }}
                        />
                      </div>

                      {/* Phone Input */}
                      <div className="mb-4">
                        <input
                          type="tel"
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          placeholder="Phone number (optional)"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50 transition-colors"
                          style={{ caretColor: '#FF79C6' }}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        onClick={submitLead}
                        disabled={(!leadPhone.trim() && !leadEmail.trim()) || isSubmittingLead}
                        className="w-full py-3 bg-[#FF79C6] text-black text-xs uppercase tracking-widest font-medium rounded-lg hover:bg-[#FF79C6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmittingLead ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Submitting
                          </>
                        ) : (
                          'Get a Callback'
                        )}
                      </button>

                      <p className="text-[10px] text-white/30 text-center mt-4">
                        Or reach us at Hello@hitroo.com
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Early Access Popup */}
        {showEarlyAccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isSubmittingEa && setShowEarlyAccess(false)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
              {/* Glow */}
              <div className="absolute -inset-1 bg-[#FF79C6]/20 rounded-2xl blur-xl" />

              <div className="relative bg-black border border-[#FF79C6]/30 rounded-2xl overflow-hidden">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF79C6] to-transparent" />

                <div className="p-6">
                  {eaSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#FF79C6]/20 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-[#FF79C6]" />
                      </div>
                      <h3 className="text-lg font-medium text-white">You are on the list!</h3>
                      <p className="text-xs text-white/40 mt-2">We will notify you when early access opens.</p>
                    </div>
                  ) : (
                    <>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src="/favicon/favicon-96x96.png"
                            alt="HITROO"
                            width={24}
                            height={24}
                            className="rounded-sm"
                          />
                          <div>
                            <h3 className="text-sm font-medium text-white">Get Early Access</h3>
                            <p className="text-[10px] text-white/40">Be first to experience HITROO</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowEarlyAccess(false)}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                        >
                          <X className="h-4 w-4 text-white/40 hover:text-white" />
                        </button>
                      </div>

                      {/* Name Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          value={eaName}
                          onChange={(e) => setEaName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50 transition-colors"
                          style={{ caretColor: '#FF79C6' }}
                        />
                      </div>

                      {/* Email Input */}
                      <div className="mb-3">
                        <input
                          type="email"
                          value={eaEmail}
                          onChange={(e) => setEaEmail(e.target.value)}
                          placeholder="Email address"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50 transition-colors"
                          style={{ caretColor: '#FF79C6' }}
                        />
                      </div>

                      {/* Phone Input */}
                      <div className="mb-3">
                        <input
                          type="tel"
                          value={eaPhone}
                          onChange={(e) => setEaPhone(e.target.value)}
                          placeholder="Phone number (optional)"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50 transition-colors"
                          style={{ caretColor: '#FF79C6' }}
                        />
                      </div>

                      {/* Reason Input */}
                      <div className="mb-4">
                        <textarea
                          value={eaReason}
                          onChange={(e) => setEaReason(e.target.value)}
                          placeholder="Why are you interested in early access?"
                          rows={3}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50 transition-colors resize-none"
                          style={{ caretColor: '#FF79C6' }}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        onClick={submitEarlyAccess}
                        disabled={(!eaPhone.trim() && !eaEmail.trim()) || isSubmittingEa}
                        className="w-full py-3 bg-[#FF79C6] text-black text-xs uppercase tracking-widest font-medium rounded-lg hover:bg-[#FF79C6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmittingEa ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Submitting
                          </>
                        ) : (
                          'Join Early Access'
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

