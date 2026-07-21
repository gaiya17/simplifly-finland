'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TawkToTracker() {
  const pathname = usePathname();

  // ─── Step 1: Load Tawk.to Script (once) ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;

    // Prevent double-loading
    if (w.Tawk_API && w.Tawk_API._loaded) return;

    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = new Date();

    // Hide the chat widget immediately — we only want background tracking
    w.Tawk_API.onLoad = function () {
      w.Tawk_API.hideWidget();
      w.Tawk_API._loaded = true;
    };

    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6a5f28e1642ea11d490f1833/1ju1rfcmo';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }
  }, []);

  // ─── Step 2: Fix SPA Page Tracking ───────────────────────────────────────────
  // ROOT CAUSE: Next.js App Router updates document.title AFTER the route
  // changes. Tawk.to hooks into history.replaceState/pushState to detect
  // navigation and reads document.title at that exact moment — before Next.js
  // finishes updating it. This is why all pages show the same generic title.
  //
  // THE FIX: Wait ~800ms for Next.js to finish rendering the new page title,
  // then manually re-call history.replaceState. This re-triggers Tawk.to's
  // internal listener with the NOW-correct, up-to-date document.title.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      // Re-trigger Tawk.to's navigation listener by "re-announcing" the current
      // URL with the now-correct title that Next.js has just finished setting.
      window.history.replaceState(
        window.history.state,
        document.title,       // ← Next.js has now updated this correctly
        window.location.href
      );
    }, 800); // 800ms gives Next.js enough time to update <title>

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
