'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/adminApi';
import { PageHeader, Modal, Field, Input, Textarea, Select, Toggle, Button, Badge } from '@/components/admin/ui';
import { MediaListUpload } from '@/components/admin/MediaUploader';

const EMPTY = {
  name: '', type: 'image-single', page: 'home', position: 'below-products',
  heading: '', description: '', ctaLabel: '', ctaUrl: '',
  heightPx: 360, widthMode: 'container', autoplay: true, intervalMs: 5000, sortOrder: 0, isActive: true, slides: [],
};
const TYPES = ['image-single', 'image-carousel', 'image-text', 'video-single', 'video-carousel'];
const PAGES = ['home', 'products', 'about', 'contact', 'all'];
const POSITIONS = ['below-products', 'below-hero', 'below-testimonials', 'above-footer'];

export default function PromoBannersAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { try { setItems(await apiGet('/api/admin/promo-banners')); } catch (e) { toast.error(e.message); } };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (b) => { setForm({ ...EMPTY, ...b, slides: b.slides || [] }); setEditId(b.id); setOpen(true); };

  // slides need extra per-slide text fields, MediaListUpload gives {url, mediaType}
  const setSlideField = (i, key, v) => setForm((f) => ({ ...f, slides: f.slides.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)) }));

  const save = async () => {
    if (!form.name) return toast.error('Admin name is required');
    setSaving(true);
    try {
      if (editId) await apiPut(`/api/admin/promo-banners/${editId}`, form);
      else await apiPost('/api/admin/promo-banners', form);
      toast.success('Saved'); setOpen(false); load();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };
  const remove = async (id) => { if (!confirm('Delete this banner?')) return; try { await apiDelete(`/api/admin/promo-banners/${id}`); load(); } catch (e) { toast.error(e.message); } };

  return (
    <div>
      <PageHeader title="Promo Banners" desc="Promotional banners shown on the home and other pages."
        action={<Button onClick={openNew}><Plus size={16} /> New banner</Button>} />

      <div className="space-y-3">
        {items.map((b) => (
          <div key={b.id} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card">
            <span className="h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-cloud">
              {b.slides?.[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.slides[0].url} alt="" className="h-full w-full object-cover" />
              ) : <span className="flex h-full w-full items-center justify-center text-xs text-muted">No media</span>}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><p className="truncate font-semibold text-ink">{b.name}</p><Badge active={b.isActive} /></div>
              <p className="text-xs text-muted">{b.page} · {b.type} · {b.slides?.length || 0} slides</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(b)} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50"><Pencil size={16} /></button>
              <button onClick={() => remove(b.id)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted">No promo banners yet.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit banner' : 'New banner'} wide>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Admin name *"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</Select></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Page"><Select value={form.page} onChange={(e) => setForm({ ...form, page: e.target.value })}>{PAGES.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
            <Field label="Position"><Select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>{POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
            <Field label="Width"><Select value={form.widthMode} onChange={(e) => setForm({ ...form, widthMode: e.target.value })}><option value="container">Container</option><option value="full">Full bleed</option></Select></Field>
          </div>

          <Field label="Slides (images / videos)" hint="Add multiple for a carousel."><MediaListUpload value={form.slides} onChange={(s) => setForm({ ...form, slides: s })} /></Field>

          {/* Per-slide overlay text */}
          {form.slides.length > 0 && (
            <div className="space-y-2 rounded-xl border border-line p-3">
              <p className="text-xs font-semibold uppercase text-muted">Per-slide overlay text (optional)</p>
              {form.slides.map((s, i) => (
                <div key={i} className="grid gap-2 md:grid-cols-2">
                  <Input value={s.heading || ''} onChange={(e) => setSlideField(i, 'heading', e.target.value)} placeholder={`Slide ${i + 1} heading`} />
                  <Input value={s.subheading || ''} onChange={(e) => setSlideField(i, 'subheading', e.target.value)} placeholder="Subheading" />
                  <Input value={s.ctaLabel || ''} onChange={(e) => setSlideField(i, 'ctaLabel', e.target.value)} placeholder="Button label" />
                  <Input value={s.ctaUrl || ''} onChange={(e) => setSlideField(i, 'ctaUrl', e.target.value)} placeholder="Button URL" />
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Default heading"><Input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} /></Field>
            <Field label="Default description"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Button label"><Input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} /></Field>
            <Field label="Button URL"><Input value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} /></Field>
            <Field label="Height (px)"><Input type="number" value={form.heightPx} onChange={(e) => setForm({ ...form, heightPx: e.target.value })} /></Field>
            <Field label="Interval (ms)"><Input type="number" value={form.intervalMs} onChange={(e) => setForm({ ...form, intervalMs: e.target.value })} /></Field>
          </div>
          <div className="flex items-center justify-between">
            <Field label="Sort order"><Input type="number" className="w-28" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></Field>
            <div className="flex items-center gap-6">
              <Toggle checked={form.autoplay} onChange={(v) => setForm({ ...form, autoplay: v })} label="Autoplay" />
              <Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="Enabled" />
            </div>
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
