import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers — Join HITROO',
    description:
        'Build the future of software and AI at HITROO. Roles in full-stack, frontend, backend, hardware (mechanical & electronics), and ML/AI — with a 3-month mentorship program and a path to full-time.',
    keywords: ['HITROO careers', 'software jobs Chennai', 'AI jobs', 'ML engineer jobs', 'full stack developer job', 'frontend job', 'backend job', 'hardware engineer job', 'tech internship India'],
    alternates: { canonical: '/careers' },
    openGraph: {
        title: 'Careers — Join HITROO',
        description: 'Roles in software, AI/ML, and hardware engineering. A 3-month mentorship program with a path to full-time.',
        url: '/careers',
    },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
    return children;
}
