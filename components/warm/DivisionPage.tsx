import type { Metadata } from 'next';
import FilmSection from './FilmSection';
import {
  Activity,
  BarChart3,
  Clock,
  Copy,
  EyeOff,
  FileSpreadsheet,
  FlaskConical,
  Gauge,
  Inbox,
  Keyboard,
  KeyRound,
  Layers,
  LayoutDashboard,
  Lock,
  MessageSquareWarning,
  Mic,
  MonitorPlay,
  ScanEye,
  ScrollText,
  Server,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { findDivision, getContent, getDivisionPage } from '@/lib/content';
import type { DivisionPageContent } from '@/lib/division-pages';
import type { Division, DivisionSlug } from '@/lib/site-data';
import { breadcrumbLd, divisionLd, faqLd, pageMetadata, webPageLd } from '@/lib/seo';
import { Engagements, FlowCard, SplitCards, StandardsCard } from './blocks';
import CapabilityExplorer from './CapabilityExplorer';
import { DivisionGallery } from './DivisionVisual';
import ClosingCta from './ClosingCta';
import FaqSection from './FaqSection';
import OtherDivisions from './OtherDivisions';
import PageIntro from './PageIntro';
import SignatureIntro from './SignatureIntro';
import StepCards from './StepCards';
import { TouchPill } from './WarmHeader';
import { PointCards, WSection } from './ui';

/** Icons for each page's three signs and six standards, in order. */
export const ICONS: Record<DivisionSlug, { signs: LucideIcon[]; commitments: LucideIcon[] }> = {
  software: { signs: [Copy, FileSpreadsheet, Shuffle], commitments: [MonitorPlay, Users, KeyRound, FlaskConical, ShieldCheck, EyeOff] },
  automation: { signs: [Keyboard, Inbox, FileSpreadsheet], commitments: [Server, Target, KeyRound, UserCheck, ScrollText, Layers] },
  ai: { signs: [MessageSquareWarning, Lock, ScanEye], commitments: [KeyRound, EyeOff, Server, Gauge, Activity, Users] },
  creatives: { signs: [Clock, Mic, BarChart3], commitments: [Sparkles, Mic, TrendingUp, LayoutDashboard, UserCheck, Users] },
};

/** A division and its page content (both from the database, or the built-in copy). */
export async function getDivisionContent(slug: DivisionSlug): Promise<{ p: DivisionPageContent; d: Division }> {
  const [p, divisions] = await Promise.all([getDivisionPage(slug), getContent('divisions')]);
  return { p, d: findDivision(divisions, slug)! };
}

/** A division page's structured data: the division as a Service, its questions, the page and its breadcrumb. */
export function DivisionLd({ p, d }: { p: DivisionPageContent; d: Division }) {
  return (
    <>
      <JsonLd data={divisionLd(d)} />
      <JsonLd data={faqLd(p.faq)} />
      <JsonLd data={webPageLd('WebPage', `hitroo ${d.name}`, `/${d.slug}`, p.description)} />
      <JsonLd data={breadcrumbLd([{ name: d.name, path: `/${d.slug}` }])} />
    </>
  );
}

export async function divisionMetadata(slug: DivisionSlug): Promise<Metadata> {
  const p = await getDivisionPage(slug);
  return pageMetadata({ title: p.metaTitle, description: p.description, path: `/${slug}` });
}

/**
 * A division's page: its name in glass, when to call us, what it builds (the explorer), how one process runs and
 * who does what (where it has them), the standards, how a project runs, ways to engage, questions, the other
 * divisions, and one closing action.
 */
export default async function DivisionPage({ slug }: { slug: DivisionSlug }) {
  const [{ p, d }, film] = await Promise.all([getDivisionContent(slug), getContent(`film:${slug}`)]);
  return (
    <>
      <DivisionLd p={p} d={d} />

      {p.hero ? (
        <SignatureIntro word={slug} caption={`hitroo ${d.name}`} title={p.title} lede={p.lede} action={<TouchPill label="Book a free call" />} hero={p.hero} />
      ) : (
        <>
          <PageIntro word={slug} caption={`hitroo ${d.name}`} title={p.title} lede={p.lede} action={<TouchPill label="Book a free call" />} />
          <DivisionGallery gallery={p.gallery} />
        </>
      )}

      {/* The division's film, right under the opening */}
      <FilmSection film={film} />

      <WSection id="signs-title" caption="When to call us" title={p.signs.title} lede={p.signs.lede}>
        <PointCards items={p.signs.items} icons={ICONS[slug].signs} />
      </WSection>

      <WSection id="build-title" caption="What we build" title={p.build.title}>
        <CapabilityExplorer items={p.build.items} id="capability" />
      </WSection>

      {p.flow && (
        <WSection id="flow-title" caption={p.flow.caption} title={p.flow.title}>
          <FlowCard steps={p.flow.steps} />
        </WSection>
      )}

      {p.split && (
        <WSection id="split-title" caption={p.split.caption} title={p.split.title}>
          <SplitCards left={p.split.left} right={p.split.right} />
        </WSection>
      )}

      <StandardsCard id="standards-title" caption="How we deliver" title="Standards we keep on every project." items={p.commitments} icons={ICONS[slug].commitments} image={p.standardsImage} />

      {p.steps && (
        <WSection id="steps-title" caption="Process" title={p.steps.title}>
          <StepCards steps={p.steps.items} />
        </WSection>
      )}

      {p.engagements && (
        <WSection id="engage-title" caption="Ways to work with us" title="Three ways to engage." lede="Every engagement starts with a free call.">
          <Engagements items={p.engagements} />
        </WSection>
      )}

      <FaqSection items={p.faq} title={`Questions about ${d.name === 'AI' ? 'AI' : d.name.toLowerCase()}`} />

      <OtherDivisions current={slug} />

      <ClosingCta title={p.closing.title} line={p.closing.line} label="Book a free call" />
    </>
  );
}
