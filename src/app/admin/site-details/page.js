'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save, Mail, Phone, MapPin } from 'lucide-react';
import { apiGet, apiPut } from '@/lib/adminApi';
import { PageHeader, Card, Field, Input, Textarea, Select, Button } from '@/components/admin/ui';
import { ImageUpload } from '@/components/admin/MediaUploader';
import { SOCIAL_PLATFORMS } from '@/components/site/socialIcons';

const EMPTY = {
  company: '', tagline: '', description: '', logo: '', whatsappNumber: '', mapUrl: '',
  emails: [], phones: [], addresses: [], socials: [],
};

export default function SiteDetailsAdmin() {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet('/api/admin/site-details').then((d) => setForm({ ...EMPTY, ...d })).catch((e) => toast.error(e.message));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // list helpers for string arrays
  const addStr = (k) => set(k, [...(form[k] || []), '']);
  const setStr = (k, i, v) => set(k, form[k].map((x, idx) => (idx === i ? v : x)));
  const delStr = (k, i) => set(k, form[k].filter((_, idx) => idx !== i));

  // socials are { platform, url }
  const addSocial = () => set('socials', [...(form.socials || []), { platform: 'Instagram', url: '' }]);
  const setSocial = (i, key, v) => set('socials', form.socials.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)));
  const delSocial = (i) => set('socials', form.socials.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    try {
      await apiPut('/api/admin/site-details', form);
      toast.success('Site details saved');
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader title="Site Details" desc="Company info shown across the footer, contact page and WhatsApp buttons."
        action={<Button onClick={save} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save changes'}</Button>} />

      <div className="space-y-6">
        <Card title="Brand" desc="Name, tagline, description and logo.">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Company name"><Input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Devshay Healthcare" /></Field>
              <Field label="Tagline"><Input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Trusted B2B pharma supplier" /></Field>
            </div>
            <Field label="Short description (footer)"><Textarea value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
            <Field label="Logo"><ImageUpload value={form.logo} onChange={(url) => set('logo', url)} accept="image/*" /></Field>
          </div>
        </Card>

        <Card title="WhatsApp & map">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="WhatsApp number" hint="With country code, e.g. 919876543210. Used by the floating button & Book now.">
              <Input value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} placeholder="919876543210" />
            </Field>
            <Field label="Google Maps embed code (optional)" hint='Google Maps → Share → "Embed a map" → COPY HTML, then paste the whole <iframe …> code here.'>
              <Textarea value={form.mapUrl} onChange={(e) => set('mapUrl', e.target.value)} placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>' className="min-h-[110px] font-mono text-xs" />
            </Field>
          </div>
        </Card>

        <ListCard title="Email addresses" icon={Mail} items={form.emails} placeholder="info@devshayhealthcare.com"
          onAdd={() => addStr('emails')} onChange={(i, v) => setStr('emails', i, v)} onDelete={(i) => delStr('emails', i)} />

        <ListCard title="Contact numbers" icon={Phone} items={form.phones} placeholder="+91 98765 43210"
          onAdd={() => addStr('phones')} onChange={(i, v) => setStr('phones', i, v)} onDelete={(i) => delStr('phones', i)} />

        <ListCard title="Addresses" icon={MapPin} items={form.addresses} placeholder="128-A, Delhi, India"
          onAdd={() => addStr('addresses')} onChange={(i, v) => setStr('addresses', i, v)} onDelete={(i) => delStr('addresses', i)} />

        <Card title="Social media" desc="Pick a platform and paste the public URL.">
          <div className="space-y-3">
            {(form.socials || []).map((s, i) => (
              <div key={i} className="flex gap-2">
                <Select className="w-40" value={s.platform} onChange={(e) => setSocial(i, 'platform', e.target.value)}>
                  {SOCIAL_PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
                <Input className="flex-1" value={s.url} onChange={(e) => setSocial(i, 'url', e.target.value)} placeholder="https://…" />
                <button onClick={() => delSocial(i)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
              </div>
            ))}
            <button onClick={addSocial} className="flex items-center gap-1.5 text-sm font-medium text-brand-700"><Plus size={15} /> Add social link</button>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save changes'}</Button>
        </div>
      </div>
    </div>
  );
}

function ListCard({ title, icon: Icon, items = [], placeholder, onAdd, onChange, onDelete }) {
  return (
    <Card title={title}>
      <div className="space-y-2.5">
        {items.map((v, i) => (
          <div key={i} className="flex gap-2">
            <span className="flex w-10 items-center justify-center rounded-lg bg-cloud text-muted"><Icon size={16} /></span>
            <Input className="flex-1" value={v} onChange={(e) => onChange(i, e.target.value)} placeholder={placeholder} />
            <button onClick={() => onDelete(i)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={onAdd} className="flex items-center gap-1.5 text-sm font-medium text-brand-700"><Plus size={15} /> Add another</button>
      </div>
    </Card>
  );
}
