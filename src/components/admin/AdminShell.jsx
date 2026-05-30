'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Image as ImageIcon, MessageSquareQuote, Megaphone,
  Package, FolderTree, Building2, HelpCircle, Sparkles, Info,
  LogOut, Menu, X, ExternalLink, Pill, Type,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { section: 'Website' },
  { href: '/admin/heroes', label: 'Hero Sections', icon: ImageIcon },
  { href: '/admin/promo-banners', label: 'Promo Banners', icon: Megaphone },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/ctas', label: 'CTA Bands', icon: Sparkles },
  { href: '/admin/content', label: 'Page Content', icon: Type },
  { href: '/admin/about', label: 'About Page', icon: Info },
  { href: '/admin/site-details', label: 'Site Details', icon: Building2 },
  { section: 'Catalogue' },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/products', label: 'Products', icon: Package },
];

export default function AdminShell({ admin, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <div className="min-h-screen bg-cloud">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-ink text-white/80 transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white"><Pill size={18} /></span>
          <span className="font-display text-lg font-bold text-white">Devshay Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((item, i) => {
            if (item.section) {
              return <p key={i} className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-white/40">{item.section}</p>;
            }
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? 'bg-brand text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}>
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-ink/40 md:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur md:px-8">
          <button onClick={() => setOpen((o) => !o)} className="rounded-lg p-2 text-ink md:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <p className="hidden text-sm text-muted md:block">Welcome back, <span className="font-semibold text-ink">{admin.name}</span> 👋</p>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="btn-ghost text-sm"><ExternalLink size={15} /> View site</Link>
            <button onClick={logout} className="btn-outline text-sm"><LogOut size={15} /> Logout</button>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
