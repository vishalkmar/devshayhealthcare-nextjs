import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { toInt, toBool, toNum } from '@/lib/helpers';

const include = { media: { orderBy: { sortOrder: 'asc' } } };

export function testimonialData(body) {
  return {
    type: body.type || 'text',
    authorName: body.authorName || null,
    authorTitle: body.authorTitle || null,
    authorLocation: body.authorLocation || null,
    authorAvatar: body.authorAvatar || null,
    rating: toNum(body.rating) === null ? null : toInt(body.rating),
    content: body.content || null,
    videoUrl: body.videoUrl || null,
    videoPoster: body.videoPoster || null,
    mediaHeight: toInt(body.mediaHeight, 240),
    mediaWidth: toNum(body.mediaWidth) === null ? null : toInt(body.mediaWidth),
    sortOrder: toInt(body.sortOrder),
    isActive: body.isActive === undefined ? true : toBool(body.isActive),
  };
}

export function mediaRows(body) {
  return (body.media || []).map((m, i) => ({
    url: m.url,
    mediaType: m.mediaType || 'image',
    sortOrder: m.sortOrder ?? i,
  }));
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await prisma.testimonial.findMany({ include, orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }] });
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
    const created = await prisma.testimonial.create({
      data: { ...testimonialData(body), media: { create: mediaRows(body) } },
      include,
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
