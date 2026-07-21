'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TawkToTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const w = window as any;

    // Prevent multiple initializations (React Strict Mode friendly)
    if (w.Tawk_API && w.Tawk_API.loaded) return;

    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = new Date();
    
    // Hide the widget immediately so it never shows up visually
    w.Tawk_API.onLoad = function() {
        w.Tawk_API.hideWidget();
        w.Tawk_API.loaded = true;
    };

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6a5f28e1642ea11d490f1833/1ju1rfcmo';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin','*');
    
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }
  }, []);

  // ─── SPA Route Change Tracking ──────────────────────────────────────────────
  // Tawk.to automatically tracks URL changes, but in Next.js it often grabs the 
  // old document.title before Next.js finishes rendering the new metadata.
  // This hook manually pushes a custom event to your dashboard timeline so you 
  // can clearly see the exact paths they visit.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;
    
    if (w.Tawk_API && typeof w.Tawk_API.addEvent === 'function') {
      // Add a slight delay to allow Next.js to update document.title
      setTimeout(() => {
        w.Tawk_API.addEvent('Navigated to Page', {
          'Path': pathname,
          'Full URL': window.location.href,
          'Title': document.title
        });
      }, 500);
    }
  }, [pathname, searchParams]);

  // Return null because this is a background tracker, nothing visible to render
  return null;
}
