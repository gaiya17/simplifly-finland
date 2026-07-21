'use client';

import { useEffect } from 'react';

export default function TawkToTracker() {
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

  // Return null because this is a background tracker, nothing visible to render
  return null;
}
