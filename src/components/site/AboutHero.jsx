'use client';

import Link from 'next/link';
import { ShieldCheck, Truck, Star, Pill } from 'lucide-react';
import Typewriter from './Typewriter';

// Abhyas-Shala-style about hero: left copy with a typing effect, right a
// circular portrait with floating badges.
export default function AboutHero({ hero, company }) {
  const heading = hero?.heading || `About ${company}`;
  // Split heading into a static lead + an animated last line/word.
  const words = heading.split(' ');
  const lead = words.length > 1 ? words.slice(0, -1).join(' ') : '';
  const animated = words[words.length - 1];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100 pb-16 pt-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-brand-100 blur-3xl" />
      </div>

      <div className="container-x relative z-10 grid items-center gap-12 md:grid-cols-2">
        <div data-aos="fade-right">
          {hero?.eyebrow && <span className="section-eyebrow">{hero.eyebrow}</span>}
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-ink md:text-5xl">
            {lead}{lead ? ' ' : ''}
            <Typewriter words={[animated, company].filter(Boolean)} className="text-brand" caretClassName="text-brand-400" />
          </h1>
          {hero?.subheading && <p className="mt-5 max-w-xl leading-relaxed text-muted">{hero.subheading}</p>}
          {hero?.body && <div className="rich-prose mt-4 max-w-xl" dangerouslySetInnerHTML={{ __html: hero.body }} />}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/products" className="btn-brand">Explore Products</Link>
            <Link href="/contact" className="btn-outline">Get in touch</Link>
          </div>
        </div>

        {/* Circular portrait */}
        <div className="relative mx-auto" data-aos="zoom-in" data-aos-delay="150">
          <div className="relative h-72 w-72 sm:h-80 sm:w-80 md:h-96 md:w-96">
            <div className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border-2 border-dashed border-brand-200" />
            <div className="absolute inset-4 overflow-hidden rounded-full border-[6px] border-white bg-gradient-to-br from-brand-300 to-brand-600 shadow-soft">
              {hero?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hero.imageUrl} alt={company} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-white/80"><Pill size={88} /></span>
              )}
            </div>

            {/* Floating badges */}
            <Badge className="-left-4 top-8" icon={<ShieldCheck size={16} />} title="Quality" sub="WHO-GMP" />
            <Badge className="-right-2 top-24" icon={<Star size={16} />} title="Trusted" sub="by pharmacies" />
            <Badge className="bottom-6 left-2" icon={<Truck size={16} />} title="Pan India" sub="supply" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ className, icon, title, sub }) {
  return (
    <div className={`absolute flex items-center gap-2 rounded-xl border border-line bg-white/95 px-3 py-2 shadow-card backdrop-blur ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">{icon}</span>
      <span className="text-left leading-tight">
        <span className="block text-sm font-bold text-ink">{title}</span>
        <span className="block text-[11px] text-muted">{sub}</span>
      </span>
    </div>
  );
}
