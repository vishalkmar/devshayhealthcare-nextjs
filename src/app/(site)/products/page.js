import ProductsBrowser from '@/components/site/ProductsBrowser';
import PageBanner from '@/components/site/PageBanner';
import { getCategories, getProducts, getSiteDetails, getContent } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const [site, content] = await Promise.all([getSiteDetails(), getContent('products_page')]);
  const name = site.company || 'Devshay Healthcare';
  return {
    title: content.heroTitle || 'Products',
    description: content.heroSubtitle || `Browse the full range of bulk pharmaceutical products available from ${name}.`,
    keywords: [name, 'products', 'medicines', 'tablets', 'capsules', 'bulk pharma products'],
    alternates: { canonical: '/products' },
  };
}

export default async function ProductsPage() {
  const [categories, products, site, content] = await Promise.all([
    getCategories(),
    getProducts({}),
    getSiteDetails(),
    getContent('products_page'),
  ]);

  // split the title so the last word gets the highlight/typing treatment
  const parts = (content.heroTitle || 'Our Products').split(' ');
  const last = parts.pop();
  const lead = parts.join(' ');

  return (
    <>
      <PageBanner title={lead} typeWords={[last]} subtitle={content.heroSubtitle} />
      <section className="container-x pb-16 pt-6">
        <ProductsBrowser categories={categories} products={products} whatsappNumber={site.whatsappNumber} />
      </section>
    </>
  );
}
