'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

// Compact enquiry form shown in the footer.
export default function FooterContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return toast.error('Please add your name and message');
    if (form.phone && form.phone.replace(/\D/g, '').replace(/^91/, '').length !== 10) {
      return toast.error('Enter a valid 10-digit phone number');
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: 'Footer quick enquiry' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed');
      toast.success('Enquiry sent! We will reach out soon.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <input value={form.name} onChange={set('name')} placeholder="Name"
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-brand" />
        <input value={form.phone} onChange={set('phone')} placeholder="Phone"
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-brand" />
      </div>
      <input value={form.email} onChange={set('email')} placeholder="Email"
        className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-brand" />
      <textarea value={form.message} onChange={set('message')} placeholder="Your enquiry…" rows={2}
        className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-brand" />
      <button type="submit" disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60">
        <Send size={15} /> {loading ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}
