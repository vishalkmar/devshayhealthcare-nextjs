'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PromoBanners({ banners = [] }) {
  if (!banners.length) return null;
  return (
    <div className="space-y-6">
      {banners.map((b) => <PromoBanner key={b.id} banner={b} />)}
    </div>
  );
}

function PromoBanner({ banner }) {
  const slides = banner.slides?.length ? banner.slides : [];
  const [idx, setIdx] = useState(0);
  const isCarousel = slides.length > 1;

  useEffect(() => {
    if (!isCarousel || !banner.autoplay) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), banner.intervalMs || 5000);
    return () => clearInterval(t);
  }, [isCarousel, banner.autoplay, banner.intervalMs, slides.length]);

  const wrap = banner.widthMode === 'full' ? 'w-full' : 'container-x';
  const current = slides[idx];
  const hasOverlay = banner.heading || banner.description || banner.ctaLabel || current?.heading;

  return (
    <div className={wrap}>
      <div className="relative overflow-hidden rounded-2xl" style={{ height: banner.heightPx || 360 }}>
        {slides.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}>
            {s.mediaType === 'video' ? (
              <video src={s.url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.url} alt={s.heading || banner.name} className="h-full w-full object-cover" />
            )}
          </div>
        ))}
        {!slides.length && <div className="h-full w-full bg-gradient-to-r from-brand-400 to-brand-700" />}

        {hasOverlay && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container-x">
                <div className="max-w-lg text-white">
                  {(current?.heading || banner.heading) && (
                    <h3 className="font-display text-2xl font-bold md:text-4xl">{current?.heading || banner.heading}</h3>
                  )}
                  {(current?.subheading || banner.description) && (
                    <p className="mt-2 text-sm opacity-90 md:text-base">{current?.subheading || banner.description}</p>
                  )}
                  {(current?.ctaLabel || banner.ctaLabel) && (current?.ctaUrl || banner.ctaUrl) && (
                    <Link href={current?.ctaUrl || banner.ctaUrl} className="btn-brand mt-5">
                      {current?.ctaLabel || banner.ctaLabel}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {isCarousel && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-white' : 'w-2 bg-white/60'}`} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
