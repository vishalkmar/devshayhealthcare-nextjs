// Tiny CRUD factory for simple single-table admin resources (Faq, Cta,
// Category). Complex resources with child rows (Hero, Product, Testimonial,
// PromoBanner) get hand-written route handlers instead.
import { NextResponse } from 'next/server';
import prisma from './prisma';
import { requireAdmin } from './auth';

export function makeCollection({ model, include, orderBy = [{ sortOrder: 'asc' }, { id: 'desc' }], beforeWrite }) {
  async function GET() {
    try {
      const items = await prisma[model].findMany({ include, orderBy });
      return NextResponse.json({ data: items });
    } catch (e) {
      return NextResponse.json({ message: e.message }, { status: 500 });
    }
  }
  async function POST(req) {
    const { error } = requireAdmin();
    if (error) return error;
    try {
      const body = await req.json();
      const data = beforeWrite ? await beforeWrite(body) : body;
      const created = await prisma[model].create({ data, include });
      return NextResponse.json({ data: created }, { status: 201 });
    } catch (e) {
      return NextResponse.json({ message: e.message }, { status: 400 });
    }
  }
  return { GET, POST };
}

export function makeItem({ model, include, beforeWrite }) {
  async function GET(req, { params }) {
    try {
      const item = await prisma[model].findUnique({ where: { id: Number(params.id) }, include });
      if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 });
      return NextResponse.json({ data: item });
    } catch (e) {
      return NextResponse.json({ message: e.message }, { status: 500 });
    }
  }
  async function PUT(req, { params }) {
    const { error } = requireAdmin();
    if (error) return error;
    try {
      const body = await req.json();
      const data = beforeWrite ? await beforeWrite(body, Number(params.id)) : body;
      const updated = await prisma[model].update({ where: { id: Number(params.id) }, data, include });
      return NextResponse.json({ data: updated });
    } catch (e) {
      return NextResponse.json({ message: e.message }, { status: 400 });
    }
  }
  async function DELETE(req, { params }) {
    const { error } = requireAdmin();
    if (error) return error;
    try {
      await prisma[model].delete({ where: { id: Number(params.id) } });
      return NextResponse.json({ data: { ok: true } });
    } catch (e) {
      return NextResponse.json({ message: e.message }, { status: 400 });
    }
  }
  return { GET, PUT, DELETE };
}
