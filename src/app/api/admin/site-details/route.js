import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const KEY = 'site_details';

export async function GET() {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: KEY } });
    return NextResponse.json({ data: row?.value || {} });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const { error } = requireAdmin();
  if (error) return error;
  try {
    const value = await req.json();
    const row = await prisma.siteSetting.upsert({
      where: { key: KEY },
      update: { value },
      create: { key: KEY, value },
    });
    return NextResponse.json({ data: row.value });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
