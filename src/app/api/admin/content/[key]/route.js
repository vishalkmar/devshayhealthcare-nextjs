import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { CONTENT_KEYS, withDefaults } from '@/lib/siteContent';

function settingKey(key) {
  return `content:${key}`;
}

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  const { key } = params;
  if (!CONTENT_KEYS.includes(key)) return NextResponse.json({ message: 'Unknown content key' }, { status: 404 });
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: settingKey(key) } });
    return NextResponse.json({ data: withDefaults(key, row?.value) });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { error } = requireAdmin();
  if (error) return error;
  const { key } = params;
  if (!CONTENT_KEYS.includes(key)) return NextResponse.json({ message: 'Unknown content key' }, { status: 404 });
  try {
    const value = await req.json();
    const k = settingKey(key);
    const row = await prisma.siteSetting.upsert({
      where: { key: k },
      update: { value },
      create: { key: k, value },
    });
    return NextResponse.json({ data: row.value });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
