'use client';

import { useEffect } from 'react';

/**
 * TawkToTracker
 *
 * Loads the Tawk.to script invisibly in the background.
 * Tracks live visitor presence (online count, country, device, chat).
 * The chat widget is intentionally hidden — we only use the monitoring dashboard.
 *
 * NOTE: The automatic "Visitor navigated to" page tracking in Tawk.to is a
 * known limitation with Next.js App Router SPAs (pushState fires before React
 * commits the updated document.title). This is a Tawk.to architectural
 * constraint that cannot be solved client-side.
 */
export default function TawkToTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;

    // Prevent double-loading across React Strict Mode double-invocations
    if (w.__tawkLoaded) return;
    w.__tawkLoaded = true;

    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = new Date();

    // Hide the chat widget immediately on load — tracking only
    w.Tawk_API.onLoad = () => {
      w.Tawk_API.hideWidget();
    };

    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6a5f28e1642ea11d490f1833/1ju1rfcmo';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    if (s0?.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }
  }, []);

  return null;
}
