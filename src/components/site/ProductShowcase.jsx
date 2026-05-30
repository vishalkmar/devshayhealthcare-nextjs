'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import CategoryCircles from './CategoryCircles';

export default function ProductShowcase({ categories = [], products = [], whatsappNumber }) {
  const scroller = useRef(null);

  // counts per category — home always defaults to "All".
  const counts = useMemo(() => {
    const map = {};
    categories.forEach((c) => { map[c.id] = products.filter((p) => p.categoryId === c.id).length; });
    return map;
  }, [categories, products]);

  const [active, setActive] = useState('all');

  const filtered = useMemo(() => (
    active === 'all' ? products : products.filter((p) => p.categoryId === active)
  ), [active, products]);

  const scroll = (dir) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <div>
      <div data-aos="fade-up">
        <CategoryCircles categories={categories} counts={counts} total={products.length} active={active} onSelect={setActive} />
      </div>

      <div className="relative" data-aos="fade-up" data-aos-delay="100">
        <button onClick={() => scroll(-1)}
          className="absolute -left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-card transition hover:bg-brand hover:text-white md:flex" aria-label="Scroll left">
          <ChevronLeft size={20} />
        </button>
        <div ref={scroller} className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2">
          {filtered.map((p) => (
            <div key={p.id} className="w-[270px] shrink-0">
              <ProductCard product={p} whatsappNumber={whatsappNumber} />
            </div>
          ))}
        </div>
        <button onClick={() => scroll(1)}
          className="absolute -right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-card transition hover:bg-brand hover:text-white md:flex" aria-label="Scroll right">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-10 text-center">
        <Link href="/products" className="btn-brand">Browse all products</Link>
      </div>
    </div>
  );
}
