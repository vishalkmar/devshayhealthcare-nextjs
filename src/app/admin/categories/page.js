'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/adminApi';
import { PageHeader, Modal, Field, Input, Textarea, Toggle, Button, Badge } from '@/components/admin/ui';
import { ImageUpload } from '@/components/admin/MediaUploader';

const EMPTY = { name: '', description: '', imageUrl: '', sortOrder: 0, isActive: true };

export default function CategoriesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setItems(await apiGet('/api/admin/categories')); }
    catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (c) => { setForm({ ...EMPTY, ...c }); setEditId(c.id); setOpen(true); };

  const save = async () => {
    if (!form.name) return toast.error('Name is required');
    setSaving(true);
    try {
      if (editId) await apiPut(`/api/admin/categories/${editId}`, form);
      else await apiPost('/api/admin/categories', form);
      toast.success('Saved');
      setOpen(false);
      load();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this category? Products will be uncategorised.')) return;
    try { await apiDelete(`/api/admin/categories/${id}`); toast.success('Deleted'); load(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div>
      <PageHeader title="Categories" desc="Round-circle product categories shown on the home and products pages."
        action={<Button onClick={openNew}><Plus size={16} /> New category</Button>} />

      {loading ? <p className="text-muted">Loading…</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <div key={c.id} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card">
              <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line bg-cloud">
                {c.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover" />
                ) : <span className="flex h-full w-full items-center justify-center text-xs text-muted">No img</span>}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{c.name}</p>
                <p className="text-xs text-muted">{c._count?.products ?? 0} products</p>
                <div className="mt-1"><Badge active={c.isActive} /></div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => openEdit(c)} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50"><Pencil size={16} /></button>
                <button onClick={() => remove(c.id)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-muted">No categories yet. Create your first one.</p>}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit category' : 'New category'}>
        <div className="space-y-4">
          <Field label="Name *"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Antibiotics" /></Field>
          <Field label="Description"><Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Category image" hint="Shown in the round circle on the site."><ImageUpload value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} /></Field>
          <div className="flex items-center justify-between">
            <Field label="Sort order"><Input type="number" className="w-28" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></Field>
            <Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="Enabled" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
