'use client';

import { useState } from 'react';
import { Pill } from 'lucide-react';

export default function ProductGallery({ images = [], name }) {
  const all = images.filter(Boolean);
  const [active, setActive] = useState(0);

  if (!all.length) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-cloud text-brand-200">
        <Pill size={96} />
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-2xl border border-line bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={all[active]} alt={name} className="h-full w-full object-contain" />
      </div>
      {all.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
          {all.map((url, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${i === active ? 'border-brand' : 'border-line'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
