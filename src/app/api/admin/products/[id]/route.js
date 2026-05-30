import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { productData, imageRows } from '../route';

const include = { category: true, images: { orderBy: { sortOrder: 'asc' } } };

export async function GET(req, { params }) {
  const item = await prisma.product.findUnique({ where: { id: Number(params.id) }, include });
  if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: item });
}

export async function PUT(req, { params }) {
  const { error } = requireAdmin();
  if (error) return error;
  try {
    const id = Number(params.id);
    const body = await req.json();
    const updated = await prisma.product.update({
      where: { id },
      data: { ...(await productData(body, id)), images: { deleteMany: {}, create: imageRows(body) } },
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
  await prisma.product.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ data: { ok: true } });
}
