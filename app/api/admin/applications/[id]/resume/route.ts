import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { applicationResume } from '@/lib/data/analytics';
import { requireAdmin } from '../../../auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const id = z.string().uuid().safeParse(params.id);
  if (!id.success) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const row = await applicationResume(id.data);
  if (!row?.resume) return NextResponse.json({ error: 'No resume' }, { status: 404 });
  const name = (row.resume_name || 'resume.pdf').replace(/[^\w.\- ]/g, '_');
  return new NextResponse(new Uint8Array(row.resume), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${name}"`, 'Cache-Control': 'no-store' },
  });
}
