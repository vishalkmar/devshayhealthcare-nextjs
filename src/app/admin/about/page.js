'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2 } from 'lucide-react';
import { apiGet, apiPut } from '@/lib/adminApi';
import { PageHeader, Card, Field, Input, Textarea, Toggle, Button } from '@/components/admin/ui';
import { ImageUpload } from '@/components/admin/MediaUploader';
import RichTextEditor from '@/components/admin/RichTextEditor';

const SECTIONS = [
  { key: 'hero', title: 'Hero', desc: 'Top banner of the About page.', extras: [] },
  { key: 'who_we_are', title: 'Who we are', desc: 'Intro with stats and bullet points.', extras: ['stats', 'bullets'] },
  { key: 'vision', title: 'Vision', desc: 'Vision card.', extras: [] },
  { key: 'mission', title: 'Mission', desc: 'Mission card.', extras: [] },
  { key: 'team', title: 'Team', desc: 'The people behind the company.', extras: ['members'] },
  { key: 'story', title: 'Story', desc: 'Closing story band.', extras: [] },
];

export default function AboutAdmin() {
  const [data, setData] = useState({});

  useEffect(() => {
    apiGet('/api/admin/about').then((rows) => {
      const map = {};
      rows.forEach((r) => { map[r.sectionKey] = r; });
      setData(map);
    }).catch((e) => toast.error(e.message));
  }, []);

  return (
    <div>
      <PageHeader title="About Page" desc="Every section of the public About page is editable here." />
      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <SectionEditor key={s.key} config={s} initial={data[s.key]} />
        ))}
      </div>
    </div>
  );
}

function SectionEditor({ config, initial }) {
  const [form, setForm] = useState({
    sectionKey: config.key, eyebrow: '', heading: '', subheading: '', body: '', imageUrl: '',
    isActive: true, sortOrder: 0, data: {},
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) setForm((f) => ({ ...f, ...initial, data: initial.data || {} }));
  }, [initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setData = (k, v) => setForm((f) => ({ ...f, data: { ...f.data, [k]: v } }));

  const save = async () => {
    setSaving(true);
    try { await apiPut('/api/admin/about', form); toast.success(`${config.title} saved`); }
    catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  return (
    <Card title={config.title} desc={config.desc}
      action={<div className="flex items-center gap-3"><Toggle checked={form.isActive} onChange={(v) => set('isActive', v)} label="Show" /><Button onClick={save} disabled={saving}><Save size={15} /> {saving ? 'Saving…' : 'Save'}</Button></div>}>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow (small label)"><Input value={form.eyebrow || ''} onChange={(e) => set('eyebrow', e.target.value)} /></Field>
          <Field label="Heading"><Input value={form.heading || ''} onChange={(e) => set('heading', e.target.value)} /></Field>
        </div>
        <Field label="Subheading / short paragraph"><Textarea value={form.subheading || ''} onChange={(e) => set('subheading', e.target.value)} /></Field>
        <Field label="Body (rich text)" hint="Detailed formatted content shown under the subheading.">
          <RichTextEditor value={form.body || ''} onChange={(html) => set('body', html)} placeholder="Write detailed content…" minHeight={150} />
        </Field>
        <Field label="Image (optional)"><ImageUpload value={form.imageUrl} onChange={(url) => set('imageUrl', url)} /></Field>

        {config.extras.includes('stats') && (
          <RepeatList title="Stats" items={form.data.stats || []} onChange={(v) => setData('stats', v)}
            blank={{ value: '', label: '' }} fields={[{ k: 'value', ph: '50,000+' }, { k: 'label', ph: 'Pharmacies served' }]} />
        )}
        {config.extras.includes('bullets') && (
          <StringList title="Bullet points" items={form.data.bullets || []} onChange={(v) => setData('bullets', v)} ph="Quality assured stock" />
        )}
        {config.extras.includes('members') && (
          <RepeatList title="Team members" items={form.data.members || []} onChange={(v) => setData('members', v)}
            blank={{ name: '', role: '', bio: '', image: '' }}
            fields={[{ k: 'name', ph: 'Name' }, { k: 'role', ph: 'Role' }, { k: 'bio', ph: 'Short bio' }]} withImage />
        )}
      </div>
    </Card>
  );
}

function StringList({ title, items, onChange, ph }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">{title}</p>
      <div className="space-y-2">
        {items.map((v, i) => (
          <div key={i} className="flex gap-2">
            <Input value={v} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? e.target.value : x)))} placeholder={ph} />
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={() => onChange([...items, ''])} className="flex items-center gap-1.5 text-sm font-medium text-brand-700"><Plus size={15} /> Add</button>
      </div>
    </div>
  );
}

function RepeatList({ title, items, onChange, blank, fields, withImage }) {
  const setItem = (i, k, v) => onChange(items.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">{title}</p>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border border-line p-3">
            <div className="grid gap-2 md:grid-cols-2">
              {fields.map((f) => (
                <Input key={f.k} value={it[f.k] || ''} onChange={(e) => setItem(i, f.k, e.target.value)} placeholder={f.ph} />
              ))}
            </div>
            {withImage && <div className="mt-2"><ImageUpload value={it.image} onChange={(url) => setItem(i, 'image', url)} /></div>}
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="mt-2 flex items-center gap-1 text-xs text-rose-500"><Trash2 size={13} /> Remove</button>
          </div>
        ))}
        <button onClick={() => onChange([...items, { ...blank }])} className="flex items-center gap-1.5 text-sm font-medium text-brand-700"><Plus size={15} /> Add</button>
      </div>
    </div>
  );
}
