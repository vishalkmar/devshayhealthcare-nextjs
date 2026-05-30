import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { uniqueSlug, toInt, toBool, toNum } from '@/lib/helpers';

const include = { category: true, images: { orderBy: { sortOrder: 'asc' } } };

export async function productData(body, id = null) {
  return {
    name: body.name,
    slug: await uniqueSlug('product', body.slug || body.name, id),
    categoryId: body.categoryId ? Number(body.categoryId) : null,

    brandName: body.brandName || null,
    genericName: body.genericName || null,
    manufacturer: body.manufacturer || null,
    sku: body.sku || null,
    hsnCode: body.hsnCode || null,
    form: body.form || null,
    strength: body.strength || null,
    packSize: body.packSize || null,
    packagingType: body.packagingType || null,
    schedule: body.schedule || null,

    saltComposition: body.saltComposition || null,
    ingredients: body.ingredients || null,
    uses: body.uses || null,
    symptoms: body.symptoms || null,
    howToUse: body.howToUse || null,
    sideEffects: body.sideEffects || null,
    warnings: body.warnings || null,
    storage: body.storage || null,
    shortDescription: body.shortDescription || null,
    description: body.description || null,

    pricePerStrip: toNum(body.pricePerStrip),
    pricePer10: toNum(body.pricePer10),
    pricePerTablet: toNum(body.pricePerTablet),
    pricePerBox: toNum(body.pricePerBox),
    mrp: toNum(body.mrp),
    currency: body.currency || 'INR',
    minOrderQty: toInt(body.minOrderQty, 1),
    unitsPerStrip: toNum(body.unitsPerStrip) === null ? null : toInt(body.unitsPerStrip),
    stockStatus: body.stockStatus || 'in_stock',
    prescriptionRequired: toBool(body.prescriptionRequired),

    shelfLife: body.shelfLife || null,
    countryOfOrigin: body.countryOfOrigin || 'India',

    primaryImage: body.primaryImage || null,

    isFeatured: toBool(body.isFeatured),
    isPopular: toBool(body.isPopular),
    isActive: body.isActive === undefined ? true : toBool(body.isActive),
    metaTitle: body.metaTitle || null,
    metaDescription: body.metaDescription || null,
    sortOrder: toInt(body.sortOrder),
  };
}

export function imageRows(body) {
  return (body.images || []).map((m, i) => ({
    url: typeof m === 'string' ? m : m.url,
    alt: typeof m === 'string' ? null : m.alt || null,
    sortOrder: typeof m === 'string' ? i : (m.sortOrder ?? i),
  }));
}

export async function GET() {
  try {
    const items = await prisma.product.findMany({ include, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
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
    if (!body.name) return NextResponse.json({ message: 'Product name is required' }, { status: 400 });
    const created = await prisma.product.create({
      data: { ...(await productData(body)), images: { create: imageRows(body) } },
      include,
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
