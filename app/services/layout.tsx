import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Services — Software, Apps, AI & Vision',
    description:
        'HITROO services: custom software development, mobile & desktop apps, AI model development & training, AI automation, computer-vision & quality inspection, software audit & AI modernization, and managed services.',
    keywords: [
        'software development', 'app development', 'desktop app development', 'AI model development',
        'AI automation', 'computer vision', 'quality inspection', 'software audit', 'AI modernization',
        'managed services', 'HITROO services', 'Chennai software studio',
    ],
    alternates: { canonical: '/services' },
    openGraph: {
        title: 'HITROO Services — Software, Apps, AI & Vision',
        description:
            'Custom software, mobile & desktop apps, AI models, automation, computer vision, modernization, and managed services — end to end.',
        url: '/services',
    },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
