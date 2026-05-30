'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { apiGet, apiDelete } from '@/lib/adminApi';
import { PageHeader, Button, Badge } from '@/components/admin/ui';
import { formatPrice } from '@/lib/helpers';

export default function ProductsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  const load = async () => {
    setLoading(true);
    try { setItems(await apiGet('/api/admin/products')); }
    catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await apiDelete(`/api/admin/products/${id}`); toast.success('Deleted'); load(); }
    catch (e) { toast.error(e.message); }
  };

  const filtered = items.filter((p) => {
    const t = q.trim().toLowerCase();
    return !t || p.name?.toLowerCase().includes(t) || p.genericName?.toLowerCase().includes(t) || p.brandName?.toLowerCase().includes(t);
  });

  return (
    <div>
      <PageHeader title="Products" desc="Your medical product catalogue."
        action={<Link href="/admin/products/new" className="btn-brand"><Plus size={16} /> New product</Link>} />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="input pl-9" />
        </div>
      </div>

      {loading ? <p className="text-muted">Loading…</p> : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-cloud text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price/strip</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-cloud/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cloud">
                        {p.primaryImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.primaryImage} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </span>
                      <div>
                        <p className="font-semibold text-ink">{p.name}</p>
                        <p className="text-xs text-muted">{[p.genericName, p.strength].filter(Boolean).join(' · ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-ink">{formatPrice(p.pricePerStrip, p.currency) || '—'}</td>
                  <td className="px-4 py-3"><Badge active={p.isActive} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/products/${p.id}`} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50"><Pencil size={16} /></Link>
                      <button onClick={() => remove(p.id)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
