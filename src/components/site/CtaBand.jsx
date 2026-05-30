import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaBand({ cta }) {
  if (!cta) return null;
  return (
    <section className="container-x py-12">
      <div
        data-aos="zoom-in"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 px-8 py-12 text-white shadow-soft md:px-14 md:py-16"
        style={cta.bgImage ? { backgroundImage: `linear-gradient(rgba(22,120,158,0.8),rgba(22,120,158,0.8)), url(${cta.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            {cta.badge && (
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {cta.badge}
              </span>
            )}
            {cta.heading && <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">{cta.heading}</h2>}
            {cta.subheading && <p className="mt-3 text-white/85">{cta.subheading}</p>}
          </div>
          {cta.ctaLabel && cta.ctaUrl && (
            <Link href={cta.ctaUrl} className="btn inline-flex shrink-0 bg-white px-6 py-3 text-base font-semibold text-brand-700 hover:bg-brand-50">
              {cta.ctaLabel} <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
