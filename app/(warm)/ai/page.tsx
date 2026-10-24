import DivisionPage, { divisionMetadata } from '@/components/warm/DivisionPage';

export const generateMetadata = () => divisionMetadata('ai');

export default function AiPage() {
  return <DivisionPage slug="ai" />;
}
