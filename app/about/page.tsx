'use client';

import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Cpu,
  Zap,
  Globe,
  Code,
  Box,
  Brain,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar - Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div
          className={`max-w-5xl mx-auto px-6 py-5 flex items-center justify-between transition-all duration-300 ${scrollY > 50 ? 'bg-black/90 backdrop-blur-xl border-b border-white/5' : ''
            }`}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src="/favicon/favicon-96x96.png" alt="HITROO" width={20} height={20} className="rounded-sm opacity-70" />
            <span className="text-sm font-medium text-white/70">HITROO</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#products" className="text-[10px] uppercase tracking-widest text-white/30 hover:text-[#FF79C6] transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-[10px] uppercase tracking-widest text-[#FF79C6] transition-colors">
              About
            </Link>
            <button className="text-[10px] uppercase tracking-widest bg-[#FF79C6] text-black px-4 py-2 rounded hover:bg-[#FF79C6]/90 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero - Minimal */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 hover:text-[#FF79C6] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Home
          </Link>

          <span className="block text-[10px] uppercase tracking-[0.2em] text-[#FF79C6]">About</span>
          <h1 className="text-3xl md:text-4xl font-medium text-white">
            Engineering the Future
          </h1>
          <p className="text-xs text-white/40 max-w-xl mx-auto leading-relaxed">
            Building intelligent machines and software systems that seamlessly integrate with the real world.
          </p>
        </div>
      </section>

      {/* Vision - Minimal */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Vision</span>
            <h2 className="text-xl font-medium text-white mt-2">
              A Future Where Intelligence is Universal
            </h2>
          </div>
          <div className="space-y-4 text-xs text-white/40 leading-relaxed">
            <p>
              To become a global force in building intelligent machines and software systems that seamlessly integrate with the real world.
            </p>
            <p>
              We envision intelligence distributed, adaptable, and universally deployable—from ground vehicles to software platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Mission - Minimal */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-4">
            <p className="text-xs text-white/40 leading-relaxed">
              Design, engineer, and deploy high-performance robotics and software systems.
            </p>
            <div className="space-y-2 pt-2">
              {[
                'Reduce cost barriers of advanced robotics',
                'Build modular, cloud-assisted intelligence',
                'Deliver production-grade systems',
                'Enable adoption without complexity',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#FF79C6]" />
                  <span className="text-[10px] text-white/50">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Mission</span>
            <h2 className="text-xl font-medium text-white mt-2">Engineering That Matters</h2>
          </div>
        </div>
      </section>

      {/* Capabilities - Minimal */}
      <section id="capabilities" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Capabilities</span>
            <h2 className="text-xl font-medium text-white mt-2">Full-Spectrum</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Box, title: 'UGV & UAV Platforms', desc: 'Autonomous vehicles' },
              { icon: Cpu, title: 'Robotics & Embedded', desc: 'Custom electronics' },
              { icon: Brain, title: 'AI & Intelligence', desc: 'Cloud-based systems' },
              { icon: Code, title: 'Software', desc: 'Backend & real-time' },
              { icon: Zap, title: 'End-to-End Design', desc: 'Concept to deployment' },
              { icon: Globe, title: 'Platform Thinking', desc: 'Connected systems' },
            ].map((item, index) => (
              <div key={index} className="p-4 border border-white/5 rounded-lg hover:border-white/10 transition-colors">
                <item.icon className="h-4 w-4 mb-3 text-[#FF79C6]" />
                <h3 className="text-[11px] font-medium text-white">{item.title}</h3>
                <p className="text-[10px] text-white/30 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story - Minimal */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Story</span>
          <h2 className="text-xl font-medium text-white mt-2 mb-8">Born From Frustration</h2>

          <div className="space-y-4 text-xs text-white/40 leading-relaxed text-left">
            <p>
              Advanced technology was becoming inaccessible due to cost, complexity, and closed ecosystems.
            </p>
            <div className="grid grid-cols-3 gap-3 py-6">
              {['Powerful systems were possible', 'But expensive and fragmented', 'Intelligence locked in hardware'].map((t, i) => (
                <div key={i} className="p-3 border border-white/5 rounded-lg">
                  <p className="text-[10px] text-white/50">{t}</p>
                </div>
              ))}
            </div>
            <p className="text-[#FF79C6]/70">
              HITROO was created to challenge that norm.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy - Minimal */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Philosophy</span>
          <h2 className="text-lg font-medium text-white mt-2 mb-8">Principles That Guide Us</h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              'Engineering before aesthetics',
              'Reality before hype',
              'Systems before features',
              'Long-term impact',
            ].map((principle, index) => (
              <div key={index} className="p-4 border border-white/5 rounded-lg">
                <p className="text-[11px] text-white/60">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future - Minimal */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Future</span>
          <h2 className="text-lg font-medium text-white mt-2 mb-8">Building the Infrastructure</h2>

          <div className="space-y-2 max-w-md mx-auto">
            {[
              'Autonomous systems are affordable',
              'Intelligence is modular and shareable',
              'Robotics for everyone',
              'Innovation driven by builders',
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#FF79C6]" />
                <span className="text-xs text-white/50">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-white mt-8">
            We are here to define infrastructure for the future.
          </p>
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-xl font-medium text-white">Ready to build the future?</h2>
          <div className="flex items-center justify-center gap-4">
            <button className="text-[10px] uppercase tracking-widest bg-[#FF79C6] text-black px-5 py-2.5 rounded hover:bg-[#FF79C6]/90 transition-colors">
              Get in Touch
            </button>
            <Link href="/#products">
              <span className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                View Products
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/favicon/favicon-96x96.png" alt="HITROO" width={20} height={20} className="rounded-sm opacity-70" />
            <span className="text-sm font-medium text-white/70">HITROO</span>
          </Link>
          <p className="text-[10px] text-white/20">{new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
