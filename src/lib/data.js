// Server-side data access used directly by Server Components (public pages).
// Each function is defensive: on any DB error it returns an empty/neutral
// value so the public site still renders (useful before the DB is seeded).
import prisma from './prisma';
import { withDefaults } from './siteContent';

// Read an editable page-content block (section headings, badges, hero copy).
// Falls back to CONTENT_DEFAULTS when the row is missing or the DB errors.
export async function getContent(key) {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: `content:${key}` } });
    return withDefaults(key, row?.value);
  } catch {
    return withDefaults(key, null);
  }
}

const DEFAULT_SITE = {
  company: 'Devrishi Pharma',
  tagline: 'Trusted B2B pharmaceutical supplier',
  description: 'Bulk supplier of quality medicines and pharmaceutical products to pharmacies and distributors.',
  logo: '',
  emails: [],
  phones: [],
  addresses: [],
  socials: [],
  whatsappNumber: '',
  mapUrl: '',
};

export async function getSiteDetails() {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: 'site_details' } });
    return { ...DEFAULT_SITE, ...(row?.value || {}) };
  } catch {
    return DEFAULT_SITE;
  }
}

export async function getHeroes(pageKey = 'home') {
  try {
    return await prisma.hero.findMany({
      where: { pageKey, isActive: true },
      include: { media: { orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  } catch {
    return [];
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    });
  } catch {
    return [];
  }
}

export async function getProducts({ categoryId = null, featured = null, take = null } = {}) {
  try {
    const where = { isActive: true };
    if (categoryId) where.categoryId = Number(categoryId);
    if (featured) where.isFeatured = true;
    return await prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { category: true },
      ...(take ? { take } : {}),
    });
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
  } catch {
    return null;
  }
}

export async function getRelatedProducts(product, take = 4) {
  if (!product) return [];
  try {
    // First, products from the same category.
    let related = product.categoryId
      ? await prisma.product.findMany({
          where: { isActive: true, id: { not: product.id }, categoryId: product.categoryId },
          include: { category: true },
          orderBy: { createdAt: 'desc' },
          take,
        })
      : [];

    // Fall back to other products if the category didn't fill the row.
    if (related.length < take) {
      const excludeIds = [product.id, ...related.map((r) => r.id)];
      const extra = await prisma.product.findMany({
        where: { isActive: true, id: { notIn: excludeIds } },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take: take - related.length,
      });
      related = [...related, ...extra];
    }
    return related;
  } catch {
    return [];
  }
}

export async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { isActive: true },
      include: { media: { orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }],
    });
  } catch {
    return [];
  }
}

export async function getPromoBanners(page = 'home') {
  try {
    return await prisma.promoBanner.findMany({
      where: { isActive: true, page: { in: [page, 'all'] } },
      include: { slides: { orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  } catch {
    return [];
  }
}

export async function getFaqs(page = 'home') {
  try {
    return await prisma.faq.findMany({
      where: { isActive: true, page: { in: [page, 'all'] } },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  } catch {
    return [];
  }
}

export async function getCta(page = 'home') {
  try {
    return await prisma.cta.findFirst({
      where: { isActive: true, page: { in: [page, 'all'] } },
      orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }],
    });
  } catch {
    return null;
  }
}

// A single CTA to show on every page (above the footer). Prefers a CTA whose
// page is "all"; otherwise falls back to the first active one.
export async function getGlobalCta() {
  try {
    const all = await prisma.cta.findFirst({
      where: { isActive: true, page: 'all' },
      orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }],
    });
    if (all) return all;
    return await prisma.cta.findFirst({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }],
    });
  } catch {
    return null;
  }
}

export async function getAboutSections() {
  try {
    const rows = await prisma.aboutSection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    const map = {};
    rows.forEach((r) => { map[r.sectionKey] = r; });
    return map;
  } catch {
    return {};
  }
}
