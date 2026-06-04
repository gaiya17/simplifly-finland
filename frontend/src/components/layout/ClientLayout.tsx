/**
 * ClientLayout.tsx — Smart Layout Switcher
 *
 * This is a CLIENT component (requires 'use client' to call usePathname hook).
 * It detects the current URL and renders one of two layouts:
 *
 *  1. PORTAL layout (/admin, /login):
 *     → Bare <main> wrapper with no Header/Footer.
 *     → The AdminLayout component handles its own sidebar/topbar.
 *
 *  2. PUBLIC layout (all other routes):
 *     → Full page with Header, main content, Footer, and FloatingContact.
 *     → Wrapped in LanguageProvider for i18n support.
 *
 * Why a client component here?
 * The root layout.tsx is a Server Component and cannot use hooks like
 * usePathname. By delegating the pathname check to this small client
 * boundary, we keep the main layout on the server while only
 * hydrating this tiny component on the client.
 */
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingContact } from '../shared/FloatingContact';
import { LanguageProvider } from '../../lib/i18n/LanguageContext';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine if the current route is an admin/auth portal page.
  // These pages manage their own layout via AdminLayout.
  const isPortal =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/login');

  // Portal routes: render children directly with no public nav chrome
  if (isPortal) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  // Public routes: render full page layout with navigation
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#f8fbff] font-sans">
        {/* Fixed top navigation bar */}
        <Header />

        {/* Main page content rendered by individual page.tsx files */}
        <main className="min-h-screen w-full">{children}</main>

        {/* Site-wide footer with links and contact info */}
        <Footer />

        {/* Floating WhatsApp / contact button (bottom-right corner) */}
        <FloatingContact />
      </div>
    </LanguageProvider>
  );
}
