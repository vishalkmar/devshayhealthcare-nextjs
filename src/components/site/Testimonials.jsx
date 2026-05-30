'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials({ items = [] }) {
  const [idx, setIdx] = useState(0);
  if (!items.length) return null;

  const perView = 3;
  const maxStart = Math.max(0, items.length - perView);
  const start = Math.min(idx, maxStart);
  const visible = items.slice(start, start + perView);

  return (
    <div>
      <div className="grid items-stretch gap-6 md:grid-cols-3">
        {visible.map((t, i) => (
          <div key={t.id} data-aos="fade-up" data-aos-delay={i * 80}>
            <TestimonialCard t={t} />
          </div>
        ))}
      </div>

      {items.length > perView && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={start === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-brand hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-ink" aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setIdx((i) => Math.min(maxStart, i + 1))} disabled={start >= maxStart}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-brand hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-ink" aria-label="Next">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function Stars({ rating, className = '' }) {
  if (!rating) return null;
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-line'} />
      ))}
    </div>
  );
}

function Avatar({ t, size = 44 }) {
  const cls = 'rounded-full object-cover';
  if (t.authorAvatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={t.authorAvatar} alt={t.authorName} className={cls} style={{ width: size, height: size }} />;
  }
  return (
    <span className="flex items-center justify-center rounded-full bg-brand-50 font-bold text-brand-700" style={{ width: size, height: size }}>
      {(t.authorName || '?').charAt(0)}
    </span>
  );
}

function TestimonialCard({ t }) {
  const mediaUrl = t.media?.[0]?.url;
  const isVideo = t.type === 'video' && t.videoUrl;
  const hasMedia = isVideo || (t.type !== 'text' && mediaUrl);

  // ---- TEXT layout: centered, circular avatar on top, rating, then quote ----
  if (!hasMedia) {
    return (
      <div className="flex h-full flex-col items-center rounded-2xl border border-line bg-white p-6 text-center shadow-card">
        <div className="rounded-full bg-gradient-to-br from-brand-100 to-brand-300 p-1">
          <div className="rounded-full border-[3px] border-white">
            <Avatar t={t} size={80} />
          </div>
        </div>
        <p className="mt-3 font-display text-base font-bold text-ink">{t.authorName || 'Customer'}</p>
        <p className="text-xs text-muted">{[t.authorTitle, t.authorLocation].filter(Boolean).join(', ')}</p>
        <Stars rating={t.rating} className="mt-2.5" />
        {t.content && <p className="mt-4 text-sm leading-relaxed text-ink/80">“{t.content}”</p>}
      </div>
    );
  }

  // ---- MEDIA layout: image/video on top (configurable height), rating small below ----
  const mediaStyle = {
    height: t.mediaHeight || 240,
    ...(t.mediaWidth ? { width: t.mediaWidth, marginLeft: 'auto', marginRight: 'auto' } : { width: '100%' }),
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="bg-cloud p-3">
        {isVideo ? (
          <video src={t.videoUrl} controls poster={t.videoPoster || undefined} className="rounded-xl object-cover" style={mediaStyle} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl} alt={t.authorName || ''} className="rounded-xl object-cover" style={mediaStyle} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {t.content && <p className="text-sm leading-relaxed text-ink/80">“{t.content}”</p>}
        <div className="mt-auto flex items-center gap-3 border-t border-line pt-4">
          <Avatar t={t} size={44} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{t.authorName || 'Customer'}</p>
            <p className="truncate text-xs text-muted">{[t.authorTitle, t.authorLocation].filter(Boolean).join(', ')}</p>
          </div>
          <Stars rating={t.rating} />
        </div>
      </div>
    </div>
  );
}
