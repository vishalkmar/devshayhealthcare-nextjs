import { makeItem } from '@/lib/crud';
import { faqTransform } from '../route';

export const { GET, PUT, DELETE } = makeItem({ model: 'faq', beforeWrite: faqTransform });
