import slugify from 'slugify';
import prisma from './prisma';

export function makeSlug(text) {
  return slugify(String(text || ''), { lower: true, strict: true, trim: true });
}

// Ensure a unique slug on a model (products / categories).
export async function uniqueSlug(model, base, ignoreId = null) {
  let slug = makeSlug(base) || 'item';
  let candidate = slug;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma[model].findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === ignoreId) return candidate;
    n += 1;
    candidate = `${slug}-${n}`;
  }
}

export function toNum(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export function toInt(v, fallback = 0) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

export function toBool(v) {
  return v === true || v === 'true' || v === 'on' || v === 1 || v === '1';
}

// Build a tel-friendly + display-friendly WhatsApp link.
export function buildWhatsappLink(number, text) {
  const digits = String(number || '').replace(/[^\d]/g, '');
  const msg = encodeURIComponent(text || '');
  return `https://wa.me/${digits}${msg ? `?text=${msg}` : ''}`;
}

export function formatPrice(value, currency = 'INR') {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  const symbol = currency === 'INR' ? '₹' : `${currency} `;
  return `${symbol}${n.toLocaleString('en-IN')}`;
}
