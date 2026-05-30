'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-brand-700 shadow-soft hover:bg-brand-50 transition"
    >
      <ArrowUp size={20} />
    </button>
  );
}
