import PageIntro from '@/components/warm/PageIntro';
import { TouchPill } from '@/components/warm/WarmHeader';
import WarmShell from '@/components/warm/WarmShell';

export default function NotFound() {
  return (
    <WarmShell>
      <PageIntro word="404" caption="Page not found" title="This page took a different road." lede="The link may be old, or the page has moved." action={<TouchPill href="/" label="Go home" />} />
    </WarmShell>
  );
}
