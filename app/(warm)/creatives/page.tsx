import CapabilityExplorer from '@/components/warm/CapabilityExplorer';
import ClosingCta from '@/components/warm/ClosingCta';
import { DivisionLd, ICONS, divisionMetadata, getDivisionContent } from '@/components/warm/DivisionPage';
import FaqSection from '@/components/warm/FaqSection';
import FilmSection from '@/components/warm/FilmSection';
import OtherDivisions from '@/components/warm/OtherDivisions';
import { TouchPill } from '@/components/warm/WarmHeader';
import { SplitCards, StandardsCard } from '@/components/warm/blocks';
import KineticLine from '@/components/warm/reels/KineticLine';
import LoopTrack from '@/components/warm/reels/LoopTrack';
import ReelsHero from '@/components/warm/reels/ReelsHero';
import VideoShowcase from '@/components/warm/reels/VideoShowcase';
import WinnerReels from '@/components/warm/reels/WinnerReels';
import { PointCards, WSection } from '@/components/warm/ui';
import { getContent } from '@/lib/content';

export const generateMetadata = () => divisionMetadata('creatives');

/**
 * Creatives' signature page: a fan of reels in the opening, then one finished showcase video, the monthly cycle as a loop, the best performer and its trending variations, and a line that slides with the
 * scroll; the frame stays hitroo. Copy: `division:creatives`; reels and the page's own lines: `page:creatives`; the video: `video:creatives`.
 */
export default async function CreativesPage() {
  const [{ p, d }, c, video, film] = await Promise.all([getDivisionContent('creatives'), getContent('page:creatives'), getContent('video:creatives'), getContent('film:creatives')]);
  return (
    <>
      <DivisionLd p={p} d={d} />

      <ReelsHero title={p.title} lede={p.lede} action={<TouchPill label={c.action} />} reels={c.fan} isNew={d.isNew ?? undefined} />

      {/* The Creatives film, right under the opening */}
      <FilmSection film={film} />

      <VideoShowcase video={video} copy={c.showcase} />

      <WSection id="signs-title" caption="When to call us" title={p.signs.title} lede={p.signs.lede}>
        <PointCards items={p.signs.items} icons={ICONS.creatives.signs} />
      </WSection>

      {p.flow && (
        <WSection id="flow-title" caption={p.flow.caption} title={p.flow.title}>
          <LoopTrack steps={p.flow.steps} />
        </WSection>
      )}

      <WSection id="winner-title" caption={c.winner.caption} title={c.winner.title} lede={c.winner.lede}>
        <WinnerReels reel={c.winner.reel} notes={c.winner.notes} />
      </WSection>

      <KineticLine id="kinetic-title" lines={c.kinetic} />

      <WSection id="build-title" caption="What we do" title={p.build.title}>
        <CapabilityExplorer items={p.build.items} id="capability" />
      </WSection>

      {p.split && (
        <WSection id="split-title" caption={p.split.caption} title={p.split.title}>
          <SplitCards left={p.split.left} right={p.split.right} />
        </WSection>
      )}

      <StandardsCard id="standards-title" caption={c.standards.caption} title={c.standards.title} items={p.commitments} icons={ICONS.creatives.commitments} />

      <FaqSection items={p.faq} title="Questions about creatives" />

      <OtherDivisions current="creatives" />

      <ClosingCta title={p.closing.title} line={p.closing.line} label="Book a free call" />
    </>
  );
}
