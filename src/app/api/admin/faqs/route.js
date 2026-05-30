import { makeCollection } from '@/lib/crud';
import { toInt, toBool } from '@/lib/helpers';

export function faqTransform(body) {
  return {
    question: body.question,
    answer: body.answer || '',
    page: body.page || 'home',
    side: body.side === 'right' ? 'right' : 'left',
    sortOrder: toInt(body.sortOrder),
    isActive: body.isActive === undefined ? true : toBool(body.isActive),
  };
}

export const { GET, POST } = makeCollection({
  model: 'faq',
  orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  beforeWrite: faqTransform,
});
