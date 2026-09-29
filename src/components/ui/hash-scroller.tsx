'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function HashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const id = decodeURIComponent(hash.replace(/^#/, ''));
      if (!id) return;

      let retries = 0;
      const maxRetries = 12;

      const tryScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (retries < maxRetries) {
          retries++;
          setTimeout(tryScroll, 100);
        }
      };

      // Aguarda o próximo frame de renderização antes de tentar rolar
      requestAnimationFrame(() => {
        tryScroll();
      });
    };

    // Rola após o mount inicial ou após a transição de rota do Next.js
    scrollToHash();

    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [pathname]);

  return null;
}
