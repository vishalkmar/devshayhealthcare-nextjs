import { makeItem } from '@/lib/crud';
import { ctaTransform } from '../route';

export const { GET, PUT, DELETE } = makeItem({ model: 'cta', beforeWrite: ctaTransform });
