import { Outlet, ScrollRestoration } from 'react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingContact } from './components/FloatingContact';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans">
      <ScrollRestoration />
      <Header />
      <main className="min-h-screen w-full">
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}