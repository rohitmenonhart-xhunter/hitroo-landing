import { BrainCircuit, Cpu, ScanEye, Workflow } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import ClosingCta from '@/components/warm/ClosingCta';
import PageIntro from '@/components/warm/PageIntro';
import RecentPosts from '@/components/warm/RecentPosts';
import StepCards from '@/components/warm/StepCards';
import { LinkCards, PointCards, Statement, WSection } from '@/components/warm/ui';
import { listPosts } from '@/lib/data/posts';
import { breadcrumbLd, webPageLd } from '@/lib/seo';

export const revalidate = 300;

const FOCUS = [
  { title: 'Applied AI', text: 'Models that hold up in production.' },
  { title: 'Computer vision', text: 'Models that see and inspect the real world.' },
  { title: 'Automation', text: 'Agents that take real work off people.' },
  { title: 'Systems', text: 'Making slow, fragile software fast and reliable.' },
];

const PATH: [string, string][] = [
  ['A real question', 'Taken from a real business problem.'],
  ['Experiments', 'Small tests that prove or kill an idea fast.'],
  ['A prototype', 'A working version on real data.'],
  ['A product', 'Built into what our divisions ship.'],
];

export default async function ResearchPage() {
  const posts = await listPosts(undefined, 4);
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Research', '/research', 'Applied AI, vision and systems research that ships into real products.')} />
      <JsonLd data={breadcrumbLd([{ name: 'Research', path: '/research' }])} />
      <PageIntro word="research" caption="Research" title="We research the hard problems." lede="Applied AI, vision and systems work that ships into real products." />

      <Statement id="approach-title" caption="How we work" lines={['We study real business problems, especially the hard ones.', 'Then we ship the answers as product.']} />

      <WSection id="focus-title" caption="Focus areas" title="Four fields we study." lede="Each one feeds straight into what our divisions build.">
        <PointCards items={FOCUS} icons={[BrainCircuit, ScanEye, Workflow, Cpu]} columns={4} />
      </WSection>

      <WSection id="path-title" caption="From question to product" title="How research becomes something you can use." lede="Every study has to end in something that works.">
        <StepCards steps={PATH} />
      </WSection>

      <WSection id="where-title" caption="Where it shows up" title="See it at work.">
        <LinkCards
          items={[
            { href: '/ai', title: 'AI', text: 'Custom models and vision built on this research.' },
            { href: '/automation', title: 'Automation', text: 'Agents that take real work off people.' },
            { href: '/services/vision-systems', title: 'Vision systems', text: 'Cameras and AI that inspect quality on the line.' },
            { href: '/ai-perspective', title: 'Our view on AI', text: 'How we use AI, and why it’s good news.' },
          ]}
        />
      </WSection>

      <RecentPosts posts={posts} title="What we’re thinking about" />

      <ClosingCta title="Got a problem worth solving?" line="Tell us about it. We reply within a day." label="Talk to us" />
    </>
  );
}
