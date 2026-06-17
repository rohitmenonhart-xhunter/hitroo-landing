import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About HITROO - Our Mission & Vision',
    description: 'Learn about HITROO — a Chennai-based technology studio building intelligent software, apps, and AI. Our mission, vision, capabilities, and team.',
    keywords: ['HITROO about', 'software studio', 'AI company', 'Chennai technology', 'intelligent systems'],
    openGraph: {
        title: 'About HITROO - Our Mission & Vision',
        description: 'Learn about HITROO — a Chennai-based technology studio building intelligent software, apps, and AI.',
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
