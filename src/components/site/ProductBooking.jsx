'use client';

import { buildWhatsappLink, formatPrice } from '@/lib/helpers';
import { MessageCircle, Phone } from 'lucide-react';

const STOCK_LABELS = {
  in_stock: { text: 'In stock', cls: 'text-emerald-600 bg-emerald-50' },
  limited: { text: 'Limited stock', cls: 'text-amber-600 bg-amber-50' },
  out_of_stock: { text: 'Out of stock', cls: 'text-rose-600 bg-rose-50' },
};

export default function ProductBooking({ product, site = {} }) {
  const wa = site.whatsappNumber;
  const prices = [
    { label: 'Per strip', value: product.pricePerStrip },
    { label: 'Per 10 strips', value: product.pricePer10 },
    { label: 'Per box', value: product.pricePerBox },
    { label: 'Per tablet', value: product.pricePerTablet },
  ].filter((p) => p.value != null && p.value !== '');

  const waText = `Hi ${site.company || ''}, I want to deal with this product:
*${product.name}*${product.strength ? ` (${product.strength})` : ''}
${product.genericName ? `Salt: ${product.genericName}` : ''}
${product.packSize ? `Pack: ${product.packSize}` : ''}
Please share bulk pricing and availability.`;
  const waHref = buildWhatsappLink(wa, waText);
  const stock = STOCK_LABELS[product.stockStatus] || STOCK_LABELS.in_stock;

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stock.cls}`}>{stock.text}</span>
        {product.prescriptionRequired && (
          <span className="rounded-full bg-ink/90 px-3 py-1 text-xs font-semibold text-white">Rx required</span>
        )}
      </div>

      {/* Price table */}
      {prices.length > 0 && (
        <div className="mt-4 divide-y divide-line rounded-xl border border-line">
          {prices.map((p, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-muted">{p.label}</span>
              <span className="font-semibold text-ink">{formatPrice(p.value, product.currency)}</span>
            </div>
          ))}
        </div>
      )}

      {product.mrp && (
        <p className="mt-2 text-xs text-muted">MRP <span className="line-through">{formatPrice(product.mrp, product.currency)}</span> — bulk B2B rates above.</p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <Info label="Min order" value={`${product.minOrderQty || 1} unit(s)`} />
        {product.packSize && <Info label="Pack size" value={product.packSize} />}
      </div>

      {/* Book now */}
      {wa ? (
        <a href={waHref} target="_blank" rel="noopener noreferrer"
          className="btn mt-5 w-full bg-[#25D366] py-3 text-base text-white hover:brightness-95">
          <MessageCircle size={18} /> Book now on WhatsApp
        </a>
      ) : (
        <p className="mt-5 rounded-lg bg-cloud px-3 py-2 text-center text-xs text-muted">
          Set a WhatsApp number in admin → Site Details to enable booking.
        </p>
      )}

      {site.phones?.[0] && (
        <a href={`tel:${site.phones[0]}`} className="btn-outline mt-3 w-full py-3">
          <Phone size={16} /> {site.phones[0]}
        </a>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-cloud px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}
