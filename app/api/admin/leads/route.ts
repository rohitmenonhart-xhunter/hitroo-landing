import { NextRequest, NextResponse } from 'next/server';
import { recentApplications, recentLeads } from '@/lib/data/analytics';
import { noStore, requireAdmin } from '../auth';

/** Recent enquiries and job applications (without resume files). */
export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const [leads, applications] = await Promise.all([recentLeads(), recentApplications()]);
  return NextResponse.json({ leads, applications }, noStore);
}
