'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Save, ArrowLeft } from 'lucide-react';
import { apiGet, apiPost, apiPut } from '@/lib/adminApi';
import { Card, Field, Input, Textarea, Select, Toggle, Button } from '@/components/admin/ui';
import { ImageUpload, MediaListUpload } from '@/components/admin/MediaUploader';
import RichTextEditor from '@/components/admin/RichTextEditor';

const EMPTY = {
  name: '', categoryId: '', brandName: '', genericName: '', manufacturer: '', sku: '', hsnCode: '',
  form: '', strength: '', packSize: '', packagingType: '', schedule: '',
  saltComposition: '', ingredients: '', uses: '', symptoms: '', howToUse: '', sideEffects: '',
  warnings: '', storage: '', shortDescription: '', description: '',
  pricePerStrip: '', pricePer10: '', pricePerTablet: '', pricePerBox: '', mrp: '', currency: 'INR',
  minOrderQty: 1, unitsPerStrip: '', stockStatus: 'in_stock', prescriptionRequired: false,
  shelfLife: '', countryOfOrigin: 'India', primaryImage: '', images: [],
  isFeatured: false, isPopular: false, isActive: true, metaTitle: '', metaDescription: '', sortOrder: 0,
};

const FORMS = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Powder', 'Gel', 'Inhaler', 'Sachet'];
const PACKAGING = ['Strip', 'Bottle', 'Box', 'Vial', 'Tube', 'Sachet', 'Jar'];

