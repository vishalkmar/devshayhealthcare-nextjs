'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Pill, ShieldCheck } from 'lucide-react';
import { formatPrice, buildWhatsappLink } from '@/lib/helpers';

// Whole card is clickable -> product detail. The WhatsApp button stops
// propagation so it opens the chat instead of navigating.
export default function ProductCard({ product, whatsappNumber }) {
  const router = useRouter();
  const href = `/products/${product.slug}`;

  const price = formatPrice(product.pricePerStrip, product.currency)
    || formatPrice(product.pricePerBox, product.currency)
    || formatPrice(product.pricePerTablet, product.currency);
  const mrp = formatPrice(product.mrp, product.currency);

  const waText = `Hi, I'm interested in *${product.name}*${
    product.strength ? ` (${product.strength})` : ''
  }. Please share bulk pricing and availability.`;
  const waHref = buildWhatsappLink(whatsappNumber, waText);

  return (
    <div
      onClick={() => router.push(href)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-cloud">
        {product.primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.primaryImage} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-200">
            <Pill size={56} />
          </div>
        )}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700 shadow-card">
            {product.category.name}
          </span>
        )}
        {product.prescriptionRequired && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold text-white">
            <ShieldCheck size={12} /> Rx
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-bold text-ink clamp-2">{product.name}</h3>
        <p className="mt-0.5 text-xs text-muted">
          {[product.genericName, product.strength].filter(Boolean).join(' · ')}
        </p>
        {product.saltComposition && (
          <p className="mt-2 text-xs text-muted clamp-2">{product.saltComposition}</p>
        )}

        <div className="mt-auto pt-3">
          {price && (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-ink">{price}</span>
              {mrp && mrp !== price && <span className="text-xs text-muted line-through">{mrp}</span>}
              {product.packSize && <span className="text-[11px] text-muted">/ {product.packSize.split(' ')[0] ? product.packSize : 'strip'}</span>}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <span className="btn-outline flex-1 !py-2 text-xs">
              View Details <ArrowRight size={14} />
            </span>
            {whatsappNumber && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:scale-110"
                aria-label="Enquire on WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.157 5.335 5.494 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.738-.981v-.012z" /></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
