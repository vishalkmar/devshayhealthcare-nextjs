// Renders a Google Map for the "Google Maps URL" set in admin → Site Details.
// Accepts either a full embed src (Maps → Share → "Embed a map") or a normal
// Maps link / plain address, which we wrap with the generic embed endpoint so
// it still renders without the user needing the embed URL.
export default function MapEmbed({ url, title = 'Our location', className = '' }) {
  if (!url) return null;
  const src =
    url.includes('/embed') || url.includes('output=embed')
      ? url
      : `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
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
