import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import ProductGallery from '@/components/site/ProductGallery';
import ProductBooking from '@/components/site/ProductBooking';
import ProductCarousel from '@/components/site/ProductCarousel';
import { getProductBySlug, getRelatedProducts, getSiteDetails } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product not found' };
  const desc = product.metaDescription || product.shortDescription
    || [product.genericName, product.strength, product.form].filter(Boolean).join(' ') || product.name;
  return {
    title: product.metaTitle || product.name,
    description: desc,
    keywords: [product.name, product.brandName, product.genericName, product.saltComposition, product.category?.name, 'buy in bulk', 'wholesale'].filter(Boolean),
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.metaTitle || product.name,
      description: desc,
      images: product.primaryImage ? [product.primaryImage] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [related, site] = await Promise.all([
    getRelatedProducts(product, 12),
    getSiteDetails(),
  ]);

  const gallery = [product.primaryImage, ...(product.images || []).map((i) => i.url)].filter(Boolean);

  // Spec rows for the quick-facts table
  const specs = [
    ['Brand name', product.brandName],
    ['Generic / salt', product.genericName],
    ['Composition', product.saltComposition],
    ['Strength', product.strength],
    ['Dosage form', product.form],
    ['Pack size', product.packSize],
    ['Packaging', product.packagingType],
    ['Manufacturer', product.manufacturer],
    ['Schedule', product.schedule],
    ['HSN code', product.hsnCode],
    ['Shelf life', product.shelfLife],
    ['Country of origin', product.countryOfOrigin],
  ].filter(([, v]) => v);

  // Long-form sections (clinical fields are rich HTML from the editor)
  const sections = [
    ['Description', product.description, true],
    ['Uses & indications', product.uses, true],
    ['Symptoms it addresses', product.symptoms, true],
    ['Ingredients', product.ingredients, false],
    ['How to use / dosage', product.howToUse, true],
    ['Side effects', product.sideEffects, true],
    ['Warnings & precautions', product.warnings, true],
    ['Storage', product.storage, false],
  ].filter(([, v]) => v);

  return (
    <>
      {/* Breadcrumb spacer for fixed header */}
      <div className="border-b border-line bg-cloud pt-28 md:pt-32">
        <div className="container-x flex items-center gap-2 py-3 text-sm text-muted">
          <Link href="/" className="hover:text-brand">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-brand">Products</Link>
          <ChevronRight size={14} />
          <span className="text-ink">{product.name}</span>
        </div>
      </div>

      <section className="container-x py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <ProductGallery images={gallery} name={product.name} />

          {/* Summary */}
          <div>
            {product.category && (
              <span className="section-eyebrow">{product.category.name}</span>
            )}
            <h1 className="mt-3 font-display text-3xl font-extrabold text-ink md:text-4xl">{product.name}</h1>
            <p className="mt-2 text-muted">
              {[product.genericName, product.strength, product.form].filter(Boolean).join(' · ')}
            </p>
            {product.shortDescription && (
              <p className="mt-4 leading-relaxed text-ink/80">{product.shortDescription}</p>
            )}

            <div className="mt-6">
              <ProductBooking product={product} site={site} />
            </div>
          </div>
        </div>

        {/* Quick facts */}
        {specs.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold text-ink">Product information</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-line">
                  {specs.map(([k, v]) => (
                    <tr key={k} className="even:bg-cloud/50">
                      <td className="w-1/3 px-4 py-3 font-medium text-muted">{k}</td>
                      <td className="px-4 py-3 text-ink">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Long-form sections */}
        {sections.length > 0 && (
          <div className="mt-12 space-y-8">
            {sections.map(([title, content, isHtml]) => (
              <div key={title} data-aos="fade-up">
                <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
                {isHtml ? (
                  <div className="rich-prose mt-3" dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink/80">{content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related — carousel of suggested products */}
      {related.length > 0 && (
        <section className="bg-cloud py-14">
          <div className="container-x">
            <h2 className="mb-8 font-display text-2xl font-bold text-ink">You may also like</h2>
            <ProductCarousel products={related} whatsappNumber={site.whatsappNumber} />
          </div>
        </section>
      )}
    </>
  );
}
