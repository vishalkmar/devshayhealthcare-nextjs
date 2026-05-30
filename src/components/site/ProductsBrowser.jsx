'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from './ProductCard';
import CategoryCircles from './CategoryCircles';

export default function ProductsBrowser({ categories = [], products = [], whatsappNumber }) {
  const [q, setQ] = useState('');

  const { counts, defaultActive } = useMemo(() => {
    const map = {};
    categories.forEach((c) => { map[c.id] = products.filter((p) => p.categoryId === c.id).length; });
    let best = 'all'; let max = -1;
    Object.entries(map).forEach(([id, n]) => { if (n > max) { max = n; best = Number(id); } });
    return { counts: map, defaultActive: max > 0 ? best : 'all' };
  }, [categories, products]);

  const [active, setActive] = useState(defaultActive);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      const catOk = active === 'all' || p.categoryId === active;
      const textOk = !term
        || p.name?.toLowerCase().includes(term)
        || p.genericName?.toLowerCase().includes(term)
        || p.saltComposition?.toLowerCase().includes(term)
        || p.brandName?.toLowerCase().includes(term);
      return catOk && textOk;
    });
  }, [active, q, products]);

  return (
    <div>
      {/* Search */}
      <div className="mx-auto mb-8 max-w-xl" data-aos="fade-up">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, salt or brand…"
            className="input !rounded-full !py-3 pl-11 shadow-card" />
        </div>
      </div>

      {/* Category circles */}
      <div data-aos="fade-up" data-aos-delay="80">
        <CategoryCircles categories={categories} counts={counts} total={products.length} active={active} onSelect={setActive} />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">No products found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <div key={p.id} data-aos="fade-up" data-aos-delay={(i % 4) * 60}>
              <ProductCard product={p} whatsappNumber={whatsappNumber} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
