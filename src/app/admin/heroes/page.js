'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/adminApi';
import { PageHeader, Modal, Field, Input, Textarea, Select, Toggle, Button, Badge } from '@/components/admin/ui';
import { MediaListUpload } from '@/components/admin/MediaUploader';

const EMPTY = {
  name: '', type: 'image_text', pageKey: 'home', heading: '', subheading: '',
  ctaLabel: '', ctaUrl: '', textPosition: 'center', textColor: '#ffffff',
  overlayOpacity: 35, height: 'lg', autoplay: true, intervalMs: 5000, sortOrder: 0, isActive: true, media: [],
};
const TYPES = ['image', 'image_text', 'image_carousel', 'image_carousel_text', 'video', 'video_carousel'];
const PAGES = ['home', 'about', 'products', 'contact'];

export default function HeroesAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { try { setItems(await apiGet('/api/admin/heroes')); } catch (e) { toast.error(e.message); } };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (h) => { setForm({ ...EMPTY, ...h, media: h.media || [] }); setEditId(h.id); setOpen(true); };

  const save = async () => {
    if (!form.name) return toast.error('Internal name is required');
    setSaving(true);
    try {
      if (editId) await apiPut(`/api/admin/heroes/${editId}`, form);
      else await apiPost('/api/admin/heroes', form);
      toast.success('Saved'); setOpen(false); load();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };
  const remove = async (id) => { if (!confirm('Delete this hero?')) return; try { await apiDelete(`/api/admin/heroes/${id}`); load(); } catch (e) { toast.error(e.message); } };

  return (
    <div>
      <PageHeader title="Hero Sections" desc="Banner sections at the top of each page."
        action={<Button onClick={openNew}><Plus size={16} /> New hero</Button>} />

      <div className="space-y-3">
        {items.map((h) => (
          <div key={h.id} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card">
            <span className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-cloud">
              {h.media?.[0]?.url ? (h.media[0].mediaType === 'video'
                ? <video src={h.media[0].url} className="h-full w-full object-cover" />
                // eslint-disable-next-line @next/next/no-img-element
                : <img src={h.media[0].url} alt="" className="h-full w-full object-cover" />)
                : <span className="flex h-full w-full items-center justify-center text-xs text-muted">No media</span>}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold text-ink">{h.name}</p>
                <Badge active={h.isActive} />
              </div>
              <p className="text-xs text-muted">{h.pageKey} · {h.type} · {h.media?.length || 0} media</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(h)} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50"><Pencil size={16} /></button>
              <button onClick={() => remove(h.id)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted">No heroes yet.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit hero' : 'New hero'} wide>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Internal name *"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Home main banner" /></Field>
            <Field label="Page"><Select value={form.pageKey} onChange={(e) => setForm({ ...form, pageKey: e.target.value })}>{PAGES.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</Select></Field>
            <Field label="Height"><Select value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })}>{['sm', 'md', 'lg', 'full'].map((h) => <option key={h} value={h}>{h}</option>)}</Select></Field>
            <Field label="Text position"><Select value={form.textPosition} onChange={(e) => setForm({ ...form, textPosition: e.target.value })}>{['left', 'center', 'right'].map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
          </div>

          <Field label="Media (images / videos)" hint="Add multiple for a carousel."><MediaListUpload value={form.media} onChange={(m) => setForm({ ...form, media: m })} /></Field>

          <Field label="Heading"><Input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} /></Field>
          <Field label="Subheading"><Textarea value={form.subheading} onChange={(e) => setForm({ ...form, subheading: e.target.value })} /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Button label"><Input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} placeholder="Browse products" /></Field>
            <Field label="Button URL"><Input value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} placeholder="/products" /></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Text color"><Input type="color" value={form.textColor} onChange={(e) => setForm({ ...form, textColor: e.target.value })} className="h-10" /></Field>
            <Field label="Overlay opacity (%)"><Input type="number" min="0" max="100" value={form.overlayOpacity} onChange={(e) => setForm({ ...form, overlayOpacity: e.target.value })} /></Field>
            <Field label="Autoplay interval (ms)"><Input type="number" value={form.intervalMs} onChange={(e) => setForm({ ...form, intervalMs: e.target.value })} /></Field>
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
