import Link from 'next/link';
import { Package, FolderTree, MessageSquareQuote, Image as ImageIcon, Megaphone, HelpCircle, Mail } from 'lucide-react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function safeCount(model, where) {
  try { return await prisma[model].count(where ? { where } : undefined); } catch { return 0; }
}

export default async function AdminDashboard() {
  const [products, categories, testimonials, heroes, promos, faqs, messages] = await Promise.all([
    safeCount('product'),
    safeCount('category'),
    safeCount('testimonial'),
    safeCount('hero'),
    safeCount('promoBanner'),
    safeCount('faq'),
    safeCount('contactMessage', { isRead: false }),
  ]);

  const cards = [
    { label: 'Products', value: products, icon: Package, href: '/admin/products', color: 'bg-brand-50 text-brand-600' },
    { label: 'Categories', value: categories, icon: FolderTree, href: '/admin/categories', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Hero Sections', value: heroes, icon: ImageIcon, href: '/admin/heroes', color: 'bg-violet-50 text-violet-600' },
    { label: 'Promo Banners', value: promos, icon: Megaphone, href: '/admin/promo-banners', color: 'bg-amber-50 text-amber-600' },
    { label: 'Testimonials', value: testimonials, icon: MessageSquareQuote, href: '/admin/testimonials', color: 'bg-rose-50 text-rose-600' },
    { label: 'FAQs', value: faqs, icon: HelpCircle, href: '/admin/faqs', color: 'bg-sky-50 text-sky-600' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Manage everything that appears on your public website.</p>

      {messages > 0 && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          <Mail size={18} /> You have {messages} unread enquiry{messages > 1 ? 'ies' : ''} from the contact form.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}
            className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.color}`}><c.icon size={22} /></span>
            <div>
              <p className="font-display text-2xl font-extrabold text-ink">{c.value}</p>
              <p className="text-sm text-muted">{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-ink">Quick start</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          <li>1. Fill in <Link href="/admin/site-details" className="text-brand-700 underline">Site Details</Link> (logo, contact, WhatsApp number).</li>
          <li>2. Create <Link href="/admin/categories" className="text-brand-700 underline">Categories</Link>, then add <Link href="/admin/products" className="text-brand-700 underline">Products</Link>.</li>
          <li>3. Add a <Link href="/admin/heroes" className="text-brand-700 underline">Hero Section</Link> for the home page.</li>
          <li>4. Configure testimonials, promo banners, FAQs, CTA and the About page.</li>
        </ol>
      </div>
    </div>
  );
}
