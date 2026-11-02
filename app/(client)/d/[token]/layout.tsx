import ClientShell from '@/components/client/ClientShell';
import { loadOverview } from '@/lib/client/load';

export default async function DashboardLayout({ params, children }: { params: { token: string }; children: React.ReactNode }) {
  const overview = await loadOverview(params.token);
  return (
    <ClientShell token={params.token} overview={overview}>
      {children}
    </ClientShell>
  );
}
