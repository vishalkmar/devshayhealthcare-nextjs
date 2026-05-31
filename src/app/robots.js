// Dynamic robots.txt — Next.js App Router serves this at /robots.txt.
// Allows crawling of the public site, blocks admin + API internals, and points
// crawlers at the sitemap.
import { getBaseUrl } from '@/lib/siteUrl';

// Derive the domain from the live request (see siteUrl.js), so robots.txt is
// always correct on whatever host it's served from.
export const dynamic = 'force-dynamic';

export default function robots() {
  const base = getBaseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
