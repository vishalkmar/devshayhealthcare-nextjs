// Renders a Google Map for the "Google Maps URL" set in admin → Site Details.
// Google share/directions links can't be embedded in an iframe directly, so we
// pull the coordinates (or a query) out of whatever the user pasted and feed
// the generic embed endpoint. Handles: ready-made embed URLs, /place/ links,
// /dir/ (directions) links, "@lat,lng" viewport links, and plain addresses.
const embedQ = (q) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;

function buildSrc(url) {
  const u = (url || '').trim();
  if (!u) return null;

  // Already an embeddable URL — use as-is.
  if (u.includes('/embed') || u.includes('output=embed')) return u;

  // Place marker coordinates: !3d<lat>!4d<lng>
  let m = u.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (m) return embedQ(`${m[1]},${m[2]}`);

  // Directions destination block: !1d<lng>!2d<lat>  (note: lng first)
  m = u.match(/!1d(-?\d+\.\d+)!2d(-?\d+\.\d+)/);
  if (m) return embedQ(`${m[2]},${m[1]}`);

  // Viewport center: @<lat>,<lng>
  m = u.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return embedQ(`${m[1]},${m[2]}`);

  // Bare "lat,lng" string.
  m = u.match(/^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/);
  if (m) return embedQ(`${m[1]},${m[2]}`);

  // Fallback: treat whatever was pasted as a search query (e.g. an address).
  return embedQ(u);
}

export default function MapEmbed({ url, title = 'Our location', className = '' }) {
  const src = buildSrc(url);
  if (!src) return null;
  return (
    <iframe
      title={title}
      src={src}
      className={className}
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
