'use client';

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Cpu,
    Eye,
    Bot,
    Plane,
    Lightbulb,
    Smartphone,
    Globe,
    Palette,
    Brain,
    FlaskConical,
    TestTube,
    Server,
    Cog,
    MessageSquare,
    Joystick,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Services() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const serviceCategories = [
        {
            title: 'Robotics & Automation',
            description: 'End-to-end solutions for industrial and commercial automation',
            services: [
                {
                    icon: Cpu,
                    name: 'Industrial Automation',
                    description: 'Complete automation solutions for manufacturing, assembly lines, and industrial processes with PLC, SCADA, and custom control systems.',
                },
                {
                    icon: Eye,
                    name: 'Vision Systems',
                    description: 'Computer vision solutions for quality inspection, object detection, tracking, and intelligent monitoring systems.',
                },
                {
                    icon: Bot,
                    name: 'Robotics Automation',
                    description: 'Custom robotic solutions including robotic arms, mobile robots, and collaborative robots for various applications.',
                },
                {
                    icon: Plane,
                    name: 'Drone Solutions',
                    description: 'UAV development, aerial surveying, inspection drones, and autonomous flight systems for commercial applications.',
                },
                {
                    icon: Joystick,
                    name: 'Autonomous Behaviour Models',
                    description: 'Advanced behaviour planning and decision-making systems for autonomous robots and vehicles.',
                },
            ],
        },
        {
            title: 'AI & Machine Learning',
            description: 'Cutting-edge AI solutions from research to deployment',
            services: [
                {
                    icon: Brain,
                    name: 'AI/ML Development',
                    description: 'Custom machine learning solutions, deep learning models, and AI-powered applications tailored to your needs.',
                },
                {
                    icon: FlaskConical,
                    name: 'Model Training',
                    description: 'End-to-end model training services including data preparation, hyperparameter tuning, and distributed training.',
                },
                {
                    icon: TestTube,
                    name: 'Model Testing & Validation',
                    description: 'Comprehensive testing, benchmarking, and validation of ML models for production readiness.',
                },
                {
                    icon: MessageSquare,
                    name: 'vLLM Solutions',
                    description: 'Large language model deployment, fine-tuning, and optimization using vLLM for high-performance inference.',
                },
                {
                    icon: Bot,
                    name: 'VLA (Vision-Language-Action)',
                    description: 'State-of-the-art Vision-Language-Action models for robotics, enabling robots to understand and act on natural language instructions.',
                },
            ],
        },
        {
            title: 'Software Development',
            description: 'Full-stack development services for web and mobile',
            services: [
                {
                    icon: Smartphone,
                    name: 'App Development',
                    description: 'Native and cross-platform mobile applications for iOS and Android with modern UI/UX.',
                },
                {
                    icon: Globe,
                    name: 'Web Development',
                    description: 'Modern web applications, progressive web apps, and scalable backend systems using latest technologies.',
                },
                {
                    icon: Palette,
                    name: 'UI/UX Design',
                    description: 'User-centered design, prototyping, and design systems that create exceptional digital experiences.',
                },
                {
                    icon: Server,
                    name: 'DevOps',
                    description: 'CI/CD pipelines, cloud infrastructure, containerization, and automated deployment solutions.',
                },
            ],
        },
        {
            title: 'Consulting',
            description: 'Strategic guidance for technology transformation',
            services: [
                {
                    icon: Lightbulb,
                    name: 'Tech Consultancy',
                    description: 'Strategic technology consulting, architecture design, and digital transformation roadmaps for businesses.',
                },
                {
                    icon: Cog,
                    name: 'Process Optimization',
                    description: 'Analysis and optimization of existing systems and workflows for improved efficiency and performance.',
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Navbar */}
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
                        <Link href="/services" className="text-[10px] uppercase tracking-widest text-[#FF79C6] transition-colors">
                            Services
                        </Link>
                        <Link href="/about" className="text-[10px] uppercase tracking-widest text-white/30 hover:text-[#FF79C6] transition-colors">
                            About
                        </Link>
                        <button className="text-[10px] uppercase tracking-widest bg-[#FF79C6] text-black px-4 py-2 rounded hover:bg-[#FF79C6]/90 transition-colors">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative min-h-[50vh] flex items-center justify-center px-6 pt-20">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 hover:text-[#FF79C6] transition-colors"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Home
                    </Link>

                    <span className="block text-[10px] uppercase tracking-[0.2em] text-[#FF79C6]">Services</span>
                    <h1 className="text-3xl md:text-4xl font-medium text-white">
                        What We Build
                    </h1>
                    <p className="text-xs text-white/40 max-w-xl mx-auto leading-relaxed">
                        From industrial automation to cutting-edge AI, we deliver end-to-end solutions that transform ideas into reality.
                    </p>
                </div>
            </section>

            {/* Service Categories */}
            {serviceCategories.map((category, categoryIndex) => (
                <section key={categoryIndex} className="py-20 px-6 border-t border-white/5">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-12">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF79C6]">
                                {String(categoryIndex + 1).padStart(2, '0')}
                            </span>
                            <h2 className="text-xl font-medium text-white mt-2">{category.title}</h2>
                            <p className="text-xs text-white/40 mt-2">{category.description}</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.services.map((service, serviceIndex) => (
                                <div
                                    key={serviceIndex}
                                    className="group p-6 border border-white/5 rounded-lg hover:border-[#FF79C6]/30 transition-all bg-black/50 hover:bg-[#FF79C6]/5"
                                >
                                    <service.icon className="h-5 w-5 mb-4 text-[#FF79C6]" />
                                    <h3 className="text-sm font-medium text-white group-hover:text-[#FF79C6] transition-colors">
                                        {service.name}
                                    </h3>
                                    <p className="text-[11px] text-white/40 mt-2 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* CTA */}
            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <h2 className="text-xl font-medium text-white">Need a custom solution?</h2>
                    <p className="text-xs text-white/40">Let&apos;s discuss how we can help bring your vision to life.</p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <a href="mailto:Hello@hitroo.com" className="text-[10px] uppercase tracking-widest bg-[#FF79C6] text-black px-5 py-2.5 rounded hover:bg-[#FF79C6]/90 transition-colors">
                            Contact Us
                        </a>
                        <a href="tel:+917550000805" className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                            +91 7550000805
                        </a>
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
                                    <a key={item} href="/#products" className="block text-xs text-white/40 hover:text-[#FF79C6] transition-colors">{item}</a>
                                ))}
                            </div>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-[10px] uppercase tracking-widest text-white/50 mb-4">Company</h4>
                            <div className="space-y-2">
                                <Link href="/about" className="block text-xs text-white/40 hover:text-[#FF79C6] transition-colors">About</Link>
                                <Link href="/services" className="block text-xs text-white/40 hover:text-[#FF79C6] transition-colors">Services</Link>
                                <a href="#" className="block text-xs text-white/40 hover:text-[#FF79C6] transition-colors">Careers</a>
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
        </div>
    );
}
