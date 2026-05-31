// Dynamic sitemap — Next.js App Router serves this at /sitemap.xml.
// It lists every public, crawlable page: the static pages plus one entry per
// active product (pulled live from the DB so newly-added products show up
// automatically). Admin/API routes are intentionally excluded.
import prisma from '@/lib/prisma';
import { getBaseUrl } from '@/lib/siteUrl';

// Always build fresh from the DB (and the live request host) so new/removed
// products and the correct domain are reflected without a redeploy.
export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const base = getBaseUrl();
  const now = new Date();

  // Static pages with sensible crawl priorities.
  const staticRoutes = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/products', changeFrequency: 'daily', priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  ].map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Every active product detail page (/products/[slug]).
  let productRoutes = [];
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
    productRoutes = products
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${base}/products/${p.slug}`,
        lastModified: p.updatedAt || now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
  } catch {
    // If the DB is unavailable at build/request time, still serve the static
    // routes so the sitemap never 500s.
    productRoutes = [];
  }

  return [...staticRoutes, ...productRoutes];
}
