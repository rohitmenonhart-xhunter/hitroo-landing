'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Upload, Check, Code, Cpu, Brain, Wrench, Zap, Users } from 'lucide-react';

const POSITIONS = [
    { id: 'fullstack', title: 'Full Stack Developer', icon: Code, description: 'End-to-end web & mobile development with modern frameworks' },
    { id: 'frontend', title: 'Frontend Developer', icon: Zap, description: 'Craft beautiful, responsive, and performant user interfaces' },
    { id: 'backend', title: 'Backend Developer', icon: Cpu, description: 'Build scalable APIs, databases, and server infrastructure' },
    { id: 'hardware-mech', title: 'Hardware - Mechanical', icon: Wrench, description: 'Chassis design, 3D modeling, and mechanical systems' },
    { id: 'hardware-elec', title: 'Hardware - Electronics', icon: Zap, description: 'STM-level embedded systems, PCB design, and firmware' },
    { id: 'ml-ai', title: 'ML / AI Engineer', icon: Brain, description: 'Model training, testing, fine-tuning, and deployment' },
];

export default function CareersPage() {
    const [selectedPosition, setSelectedPosition] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolio: '',
        whyHitroo: '',
        whyPosition: '',
        experience: '',
        availability: '',
    });
    const [resume, setResume] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setResume(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPosition || !formData.name || !formData.email) return;

        setIsSubmitting(true);
        try {
            // Convert resume to base64 if exists
            let resumeData = '';
            if (resume) {
                const reader = new FileReader();
                resumeData = await new Promise((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(resume);
                });
            }

            const response = await fetch('/api/careers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    position: selectedPosition,
                    positionTitle: POSITIONS.find(p => p.id === selectedPosition)?.title,
                    resumeName: resume?.name,
                    resumeData,
                }),
            });

            if (response.ok) {
                setSubmitted(true);
            }
        } catch {
            // Handle error
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/90 backdrop-blur-sm border-b border-white/5">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/favicon/favicon-96x96.png" alt="HITROO" width={28} height={28} className="rounded-sm" />
                        <span className="text-sm font-medium text-white">HITROO</span>
                    </Link>
                    <Link href="/" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="h-3 w-3" /> Back
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF79C6]">Careers</span>
                    <h1 className="text-3xl md:text-4xl font-medium text-white mt-4">
                        Join the Revolution
                    </h1>
                    <p className="text-sm text-white/50 mt-4 max-w-xl mx-auto">
                        We are looking for passionate individuals who want to build the future of intelligent systems.
                        Not just another job—a chance to craft something extraordinary.
                    </p>
                </div>
            </section>

            {/* Internship Program */}
            <section className="py-16 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <Users className="h-5 w-5 text-[#FF79C6]" />
                        <h2 className="text-lg font-medium text-white">Internship & Probation Program</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 border border-white/10 rounded-xl">
                            <h3 className="text-sm font-medium text-white mb-3">3-Month Probation Window</h3>
                            <p className="text-xs text-white/50 leading-relaxed">
                                All positions start as an unpaid internship/probation period. This is your chance to learn
                                world-class skills and prove your potential. If your expertise aligns with our verticals
                                after 3 months, you will be offered a full-time role.
                            </p>
                            <p className="text-xs text-white/40 mt-4 italic">
                                Even if it does not work out, you will leave with invaluable hands-on industry experience.
                            </p>
                        </div>

                        <div className="p-6 border border-white/10 rounded-xl">
                            <h3 className="text-sm font-medium text-white mb-3">What You Get</h3>
                            <ul className="space-y-2 text-xs text-white/50">
                                <li className="flex items-start gap-2">
                                    <Check className="h-3 w-3 text-[#FF79C6] mt-0.5 flex-shrink-0" />
                                    <span>Hands-on industry experience with real projects</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-3 w-3 text-[#FF79C6] mt-0.5 flex-shrink-0" />
                                    <span>Access to world-class hardware and ML models—free</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-3 w-3 text-[#FF79C6] mt-0.5 flex-shrink-0" />
                                    <span>Structured mentorship: from stone to statue</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-3 w-3 text-[#FF79C6] mt-0.5 flex-shrink-0" />
                                    <span>Potential full-time role after successful completion</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Work Style */}
                    <div className="mt-8 p-6 border border-[#FF79C6]/20 rounded-xl bg-[#FF79C6]/5">
                        <h3 className="text-sm font-medium text-white mb-3">Work Style</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-xs text-white/60">
                            <div>
                                <p className="font-medium text-white/80 mb-1">85% Remote</p>
                                <p>Work from anywhere. Communication via Gather and Slack.</p>
                            </div>
                            <div>
                                <p className="font-medium text-white/80 mb-1">In-Person Meetings</p>
                                <p>Occasional client meetings or project-specific sessions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-16 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-lg font-medium text-white mb-8">Open Positions</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {POSITIONS.map((position) => {
                            const Icon = position.icon;
                            const isSelected = selectedPosition === position.id;
                            return (
                                <button
                                    key={position.id}
                                    onClick={() => setSelectedPosition(position.id)}
                                    className={`p-5 border rounded-xl text-left transition-all ${isSelected
                                            ? 'border-[#FF79C6] bg-[#FF79C6]/10'
                                            : 'border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon className={`h-4 w-4 ${isSelected ? 'text-[#FF79C6]' : 'text-white/50'}`} />
                                        <h3 className={`text-sm font-medium ${isSelected ? 'text-[#FF79C6]' : 'text-white'}`}>
                                            {position.title}
                                        </h3>
                                    </div>
                                    <p className="text-[11px] text-white/40">{position.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Application Form */}
            {submitted ? (
                <section className="py-20 px-6 border-t border-white/5">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FF79C6]/20 flex items-center justify-center">
                            <Check className="h-8 w-8 text-[#FF79C6]" />
                        </div>
                        <h2 className="text-xl font-medium text-white mb-3">Application Submitted!</h2>
                        <p className="text-sm text-white/50 mb-6">
                            Thank you for your interest in HITROO. We will review your application and get back to you soon.
                        </p>
                        <Link href="/" className="text-[10px] uppercase tracking-widest text-[#FF79C6] hover:text-white transition-colors">
                            Back to Home
                        </Link>
                    </div>
                </section>
            ) : (
                <section className="py-16 px-6 border-t border-white/5">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-lg font-medium text-white mb-2">Apply Now</h2>
                        <p className="text-xs text-white/40 mb-8">
                            {selectedPosition
                                ? `Applying for: ${POSITIONS.find(p => p.id === selectedPosition)?.title}`
                                : 'Select a position above to continue'}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50"
                                        placeholder="you@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">LinkedIn</label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50"
                                        placeholder="linkedin.com/in/yourprofile"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Portfolio / GitHub</label>
                                <input
                                    type="url"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50"
                                    placeholder="github.com/yourusername"
                                />
                            </div>

                            {/* Resume Upload */}
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Resume (PDF) *</label>
                                <label className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${resume ? 'border-[#FF79C6]/50 bg-[#FF79C6]/5' : 'border-white/10 hover:border-white/20'
                                    }`}>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    {resume ? (
                                        <>
                                            <Check className="h-4 w-4 text-[#FF79C6]" />
                                            <span className="text-sm text-[#FF79C6]">{resume.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 text-white/40" />
                                            <span className="text-sm text-white/40">Click to upload PDF resume</span>
                                        </>
                                    )}
                                </label>
                            </div>

                            {/* Why Questions */}
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Why HITROO? *</label>
                                <textarea
                                    name="whyHitroo"
                                    value={formData.whyHitroo}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50 resize-none"
                                    placeholder="What excites you about working at HITROO?"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Why this position? *</label>
                                <textarea
                                    name="whyPosition"
                                    value={formData.whyPosition}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF79C6]/50 resize-none"
                                    placeholder="Why are you the right fit for this role?"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Experience Level</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF79C6]/50"
                                    >
                                        <option value="">Select...</option>
                                        <option value="student">Student / Fresh Graduate</option>
                                        <option value="0-1">0-1 years</option>
                                        <option value="1-3">1-3 years</option>
                                        <option value="3+">3+ years</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Availability</label>
                                    <select
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF79C6]/50"
                                    >
                                        <option value="">Select...</option>
                                        <option value="immediate">Immediate</option>
                                        <option value="2weeks">Within 2 weeks</option>
                                        <option value="1month">Within 1 month</option>
                                        <option value="later">Later</option>
                                    </select>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!selectedPosition || !formData.name || !formData.email || !formData.phone || !resume || isSubmitting}
                                className="w-full py-4 bg-[#FF79C6] text-black text-xs uppercase tracking-widest font-medium rounded-lg hover:bg-[#FF79C6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Application'
                                )}
                            </button>

                            <p className="text-[10px] text-white/30 text-center">
                                By submitting, you agree to our internship terms. All applications are processed within 7 days.
                            </p>
                        </form>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <p className="text-[10px] text-white/20">© 2024 HITROO. All rights reserved.</p>
                    <Link href="/" className="text-[10px] text-white/30 hover:text-white transition-colors">
                        Back to Home
                    </Link>
                </div>
            </footer>
        </div>
    );
}
