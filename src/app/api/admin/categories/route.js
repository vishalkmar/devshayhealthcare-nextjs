import { makeCollection } from '@/lib/crud';
import { uniqueSlug, toInt, toBool } from '@/lib/helpers';

async function transform(body, id = null) {
  return {
    name: body.name,
    imageUrl: body.imageUrl || null,
    description: body.description || null,
    sortOrder: toInt(body.sortOrder),
    isActive: body.isActive === undefined ? true : toBool(body.isActive),
    slug: await uniqueSlug('category', body.slug || body.name, id),
  };
}

const orderBy = [{ sortOrder: 'asc' }, { name: 'asc' }];
const include = { _count: { select: { products: true } } };

export const dynamic = 'force-dynamic';

export const { GET, POST } = makeCollection({ model: 'category', include, orderBy, beforeWrite: (b) => transform(b) });
export { transform as categoryTransform };
