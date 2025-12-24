'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LaserFlow from '@/components/LaserFlow';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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
    <div className="min-h-screen bg-black">
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
              href="/about#capabilities"
              className="text-xs font-medium text-white/50 hover:text-[#FF79C6] transition-colors"
            >
              Capabilities
            </Link>
            <Button
              variant="default"
              className="bg-[#FF79C6] text-black hover:bg-[#FF79C6]/90 text-xs h-9 px-4 font-semibold"
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
                    placeholder="Ask anything..."
                    className="w-full h-16 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none resize-none"
                    style={{ caretColor: '#FF79C6' }}
                  />

                  {/* Bottom bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#FF79C6]/10">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-[#FF79C6]/10 hover:bg-[#FF79C6]/20 transition-colors border border-[#FF79C6]/20">
                        <Mic className="h-3.5 w-3.5 text-[#FF79C6]" />
                      </button>
                      <span className="text-[10px] text-white/30">voice</span>
                    </div>
                    <button className="text-[10px] uppercase tracking-widest bg-[#FF79C6] text-black px-4 py-2 rounded hover:bg-[#FF79C6]/90 transition-colors">
                      Send
                    </button>
                  </div>
                </div>

                {/* Bottom pink accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF79C6]/50 to-transparent" />
              </div>
            </div>

            {/* Suggestions - Minimal */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {['Services', 'AI solutions', 'Voice apps', 'Automation'].map((s) => (
                <button
                  key={s}
                  className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[10px] text-white/30 hover:text-white/60 hover:border-white/10 transition-all"
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

              <button className="text-[10px] uppercase tracking-widest text-[#FF79C6] hover:text-white transition-colors flex items-center gap-2">
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

      {/* CTA - Minimal */}
      <section className="py-24 px-6 border-t border-white/5 bg-black">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-xl font-medium text-white">Ready to build the future?</h2>
          <p className="text-xs text-white/40">Join us in making intelligent systems accessible.</p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <button className="text-[10px] uppercase tracking-widest bg-[#FF79C6] text-black px-5 py-2.5 rounded hover:bg-[#FF79C6]/90 transition-colors">
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

      {/* Footer - Minimal */}
      <footer className="py-8 px-6 border-t border-white/5 bg-black">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/favicon/favicon-96x96.png" alt="HITROO" width={20} height={20} className="rounded-sm opacity-70" />
            <span className="text-sm font-medium text-white/70">HITROO</span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#products" className="text-[10px] uppercase tracking-widest text-white/30 hover:text-[#FF79C6] transition-colors">Products</a>
            <Link href="/about" className="text-[10px] uppercase tracking-widest text-white/30 hover:text-[#FF79C6] transition-colors">About</Link>
          </div>
          <p className="text-[10px] text-white/20">{new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

