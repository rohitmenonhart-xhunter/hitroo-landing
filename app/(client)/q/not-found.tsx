import PageHeader from '@/components/client/PageHeader';

export default function QuoteNotFound() {
  return (
    <PageHeader caption="Quote" title="This link isn't valid">
      <p className="text-[17px] font-medium text-char/70">Ask your contact at hitroo for a fresh one.</p>
    </PageHeader>
  );
}
