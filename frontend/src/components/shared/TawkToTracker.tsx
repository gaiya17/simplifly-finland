'use client';

import { useEffect } from 'react';

export default function TawkToTracker() {

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;

    // ── Guard: prevent double-initialization (React Strict Mode safe) ──────────
    if (w.__tawkTrackerMounted) return;
    w.__tawkTrackerMounted = true;

    // ── Step 1: Initialize Tawk.to (widget hidden — tracking only) ────────────
    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = new Date();

    // ── Step 2: Everything that needs the API goes inside onLoad ──────────────
    // This guarantees Tawk_API is 100% ready before we call any methods.
    // Previous attempts called the API outside onLoad which caused silent failures.
    w.Tawk_API.onLoad = function () {
      // Hide the chat widget — we only want background visitor tracking
      w.Tawk_API.hideWidget();

      // ── Step 3: MutationObserver on <title> ───────────────────────────────
      // Instead of guessing with timeouts, we watch the EXACT moment that
      // React finishes committing the new page title to the DOM.
      // This fires AFTER pushState — which is precisely when document.title
      // is correct and ready to be read by Tawk.to.
      const titleEl = document.querySelector('title');
      if (!titleEl) return;

      let isFirstObservation = true; // Skip the initial mount observation

      const observer = new MutationObserver(() => {
        // Skip first fire (the page the user landed on is already tracked)
        if (isFirstObservation) {
          isFirstObservation = false;
          return;
        }

        const correctTitle = document.title;
        const currentPath  = window.location.pathname;
        const currentHref  = window.location.href;

        // ── Fix A: Correct the "Visitor navigated to" automatic event ────────
        // Root cause: Tawk.to only listens to pushState (NOT replaceState).
        // When Next.js called pushState, document.title was stale.
        // We now fire a NEW pushState with a temporary #tawk-track fragment.
        // Tawk.to intercepts this call and reads document.title which is now
        // the correct, React-committed title.
        // We immediately clean the fragment with replaceState — visitors never
        // see it, back-button is unaffected, SEO is unaffected.
        const fragmentUrl = currentHref.split('#')[0] + '#tawk-track';
        window.history.pushState(window.history.state, correctTitle, fragmentUrl);
        window.history.replaceState(window.history.state, correctTitle, currentHref.split('#')[0]);

        // ── Fix B: Write a custom "Page View" entry to the Visitor Timeline ──
        // addEvent creates a visible entry in the conversation timeline panel.
        // This is independent of the automatic events and always shows the
        // exact path, giving you a reliable audit trail of the visitor's journey.
        if (typeof w.Tawk_API.addEvent === 'function') {
          w.Tawk_API.addEvent(
            'Page View',
            {
              'Path'  : currentPath,
              'Title' : correctTitle,
            },
          );
        }

        // ── Fix C: Update visitor profile sidebar with current page ──────────
        // setAttributes writes to the "About" section in the right panel.
        // This is always visible in real-time regardless of timeline state.
        if (typeof w.Tawk_API.setAttributes === 'function') {
          w.Tawk_API.setAttributes(
            {
              'Current Page' : correctTitle,
              'Current Path' : currentPath,
            },
          );
        }
      });

      // Watch for child text changes inside <title> — this is how Next.js
      // updates the title during client-side navigation.
      observer.observe(titleEl, {
        childList     : true,
        subtree       : true,
        characterData : true,
      });
    };

    // ── Step 4: Inject the Tawk.to script tag ─────────────────────────────────
    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src   = 'https://embed.tawk.to/6a5f28e1642ea11d490f1833/1ju1rfcmo';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }
  }, []); // Empty deps — runs once on mount, observer persists for full session

  return null; // This component renders nothing visible
}
