import { NextRequest, NextResponse } from 'next/server';
import { getInsights } from '@/lib/data/analytics';
import { noStore, requireAdmin } from '../auth';

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const days = Number(request.nextUrl.searchParams.get('days') ?? 30) || 30;
  return NextResponse.json(await getInsights(days), noStore);
}
