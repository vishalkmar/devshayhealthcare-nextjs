// Dynamic robots.txt — Next.js App Router serves this at /robots.txt.
// Allows crawling of the public site, blocks admin + API internals, and points
// crawlers at the sitemap.
function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

export default function robots() {
  const base = siteUrl();
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
