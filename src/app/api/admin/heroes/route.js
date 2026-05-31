import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { toInt, toBool } from '@/lib/helpers';

const include = { media: { orderBy: { sortOrder: 'asc' } } };

export function heroData(body) {
  return {
    name: body.name || 'Hero',
    type: body.type || 'image_text',
    pageKey: body.pageKey || 'home',
    isActive: body.isActive === undefined ? true : toBool(body.isActive),
    heading: body.heading || null,
    subheading: body.subheading || null,
    ctaLabel: body.ctaLabel || null,
    ctaUrl: body.ctaUrl || null,
    textPosition: body.textPosition || 'center',
    textColor: body.textColor || '#ffffff',
    overlayOpacity: toInt(body.overlayOpacity, 35),
    autoplay: body.autoplay === undefined ? true : toBool(body.autoplay),
    intervalMs: toInt(body.intervalMs, 5000),
    height: body.height || 'lg',
    sortOrder: toInt(body.sortOrder),
  };
}

export function mediaRows(body) {
  return (body.media || []).map((m, i) => ({
    url: m.url,
    mediaType: m.mediaType || 'image',
    alt: m.alt || null,
    caption: m.caption || null,
    sortOrder: m.sortOrder ?? i,
  }));
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await prisma.hero.findMany({ include, orderBy: [{ pageKey: 'asc' }, { sortOrder: 'asc' }] });
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
    const created = await prisma.hero.create({
      data: { ...heroData(body), media: { create: mediaRows(body) } },
      include,
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
