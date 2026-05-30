import { NextResponse } from 'next/server';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ data: null }, { status: 401 });
  return NextResponse.json({ data: admin });
}
