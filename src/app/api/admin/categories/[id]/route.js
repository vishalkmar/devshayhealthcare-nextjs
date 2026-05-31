import { makeItem } from '@/lib/crud';
import { categoryTransform } from '../route';

export const dynamic = 'force-dynamic';

export const { GET, PUT, DELETE } = makeItem({
  model: 'category',
  include: { _count: { select: { products: true } } },
  beforeWrite: (b, id) => categoryTransform(b, id),
});
