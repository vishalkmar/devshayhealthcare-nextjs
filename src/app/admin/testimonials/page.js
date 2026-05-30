'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/adminApi';
import { PageHeader, Modal, Field, Input, Textarea, Select, Toggle, Button, Badge } from '@/components/admin/ui';
import { ImageUpload, MediaListUpload } from '@/components/admin/MediaUploader';

const EMPTY = {
  type: 'text', authorName: '', authorTitle: '', authorLocation: '', authorAvatar: '',
  rating: 5, content: '', videoUrl: '', videoPoster: '', mediaHeight: 240, mediaWidth: '',
  sortOrder: 0, isActive: true, media: [],
};
const TYPES = ['text', 'image', 'gallery', 'video', 'image_text'];

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { try { setItems(await apiGet('/api/admin/testimonials')); } catch (e) { toast.error(e.message); } };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (t) => { setForm({ ...EMPTY, ...t, media: t.media || [] }); setEditId(t.id); setOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editId) await apiPut(`/api/admin/testimonials/${editId}`, form);
      else await apiPost('/api/admin/testimonials', form);
      toast.success('Saved'); setOpen(false); load();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };
  const remove = async (id) => { if (!confirm('Delete this testimonial?')) return; try { await apiDelete(`/api/admin/testimonials/${id}`); load(); } catch (e) { toast.error(e.message); } };

  const showVideo = form.type === 'video';
  const showGallery = form.type === 'gallery';
  const showImage = form.type === 'image' || form.type === 'image_text';

  return (
    <div>
      <PageHeader title="Testimonials" desc="Reviews shown in the testimonials section on the home page."
        action={<Button onClick={openNew}><Plus size={16} /> New testimonial</Button>} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {t.authorAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.authorAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 font-bold text-brand-700">{(t.authorName || '?').charAt(0)}</span>}
                <div>
                  <p className="font-semibold text-ink">{t.authorName || 'Anonymous'}</p>
                  <p className="text-xs text-muted">{t.authorLocation}</p>
                </div>
              </div>
              <Badge active={t.isActive} />
            </div>
            {t.rating ? <div className="mt-3 flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}</div> : null}
            {t.content && <p className="mt-2 text-sm text-muted clamp-3">{t.content}</p>}
            <div className="mt-3 flex justify-end gap-1">
              <button onClick={() => openEdit(t)} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50"><Pencil size={16} /></button>
              <button onClick={() => remove(t.id)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted">No testimonials yet.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit testimonial' : 'New testimonial'} wide>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</Select></Field>
            <Field label="Rating (1-5)"><Input type="number" min="0" max="5" value={form.rating ?? ''} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Author name"><Input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} /></Field>
            <Field label="Title / company"><Input value={form.authorTitle} onChange={(e) => setForm({ ...form, authorTitle: e.target.value })} /></Field>
            <Field label="Location"><Input value={form.authorLocation} onChange={(e) => setForm({ ...form, authorLocation: e.target.value })} /></Field>
          </div>
          <Field label="Quote / content"><Textarea className="min-h-[100px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></Field>
          <Field label="Avatar (optional)"><ImageUpload value={form.authorAvatar} onChange={(url) => setForm({ ...form, authorAvatar: url })} /></Field>

          {showVideo && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Video URL"><Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://…mp4" /></Field>
              <Field label="Video poster"><ImageUpload value={form.videoPoster} onChange={(url) => setForm({ ...form, videoPoster: url })} /></Field>
            </div>
          )}
          {(showGallery || showImage) && (
            <Field label="Media images"><MediaListUpload accept="image/*" value={form.media} onChange={(m) => setForm({ ...form, media: m })} /></Field>
          )}

          {(showGallery || showImage || showVideo) && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Media height (px)" hint="How tall the image/video shows on the card. Default 240.">
                <Input type="number" value={form.mediaHeight} onChange={(e) => setForm({ ...form, mediaHeight: e.target.value })} />
              </Field>
              <Field label="Media width (px)" hint="Leave blank for full card width.">
                <Input type="number" value={form.mediaWidth} onChange={(e) => setForm({ ...form, mediaWidth: e.target.value })} placeholder="Auto" />
              </Field>
            </div>
          )}

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
