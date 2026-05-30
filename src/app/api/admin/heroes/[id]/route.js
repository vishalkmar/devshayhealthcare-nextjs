import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { heroData, mediaRows } from '../route';

const include = { media: { orderBy: { sortOrder: 'asc' } } };

export async function GET(req, { params }) {
  const item = await prisma.hero.findUnique({ where: { id: Number(params.id) }, include });
  if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: item });
}

export async function PUT(req, { params }) {
  const { error } = requireAdmin();
  if (error) return error;
  try {
    const body = await req.json();
    const updated = await prisma.hero.update({
      where: { id: Number(params.id) },
      data: { ...heroData(body), media: { deleteMany: {}, create: mediaRows(body) } },
      include,
    });
    return NextResponse.json({ data: updated });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const { error } = requireAdmin();
  if (error) return error;
  await prisma.hero.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ data: { ok: true } });
}
