import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { toBool, toInt } from '@/lib/helpers';

export async function GET() {
  try {
    const rows = await prisma.aboutSection.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json({ data: rows });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

// Upsert a single section by its sectionKey.
export async function PUT(req) {
  const { error } = requireAdmin();
  if (error) return error;
  try {
    const body = await req.json();
    if (!body.sectionKey) return NextResponse.json({ message: 'sectionKey required' }, { status: 400 });
    const data = {
      eyebrow: body.eyebrow || null,
      heading: body.heading || null,
      subheading: body.subheading || null,
      body: body.body || null,
      imageUrl: body.imageUrl || null,
      data: body.data ?? null,
      isActive: body.isActive === undefined ? true : toBool(body.isActive),
      sortOrder: toInt(body.sortOrder),
    };
    const row = await prisma.aboutSection.upsert({
      where: { sectionKey: body.sectionKey },
      update: data,
      create: { sectionKey: body.sectionKey, ...data },
    });
    return NextResponse.json({ data: row });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
