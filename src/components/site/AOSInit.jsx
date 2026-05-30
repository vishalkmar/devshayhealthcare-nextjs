'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialises AOS scroll animations once and refreshes on route change.
export default function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }, []);

  useEffect(() => {
    AOS.refreshHard();
  }, [pathname]);

  return null;
}
