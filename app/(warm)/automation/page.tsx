import DivisionPage, { divisionMetadata } from '@/components/warm/DivisionPage';

export const generateMetadata = () => divisionMetadata('automation');

export default function AutomationPage() {
  return <DivisionPage slug="automation" />;
}
