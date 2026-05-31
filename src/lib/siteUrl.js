// Resolve the site's canonical base URL for server-side metadata routes
// (sitemap.xml, robots.txt). This is intentionally robust on any host:
//
//   1. NEXT_PUBLIC_SITE_URL  — if it's set to a real (non-localhost) value,
//      use it as the canonical domain.
//   2. Request headers        — otherwise derive it from the incoming request
//      (x-forwarded-host / host), so it always matches whatever domain the
//      page was actually served from — no env var or rebuild needed.
//   3. localhost              — final dev fallback.
//
// Note: NEXT_PUBLIC_* vars are inlined at BUILD time, so if the value was
// missing when the app was built it stays missing until a rebuild. Deriving
// from headers sidesteps that trap entirely.
import { headers } from 'next/headers';

function clean(url) {
  return url.replace(/\/+$/, ''); // drop trailing slash(es)
}

export function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return clean(envUrl);
  }

  try {
    const h = headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    if (host) {
      const proto = h.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
      return clean(`${proto}://${host}`);
    }
  } catch {
    // headers() unavailable (e.g. static generation) — fall through.
  }

  return clean(envUrl || 'http://localhost:3000');
}
