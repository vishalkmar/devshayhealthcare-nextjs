'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HEIGHTS = { sm: 'h-[55vh]', md: 'h-[70vh]', lg: 'h-[85vh]', full: 'h-screen' };
const POS = {
  left: 'items-center justify-start text-left',
  center: 'items-center justify-center text-center',
  right: 'items-center justify-end text-right',
};

export default function HeroDisplay({ hero }) {
  const media = hero.media?.length ? hero.media : [{ url: '', mediaType: 'image' }];
  const [idx, setIdx] = useState(0);
  const isCarousel = media.length > 1;

  useEffect(() => {
    if (!isCarousel || !hero.autoplay) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % media.length), hero.intervalMs || 5000);
    return () => clearInterval(t);
  }, [isCarousel, hero.autoplay, hero.intervalMs, media.length]);

  const heightClass = HEIGHTS[hero.height] || HEIGHTS.lg;
  const current = media[idx];

  return (
    <section className={`relative w-full overflow-hidden ${heightClass} min-h-[480px]`}>
      {/* Media */}
      {media.map((m, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}>
          {m.mediaType === 'video' ? (
            <video src={m.url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : m.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.url} alt={m.alt || hero.heading || ''} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand-400 to-brand-700" />
          )}
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-ink" style={{ opacity: (hero.overlayOpacity ?? 35) / 100 }} />

      {/* Content */}
      {(hero.heading || hero.subheading || hero.ctaLabel) && (
        <div className={`container-x relative z-10 flex h-full ${POS[hero.textPosition] || POS.center}`}>
          <div className="max-w-2xl animate-fadeUp" style={{ color: hero.textColor || '#fff' }}>
            {hero.heading && (
              <h1 className="font-display text-4xl font-extrabold leading-tight drop-shadow md:text-6xl">
                {hero.heading}
              </h1>
            )}
            {hero.subheading && <p className="mt-4 text-lg opacity-90 md:text-xl">{hero.subheading}</p>}
            {hero.ctaLabel && hero.ctaUrl && (
              <Link href={hero.ctaUrl} className="btn-brand mt-7 text-base">
                {hero.ctaLabel}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Carousel arrows */}
      {isCarousel && (
        <>
          <button onClick={() => setIdx((i) => (i - 1 + media.length) % media.length)}
            className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink hover:bg-white" aria-label="Previous">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setIdx((i) => (i + 1) % media.length)}
            className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink hover:bg-white" aria-label="Next">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {media.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-white' : 'w-2 bg-white/60'}`} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
