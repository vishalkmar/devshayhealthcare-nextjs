'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/adminApi';
import { PageHeader, Modal, Field, Input, Textarea, Select, Toggle, Button, Badge } from '@/components/admin/ui';

const EMPTY = { question: '', answer: '', page: 'home', side: 'left', sortOrder: 0, isActive: true };
const PAGES = ['home', 'about', 'contact', 'all'];

export default function FaqsAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { try { setItems(await apiGet('/api/admin/faqs')); } catch (e) { toast.error(e.message); } };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (f) => { setForm({ ...EMPTY, ...f }); setEditId(f.id); setOpen(true); };

  const save = async () => {
    if (!form.question) return toast.error('Question is required');
    setSaving(true);
    try {
      if (editId) await apiPut(`/api/admin/faqs/${editId}`, form);
      else await apiPost('/api/admin/faqs', form);
      toast.success('Saved'); setOpen(false); load();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };
  const remove = async (id) => { if (!confirm('Delete this FAQ?')) return; try { await apiDelete(`/api/admin/faqs/${id}`); load(); } catch (e) { toast.error(e.message); } };

  return (
    <div>
      <PageHeader title="FAQs" desc="Frequently asked questions shown on the home, about and contact pages."
        action={<Button onClick={openNew}><Plus size={16} /> New FAQ</Button>} />

      <div className="space-y-3">
        {items.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-card">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-ink">{f.question}</p>
                <span className="rounded-full bg-cloud px-2 py-0.5 text-[11px] text-muted">{f.page}</span>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">{f.side === 'right' ? 'Right' : 'Left'}</span>
                <Badge active={f.isActive} />
              </div>
              <p className="mt-1 text-sm text-muted clamp-2">{f.answer}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(f)} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50"><Pencil size={16} /></button>
              <button onClick={() => remove(f.id)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted">No FAQs yet.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit FAQ' : 'New FAQ'}>
        <div className="space-y-4">
          <Field label="Question *"><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></Field>
          <Field label="Answer"><Textarea className="min-h-[120px]" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} /></Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Show on page"><Select value={form.page} onChange={(e) => setForm({ ...form, page: e.target.value })}>{PAGES.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
            <Field label="Column side" hint="Which side of the FAQ grid."><Select value={form.side} onChange={(e) => setForm({ ...form, side: e.target.value })}><option value="left">Left</option><option value="right">Right</option></Select></Field>
            <Field label="Sort order"><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></Field>
          </div>
          <Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="Enabled" />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
