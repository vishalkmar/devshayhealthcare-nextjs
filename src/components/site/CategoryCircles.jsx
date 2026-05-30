'use client';

import { LayoutGrid, Pill } from 'lucide-react';

// Centered category selector. Each category is a double-bordered circle with
// its image inside; the active one glows. `counts` maps categoryId -> number.
export default function CategoryCircles({ categories = [], counts = {}, total = 0, active, onSelect }) {
  return (
    <div className="no-scrollbar mb-12 flex flex-wrap items-start justify-center gap-x-8 gap-y-6">
      <Circle label="All" count={total} activeState={active === 'all'} onClick={() => onSelect('all')} icon={<LayoutGrid size={28} />} />
      {categories.map((c) => (
        <Circle
          key={c.id}
          label={c.name}
          count={counts[c.id] ?? 0}
          image={c.imageUrl}
          activeState={active === c.id}
          onClick={() => onSelect(c.id)}
          icon={<Pill size={28} />}
        />
      ))}
    </div>
  );
}

function Circle({ label, count, image, activeState, onClick, icon }) {
  return (
    <button onClick={onClick} className="group flex w-24 shrink-0 flex-col items-center gap-2.5 text-center">
      <span className={`relative flex h-24 w-24 items-center justify-center rounded-full p-1 transition-all duration-300 ${
        activeState ? 'bg-gradient-to-br from-brand-400 to-brand-700 shadow-soft scale-105' : 'bg-line group-hover:bg-brand-200'
      }`}>
        {/* inner white ring -> double border effect */}
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-white">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={label} className="h-full w-full rounded-full object-cover" />
          ) : (
            <span className={`flex h-full w-full items-center justify-center rounded-full ${activeState ? 'bg-brand text-white' : 'bg-brand-50 text-brand-500'}`}>
              {icon}
            </span>
          )}
        </span>
        {activeState && <span className="absolute inset-0 rounded-full ring-2 ring-brand ring-offset-2" />}
      </span>
      <span className={`text-[13px] font-semibold leading-tight ${activeState ? 'text-brand-700' : 'text-ink'}`}>{label}</span>
      <span className="-mt-1 text-[11px] text-muted">{count} item{count === 1 ? '' : 's'}</span>
    </button>
  );
}
