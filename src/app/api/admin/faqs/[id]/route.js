import { makeItem } from '@/lib/crud';
import { faqTransform } from '../route';

export const dynamic = 'force-dynamic';

export const { GET, PUT, DELETE } = makeItem({ model: 'faq', beforeWrite: faqTransform });
