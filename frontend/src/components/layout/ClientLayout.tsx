'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingContact } from '../shared/FloatingContact';
import { LanguageProvider } from '../../lib/i18n/LanguageContext';
import { useEffect, useState } from 'react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPortal =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/login');

  if (isPortal) {
    if (!mounted) return <div className="min-h-screen bg-[#f0f4f9]" />;
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#f8fbff] font-sans">
        <Header />
        <main className="min-h-screen w-full">{children}</main>
        <Footer />
        <FloatingContact />
      </div>
    </LanguageProvider>
  );
}
