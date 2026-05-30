'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error('Please fill in your name and message');
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    // Phone must be exactly 10 digits (ignoring spaces / +91 prefix).
    const digits = form.phone.replace(/\D/g, '').replace(/^91/, '');
    if (form.phone && digits.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to send');
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Your Name *</label>
          <input className="input" placeholder="Full name" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label">Email Address</label>
          <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} />
        </div>
      </div>
      <div>
        <label className="label">Phone Number</label>
        <input className="input" inputMode="numeric" maxLength={14} placeholder="10-digit mobile number" value={form.phone} onChange={set('phone')} />
      </div>
      <div>
        <label className="label">Subject</label>
        <input className="input" placeholder="How can we help you?" value={form.subject} onChange={set('subject')} />
      </div>
      <div>
        <label className="label">Message *</label>
        <textarea className="input min-h-[140px]" placeholder="Write your message here…" value={form.message} onChange={set('message')} />
      </div>
      <button type="submit" disabled={loading} className="btn-brand w-full py-3 text-base disabled:opacity-60">
        <Send size={17} /> {loading ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