export default function ProductForm({ productId }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!productId);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    apiGet('/api/admin/categories').then(setCategories).catch(() => {});
    if (productId) {
      apiGet(`/api/admin/products/${productId}`)
        .then((p) => setForm({
          ...EMPTY, ...p,
          categoryId: p.categoryId || '',
          images: (p.images || []).map((i) => ({ url: i.url, mediaType: 'image', alt: i.alt })),
        }))
        .catch((e) => toast.error(e.message))
        .finally(() => setLoading(false));
    }
  }, [productId]);

  const save = async () => {
    if (!form.name) return toast.error('Product name is required');
    setSaving(true);
    try {
      if (productId) await apiPut(`/api/admin/products/${productId}`, form);
      else await apiPost('/api/admin/products', form);
      toast.success('Product saved');
      router.push('/admin/products');
      router.refresh();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  if (loading) return <p className="text-muted">Loading…</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/admin/products')} className="btn-ghost text-sm"><ArrowLeft size={16} /> Back</button>
        <Button onClick={save} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save product'}</Button>
      </div>

      <Card title="Basic information">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Product name *" hint="e.g. Pantop 40 Tablet"><Input value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
            <Field label="Category"><Select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
              <option value="">— Select —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Brand name"><Input value={form.brandName} onChange={(e) => set('brandName', e.target.value)} /></Field>
            <Field label="Generic / salt name" hint="e.g. Pantoprazole"><Input value={form.genericName} onChange={(e) => set('genericName', e.target.value)} /></Field>
            <Field label="Strength" hint="e.g. 40 mg"><Input value={form.strength} onChange={(e) => set('strength', e.target.value)} /></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Dosage form"><Select value={form.form} onChange={(e) => set('form', e.target.value)}><option value="">—</option>{FORMS.map((f) => <option key={f} value={f}>{f}</option>)}</Select></Field>
            <Field label="Pack size" hint="e.g. 10 tablets/strip"><Input value={form.packSize} onChange={(e) => set('packSize', e.target.value)} /></Field>
            <Field label="Packaging"><Select value={form.packagingType} onChange={(e) => set('packagingType', e.target.value)}><option value="">—</option>{PACKAGING.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Manufacturer"><Input value={form.manufacturer} onChange={(e) => set('manufacturer', e.target.value)} /></Field>
            <Field label="Schedule" hint="e.g. Schedule H, OTC"><Input value={form.schedule} onChange={(e) => set('schedule', e.target.value)} /></Field>
            <Field label="HSN code"><Input value={form.hsnCode} onChange={(e) => set('hsnCode', e.target.value)} /></Field>
          </div>
          <Field label="Short description" hint="Shown in cards & at top of detail page."><Textarea value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} /></Field>
        </div>
      </Card>

      <Card title="Media" desc="Primary image is used on cards. Add more for the gallery.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Primary image"><ImageUpload value={form.primaryImage} onChange={(url) => set('primaryImage', url)} accept="image/*" /></Field>
          <Field label="Gallery images"><MediaListUpload accept="image/*" value={form.images} onChange={(imgs) => set('images', imgs)} /></Field>
        </div>
      </Card>

      <Card title="Pricing (bulk / B2B)">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Price per strip"><Input type="number" value={form.pricePerStrip} onChange={(e) => set('pricePerStrip', e.target.value)} /></Field>
          <Field label="Price per 10 strips"><Input type="number" value={form.pricePer10} onChange={(e) => set('pricePer10', e.target.value)} /></Field>
          <Field label="Price per box"><Input type="number" value={form.pricePerBox} onChange={(e) => set('pricePerBox', e.target.value)} /></Field>
          <Field label="Price per tablet/unit"><Input type="number" value={form.pricePerTablet} onChange={(e) => set('pricePerTablet', e.target.value)} /></Field>
          <Field label="MRP (strike-through)"><Input type="number" value={form.mrp} onChange={(e) => set('mrp', e.target.value)} /></Field>
          <Field label="Currency"><Input value={form.currency} onChange={(e) => set('currency', e.target.value)} /></Field>
          <Field label="Units per strip"><Input type="number" value={form.unitsPerStrip} onChange={(e) => set('unitsPerStrip', e.target.value)} /></Field>
          <Field label="Min order quantity"><Input type="number" value={form.minOrderQty} onChange={(e) => set('minOrderQty', e.target.value)} /></Field>
          <Field label="Stock status"><Select value={form.stockStatus} onChange={(e) => set('stockStatus', e.target.value)}>
            <option value="in_stock">In stock</option><option value="limited">Limited</option><option value="out_of_stock">Out of stock</option>
          </Select></Field>
        </div>
      </Card>

      <Card title="Composition & clinical details">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Salt composition"><Textarea value={form.saltComposition} onChange={(e) => set('saltComposition', e.target.value)} /></Field>
            <Field label="Ingredients"><Textarea value={form.ingredients} onChange={(e) => set('ingredients', e.target.value)} /></Field>
          </div>
          <Field label="Uses & indications"><RichTextEditor value={form.uses} onChange={(html) => set('uses', html)} placeholder="What is this product used for…" minHeight={140} /></Field>
          <Field label="Symptoms it addresses"><RichTextEditor value={form.symptoms} onChange={(html) => set('symptoms', html)} placeholder="Symptoms / conditions…" minHeight={140} /></Field>
          <Field label="How to use / dosage"><RichTextEditor value={form.howToUse} onChange={(html) => set('howToUse', html)} placeholder="Directions for use / dosage…" minHeight={140} /></Field>
          <Field label="Side effects"><RichTextEditor value={form.sideEffects} onChange={(html) => set('sideEffects', html)} placeholder="Possible side effects…" minHeight={140} /></Field>
          <Field label="Warnings & precautions"><RichTextEditor value={form.warnings} onChange={(html) => set('warnings', html)} placeholder="Warnings, precautions, contraindications…" minHeight={140} /></Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Storage"><Input value={form.storage} onChange={(e) => set('storage', e.target.value)} /></Field>
            <Field label="Shelf life / expiry"><Input value={form.shelfLife} onChange={(e) => set('shelfLife', e.target.value)} placeholder="24 months from mfg" /></Field>
            <Field label="Country of origin"><Input value={form.countryOfOrigin} onChange={(e) => set('countryOfOrigin', e.target.value)} /></Field>
          </div>
        </div>
      </Card>

      <Card title="Full description (rich text)">
        <RichTextEditor value={form.description} onChange={(html) => set('description', html)} placeholder="Detailed write-up about the product…" />
      </Card>

      <Card title="Status, badges & SEO">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-6">
            <Toggle checked={form.isActive} onChange={(v) => set('isActive', v)} label="Published (visible on site)" />
            <Toggle checked={form.isFeatured} onChange={(v) => set('isFeatured', v)} label="Featured" />
            <Toggle checked={form.isPopular} onChange={(v) => set('isPopular', v)} label="Popular" />
            <Toggle checked={form.prescriptionRequired} onChange={(v) => set('prescriptionRequired', v)} label="Prescription (Rx) required" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Meta title"><Input value={form.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} /></Field>
            <Field label="Sort order"><Input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} /></Field>
          </div>
          <Field label="Meta description"><Textarea value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} /></Field>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save product'}</Button>
      </div>
    </div>
  );
}
