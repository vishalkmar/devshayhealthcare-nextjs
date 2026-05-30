'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';

export default function Faqs({
  items = [],
  centerEyebrow = 'FAQs',
  centerTitle = 'Answers to your',
  centerHighlight = 'questions',
  centerSubtitle = 'Find quick answers about ordering, products, supply and partnerships.',
}) {
  const [open, setOpen] = useState(0);
  if (!items.length) return null;

  // Columns are driven by the admin-set `side` field. If no FAQ has been
  // assigned to the right yet, fall back to an even split so it stays balanced.
  // Each FAQ keeps a global number based on its position in the full list.
  const anySide = items.some((f) => f.side === 'right');
  const numbered = items.map((f, i) => ({ ...f, n: i }));
  const half = Math.ceil(numbered.length / 2);
  const left = anySide ? numbered.filter((f) => f.side !== 'right') : numbered.slice(0, half);
  const right = anySide ? numbered.filter((f) => f.side === 'right') : numbered.slice(half);

  const Item = ({ f }) => {
    const isOpen = open === f.n;
    return (
      <div className={`overflow-hidden rounded-2xl border transition ${isOpen ? 'border-brand bg-white shadow-card' : 'border-line bg-white/70'}`}>
        <button onClick={() => setOpen(isOpen ? -1 : f.n)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
          <span className="flex items-center gap-3">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isOpen ? 'bg-brand text-white' : 'bg-brand-50 text-brand-600'}`}>
              {String(f.n + 1).padStart(2, '0')}
            </span>
            <span className="text-sm font-semibold text-ink">{f.question}</span>
          </span>
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isOpen ? 'bg-brand text-white' : 'border border-line text-brand-600'}`}>
            {isOpen ? <Minus size={14} /> : <Plus size={14} />}
          </span>
        </button>
        {isOpen && <div className="px-4 pb-4 pl-[52px] text-sm leading-relaxed text-muted">{f.answer}</div>}
      </div>
    );
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px_1fr]">
      {/* Left column */}
      <div className="space-y-3" data-aos="fade-right">
        {left.map((f) => <Item key={f.id} f={f} />)}
      </div>

      {/* Center circular panel */}
      <div className="order-first lg:order-none" data-aos="zoom-in">
        <div className="relative mx-auto flex aspect-square max-w-[320px] flex-col items-center justify-center rounded-full border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 text-center shadow-card">
          <span className="section-eyebrow">{centerEyebrow}</span>
          <h3 className="mt-3 font-display text-2xl font-extrabold text-ink">
            {centerTitle} <span className="text-brand">{centerHighlight}</span>
          </h3>
          <p className="mt-2 text-sm text-muted">{centerSubtitle}</p>
          <Link href="/contact" className="btn-brand mt-4 text-sm">Contact Team</Link>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-3" data-aos="fade-left">
        {right.map((f) => <Item key={f.id} f={f} />)}
      </div>
    </div>
  );
}
