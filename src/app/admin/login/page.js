'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Pill, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Login failed');
      toast.success('Welcome back!');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-500 to-brand-800 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white"><Pill size={28} /></span>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Admin Login</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage your website</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@devrishi.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-brand w-full py-3 disabled:opacity-60">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
