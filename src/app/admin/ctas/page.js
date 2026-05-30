'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/adminApi';
import { PageHeader, Modal, Field, Input, Textarea, Select, Toggle, Button, Badge } from '@/components/admin/ui';
import { ImageUpload } from '@/components/admin/MediaUploader';

const EMPTY = { name: 'CTA', page: 'all', badge: '', heading: '', subheading: '', ctaLabel: '', ctaUrl: '', bgImage: '', sortOrder: 0, isActive: true };
const PAGES = ['all', 'home', 'about', 'products', 'contact'];

export default function CtasAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { try { setItems(await apiGet('/api/admin/ctas')); } catch (e) { toast.error(e.message); } };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (c) => { setForm({ ...EMPTY, ...c }); setEditId(c.id); setOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editId) await apiPut(`/api/admin/ctas/${editId}`, form);
      else await apiPost('/api/admin/ctas', form);
      toast.success('Saved'); setOpen(false); load();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };
  const remove = async (id) => { if (!confirm('Delete this CTA?')) return; try { await apiDelete(`/api/admin/ctas/${id}`); load(); } catch (e) { toast.error(e.message); } };

  return (
    <div>
      <PageHeader title="CTA Bands" desc="Call-to-action banners shown near the bottom of pages."
        action={<Button onClick={openNew}><Plus size={16} /> New CTA</Button>} />

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((c) => (
          <div key={c.id} className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cloud px-2 py-0.5 text-[11px] text-muted">{c.page}</span>
                  <Badge active={c.isActive} />
                </div>
                <p className="mt-2 font-display font-bold text-ink">{c.heading || c.name}</p>
                <p className="mt-1 text-sm text-muted clamp-2">{c.subheading}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50"><Pencil size={16} /></button>
                <button onClick={() => remove(c.id)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted">No CTA bands yet.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit CTA' : 'New CTA'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Admin name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Show on page"><Select value={form.page} onChange={(e) => setForm({ ...form, page: e.target.value })}>{PAGES.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
          </div>
          <Field label="Badge (small pill text)"><Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Partner with us" /></Field>
          <Field label="Heading"><Input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} /></Field>
          <Field label="Subheading"><Textarea value={form.subheading} onChange={(e) => setForm({ ...form, subheading: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Button label"><Input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} placeholder="Contact us" /></Field>
            <Field label="Button URL"><Input value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} placeholder="/contact" /></Field>
          </div>
          <Field label="Background image (optional)"><ImageUpload value={form.bgImage} onChange={(url) => setForm({ ...form, bgImage: url })} /></Field>
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
