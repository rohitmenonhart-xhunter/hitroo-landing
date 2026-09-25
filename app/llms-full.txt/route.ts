import { llmsFullTxt } from '@/lib/llms';

export const revalidate = 600;

export function GET() {
  return llmsFullTxt();
}
