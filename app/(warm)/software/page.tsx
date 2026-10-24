import DivisionPage, { divisionMetadata } from '@/components/warm/DivisionPage';

export const generateMetadata = () => divisionMetadata('software');

export default function SoftwarePage() {
  return <DivisionPage slug="software" />;
}
