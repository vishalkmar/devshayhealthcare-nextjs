'use client';

import { X } from 'lucide-react';

export function Field({ label, hint, children, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>}
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Input(props) {
  return <input {...props} className={`input ${props.className || ''}`} />;
}

export function Textarea(props) {
  return <textarea {...props} className={`input ${props.className || ''}`} />;
}

export function Select({ children, ...props }) {
  return <select {...props} className={`input ${props.className || ''}`}>{children}</select>;
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5">
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-brand' : 'bg-line'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
      <input type="checkbox" className="hidden" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      {label && <span className="text-sm text-ink">{label}</span>}
    </label>
  );
}

export function Button({ variant = 'brand', className = '', children, ...props }) {
  const styles = {
    brand: 'btn-brand',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn bg-rose-500 text-white hover:bg-rose-600',
  };
  return <button {...props} className={`${styles[variant]} ${className}`}>{children}</button>;
}

export function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm">
      <div className={`my-8 w-full rounded-2xl bg-white shadow-soft ${wide ? 'max-w-4xl' : 'max-w-2xl'}`}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-cloud"><X size={20} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function Card({ title, desc, children, action }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="font-display text-lg font-bold text-ink">{title}</h3>}
            {desc && <p className="mt-0.5 text-sm text-muted">{desc}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Badge({ active }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
      {active ? 'Enabled' : 'Disabled'}
    </span>
  );
}

export function PageHeader({ title, desc, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">{title}</h1>
        {desc && <p className="mt-1 text-sm text-muted">{desc}</p>}
      </div>
      {action}
    </div>
  );
}
