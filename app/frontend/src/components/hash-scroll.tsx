'use client';

import { useLenis } from 'lenis/react';
import { useEffect } from 'react';

export function HashScroll() {
  const lenis = useLenis();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const el = document.getElementById(hash);
      if (!el) return;

      // allow layout to settle
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (lenis) {
            lenis.scrollTo(el, { offset: -120, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [lenis]);

  return null;
}
