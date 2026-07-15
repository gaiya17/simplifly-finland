'use client';

import { useEffect, useRef } from 'react';

export default function CookieYesPolicy() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client
    if (!containerRef.current) return;
    
    // Check if script is already added to avoid duplicates on re-renders
    if (document.getElementById('cky-cookie-policy')) return;

    const script = document.createElement('script');
    script.id = 'cky-cookie-policy';
    script.type = 'text/javascript';
    script.src = 'https://cdn-cookieyes.com/client_data/d3fe3f2de23f2de0bea89b5d775a7d45/cookie-policy/script.js';
    script.async = true;
    
    // Append the script exactly inside this container so it renders here
    containerRef.current.appendChild(script);

    return () => {
      // Cleanup if needed
      const existingScript = document.getElementById('cky-cookie-policy');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full min-h-[400px] cookieyes-embed-container" 
    />
  );
}
