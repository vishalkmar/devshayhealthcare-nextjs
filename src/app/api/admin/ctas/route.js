import { makeCollection } from '@/lib/crud';
import { toInt, toBool } from '@/lib/helpers';

export function ctaTransform(body) {
  return {
    name: body.name || 'CTA',
    page: body.page || 'all',
    badge: body.badge || null,
    heading: body.heading || null,
    subheading: body.subheading || null,
    ctaLabel: body.ctaLabel || null,
    ctaUrl: body.ctaUrl || null,
    bgImage: body.bgImage || null,
    sortOrder: toInt(body.sortOrder),
    isActive: body.isActive === undefined ? true : toBool(body.isActive),
  };
}

export const { GET, POST } = makeCollection({ model: 'cta', beforeWrite: ctaTransform });
