import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { toInt, toBool } from '@/lib/helpers';

const include = { slides: { orderBy: { sortOrder: 'asc' } } };

export function bannerData(body) {
  return {
    name: body.name || 'Promo banner',
    type: body.type || 'image-single',
    page: body.page || 'home',
    position: body.position || 'below-products',
    heading: body.heading || null,
    description: body.description || null,
    ctaLabel: body.ctaLabel || null,
    ctaUrl: body.ctaUrl || null,
    heightPx: toInt(body.heightPx, 360),
    widthMode: body.widthMode || 'container',
    autoplay: body.autoplay === undefined ? true : toBool(body.autoplay),
    intervalMs: toInt(body.intervalMs, 5000),
    isActive: body.isActive === undefined ? true : toBool(body.isActive),
    sortOrder: toInt(body.sortOrder),
  };
}

export function slideRows(body) {
  return (body.slides || []).map((s, i) => ({
    url: s.url,
    mediaType: s.mediaType || 'image',
    heading: s.heading || null,
    subheading: s.subheading || null,
    ctaLabel: s.ctaLabel || null,
    ctaUrl: s.ctaUrl || null,
    sortOrder: s.sortOrder ?? i,
  }));
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await prisma.promoBanner.findMany({ include, orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }] });
    return NextResponse.json({ data: items });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  const { error } = requireAdmin();
  if (error) return error;
  try {
    const body = await req.json();
    const created = await prisma.promoBanner.create({
      data: { ...bannerData(body), slides: { create: slideRows(body) } },
      include,
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
