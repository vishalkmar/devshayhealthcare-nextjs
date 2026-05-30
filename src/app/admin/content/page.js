'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2 } from 'lucide-react';
import { apiGet, apiPut } from '@/lib/adminApi';
import { PageHeader, Card, Field, Input, Textarea, Select, Button } from '@/components/admin/ui';

const ICONS = ['truck', 'shield', 'award', 'check', 'star', 'heart', 'pill'];

// Field config per content key. type: text | textarea | badges
const BLOCKS = [
  {
    key: 'home_sections', title: 'Home — section labels', desc: 'Headings and the trust badges on the home page.',
    fields: [
      ['aboutEyebrow', 'About section eyebrow', 'text'],
      ['productsEyebrow', 'Products eyebrow', 'text'],
      ['productsTitle', 'Products title', 'text'],
      ['productsHighlight', 'Products title (highlighted word)', 'text'],
      ['productsSubtitle', 'Products subtitle', 'textarea'],
      ['testimonialsEyebrow', 'Testimonials eyebrow', 'text'],
      ['testimonialsTitle', 'Testimonials title', 'text'],
      ['testimonialsHighlight', 'Testimonials title (highlighted)', 'text'],
      ['testimonialsSubtitle', 'Testimonials subtitle', 'textarea'],
      ['faqsEyebrow', 'FAQs eyebrow', 'text'],
      ['faqsTitle', 'FAQs title', 'text'],
      ['faqsHighlight', 'FAQs title (highlighted)', 'text'],
      ['faqsSubtitle', 'FAQs subtitle', 'textarea'],
      ['trustBadges', 'Trust badges (below hero)', 'badges'],
    ],
  },
  {
    key: 'products_page', title: 'Products page', desc: 'Top banner of the products listing page.',
    fields: [['heroTitle', 'Hero title', 'text'], ['heroSubtitle', 'Hero subtitle', 'textarea']],
  },
  {
    key: 'contact_page', title: 'Contact page', desc: 'All copy on the contact page.',
    fields: [
      ['badge', 'Top badge', 'text'],
      ['heroTitle', 'Hero title', 'text'],
      ['heroHighlight', 'Hero title (highlighted)', 'text'],
      ['heroSubtitle', 'Hero subtitle', 'textarea'],
      ['formHeading', 'Form heading', 'text'],
      ['formSubtitle', 'Form subtitle', 'textarea'],
      ['whatsappHeading', 'WhatsApp box heading', 'text'],
      ['whatsappSubtitle', 'WhatsApp box subtitle', 'text'],
      ['availability', 'Availability text', 'text'],
    ],
  },
  {
    key: 'footer', title: 'Footer', desc: 'Footer tagline.',
    fields: [['tagline', 'Tagline', 'text']],
  },
];

export default function PageContentAdmin() {
  return (
    <div>
      <PageHeader title="Page Content" desc="Edit the headings, labels and copy used across the public pages." />
      <div className="space-y-6">
        {BLOCKS.map((b) => <Block key={b.key} block={b} />)}
      </div>
    </div>
  );
}

function Block({ block }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet(`/api/admin/content/${block.key}`).then(setForm).catch((e) => toast.error(e.message));
  }, [block.key]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try { await apiPut(`/api/admin/content/${block.key}`, form); toast.success(`${block.title} saved`); }
    catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  return (
    <Card title={block.title} desc={block.desc}
      action={<Button onClick={save} disabled={saving}><Save size={15} /> {saving ? 'Saving…' : 'Save'}</Button>}>
      <div className="grid gap-4 md:grid-cols-2">
        {block.fields.map(([k, label, type]) => {
          if (type === 'badges') {
            return <div key={k} className="md:col-span-2"><Badges label={label} items={form[k] || []} onChange={(v) => set(k, v)} /></div>;
          }
          const El = type === 'textarea' ? Textarea : Input;
          return (
            <Field key={k} label={label} className={type === 'textarea' ? 'md:col-span-2' : ''}>
              <El value={form[k] || ''} onChange={(e) => set(k, e.target.value)} />
            </Field>
          );
        })}
      </div>
    </Card>
  );
}

function Badges({ label, items, onChange }) {
  const setItem = (i, key, v) => onChange(items.map((x, idx) => (idx === i ? { ...x, [key]: v } : x)));
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">{label}</p>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <Select className="w-32" value={it.icon || 'check'} onChange={(e) => setItem(i, 'icon', e.target.value)}>
              {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
            </Select>
            <Input className="flex-1" value={it.label || ''} onChange={(e) => setItem(i, 'label', e.target.value)} placeholder="Badge text" />
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={() => onChange([...items, { icon: 'check', label: '' }])} className="flex items-center gap-1.5 text-sm font-medium text-brand-700"><Plus size={15} /> Add badge</button>
      </div>
    </div>
  );
}
