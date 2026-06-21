'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Pill } from 'lucide-react';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

export default function Header({ site = {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // On non-home pages we keep the solid header so dark text is always readable.
  const isHome = pathname === '/';
  const solid = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Lock background scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const textColor = solid ? 'text-ink' : 'text-white';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid ? 'bg-white/90 backdrop-blur-md shadow-card border-b border-line' : 'bg-transparent'
        }`}
      >
        <div className="container-x flex h-20 items-center justify-between md:h-24">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          {site.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={site.logo} alt={site.company || 'Logo'} className="h-14 w-auto md:h-20" />
          ) : (
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-soft">
                <Pill size={18} />
              </span>
              <span className={`text-lg font-extrabold font-display ${textColor}`}>
                {site.company || 'Devshay Healthcare'}
              </span>
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'text-brand-700 bg-brand-50'
                    : `${textColor} hover:text-brand-600 hover:bg-white/10`
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/contact" className="btn-brand ml-2">
            Enquire Now
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className={`rounded-lg p-2 md:hidden ${solid ? 'text-ink' : 'text-white'}`}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </header>

      {/* Mobile slide-in drawer — rendered outside the header so its slide
          animation isn't slowed by the header's backdrop-blur / transitions. */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* Overlay */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/60 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Panel */}
        <aside
          className={`absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-white shadow-soft transition-transform duration-300 ease-out [will-change:transform] ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white"><Pill size={16} /></span>
              <span className="font-display text-base font-bold text-ink">{site.company || 'Devshay Healthcare'}</span>
            </span>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-ink hover:bg-cloud" aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {NAV.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-3 text-sm font-medium transition ${active ? 'bg-brand-50 text-brand-700' : 'text-ink hover:bg-cloud'}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/contact" className="btn-brand mt-3 w-full">Enquire Now</Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
