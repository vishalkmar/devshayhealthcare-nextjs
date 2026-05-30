'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

// Horizontal scrolling list of product cards (used for "Related products").
export default function ProductCarousel({ products = [], whatsappNumber }) {
  const scroller = useRef(null);
  const scroll = (dir) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };
  if (!products.length) return null;

  return (
    <div className="relative">
      <button onClick={() => scroll(-1)}
        className="absolute -left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-card transition hover:bg-brand hover:text-white md:flex" aria-label="Scroll left">
        <ChevronLeft size={20} />
      </button>
      <div ref={scroller} className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2">
        {products.map((p) => (
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
  );
}
