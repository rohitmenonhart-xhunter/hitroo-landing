import { Gauge, Layers, ShieldCheck, Timer, TrendingUp, Zap } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import ClosingCta from '@/components/warm/ClosingCta';
import FaqSection from '@/components/warm/FaqSection';
import PageIntro from '@/components/warm/PageIntro';
import { SplitCards } from '@/components/warm/blocks';
import { PointCards, Statement, WSection } from '@/components/warm/ui';
import { breadcrumbLd, faqLd } from '@/lib/seo';

const AI_DOES = ['Drafts a prototype in hours', 'Explores ideas fast', 'Writes routine code'];
const TEAM_DOES = ['Understands your business', 'Designs the architecture and security', 'Tests, launches and supports it for years'];

const HOW = [
  { title: 'Inside our architecture', text: 'AI works within a structure we design and control, so we always know what’s happening.' },
  { title: 'For faster iterations', text: 'Every cycle speeds up: prototype, feedback, change.' },
  { title: 'Behind layers of tests', text: 'Every change passes layers of testing, so speed never costs quality.' },
];

const FAQ = [
  { q: 'Is AI a threat to hitroo?', a: 'No. AI makes us faster. It doesn’t replace what we do: AI can draft a prototype in hours, but software a business runs on still takes a team.' },
  { q: 'How does hitroo use AI?', a: HOW.map((h) => `${h.title}: ${h.text}`).join(' ') },
  { q: 'Will AI replace software companies?', a: 'No. Smartphones didn’t replace the computer; they multiplied the software the world needs. AI will do the same. It makes the good software companies faster.' },
];

export default function AiPerspectivePage() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <JsonLd data={breadcrumbLd([{ name: 'Our view on AI', path: '/ai-perspective' }])} />
      <PageIntro word="perspective" caption="Our view" title="Is AI a threat to hitroo?" lede="No. AI makes us faster. It doesn’t replace what we do." />

      <Statement id="can-title" caption="The short answer" lines={['AI can draft a prototype in hours.', 'Software a business runs on still takes a team.']} />

      <WSection id="split-title" caption="Who does what" title="What AI does well, and what still takes a team.">
        <SplitCards left={{ label: 'What AI does well', items: AI_DOES }} right={{ label: 'What still takes a team', items: TEAM_DOES }} />
      </WSection>

      <WSection id="how-title" caption="How we use AI" title="Fast, but never careless." lede="Three rules for how AI works inside hitroo.">
        <PointCards items={HOW} icons={[Layers, Timer, ShieldCheck]} />
      </WSection>

      <Statement
        id="pattern-title"
        caption="The pattern"
        lines={['Smartphones didn’t replace the computer. They multiplied the software the world needs.', 'AI will do the same.']}
      />

      <WSection id="you-title" caption="What it means for you" title="Good news, if you’re building something.">
        <PointCards
          icons={[Zap, TrendingUp, Gauge]}
          items={[
            { title: 'Faster', text: 'Prototypes in hours, working software sooner.' },
            { title: 'Fairer', text: 'More of your problems solved for the same budget.' },
            { title: 'Still safe', text: 'Every change tested, by people who answer for it.' },
          ]}
        />
      </WSection>

      <FaqSection items={FAQ} title="Questions about AI" />

      <ClosingCta title="AI makes the good software companies faster." line="More of your problems solved, faster, at a fair price." />
    </>
  );
}
