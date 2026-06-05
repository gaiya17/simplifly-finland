'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useLanguage, useTranslation, LANGUAGES, LanguageCode } from '../../lib/i18n/LanguageContext';
import { resortApi } from '../../lib/resortApi';
import { tourApi } from '../../lib/tourApi';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);

  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const [maldivesCategories, setMaldivesCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [sriLankaCategories, setSriLankaCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [maldives, sriLanka] = await Promise.all([
          resortApi.getCategories().catch(() => []),
          tourApi.getCategories().catch(() => [])
        ]);
        setMaldivesCategories(Array.isArray(maldives) ? maldives : []);
        setSriLankaCategories(Array.isArray(sriLanka) ? sriLanka : []);
      } catch (error) {
        console.error("Failed to load categories for header:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close lang dropdown when clicking outside
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-lang-picker]')) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  const toggleMobile = (key: string) =>
    setMobileExpanded((prev) => (prev === key ? null : key));

  const handleLangSelect = (code: LanguageCode) => {
    setLanguage(code);
    setLangOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${isScrolled
            ? 'bg-[#041d3c]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(4,29,60,0.3)] border-b border-white/5'
            : 'bg-transparent'
          }`}
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 h-[72px] grid grid-cols-3 items-center">

          {/* ── Logo ── */}
          <div className="flex items-center justify-start">
            <Link href="/" className="flex-shrink-0">
              <img src="/simplifly-logo.svg" alt="Simplifly Finland" className="h-10 w-auto transition-opacity duration-300 hover:opacity-80" />
            </Link>
          </div>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 h-full">

            {/* Maldives Resorts */}
            <div className="relative group h-full flex items-center">
              <Link
                href="/maldives-resorts"
                className="flex items-center gap-1 text-white/90 hover:text-white text-[13px] font-semibold px-3 py-2 rounded-[10px] hover:bg-white/8 transition-all duration-200 whitespace-nowrap"
              >
                {t.nav.maldivesResorts}
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-300 shrink-0" />
              </Link>
              <div className="absolute top-[calc(100%-8px)] left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                <div className="relative bg-[#041d3c]/95 backdrop-blur-2xl border border-white/10 rounded-[16px] shadow-2xl py-3 min-w-[240px]">
                  <p className="text-[10px] font-semibold tracking-wider text-white/40 px-5 mb-2 uppercase">{t.nav.maldivesCategory}</p>
                  <div className="flex flex-col">
                    {maldivesCategories.map((item, i) => (
                      <Link
                        key={item.slug}
                        href={`/maldives-resorts/${item.slug}`}
                        className="flex items-center px-5 py-2.5 text-[13.5px] text-white/70 hover:text-white hover:bg-white/5 hover:pl-6 transition-all duration-200"
                      >
                        {item.name}
                      </Link>
                    ))}
                    {/* The Full Collection */}
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <Link
                        href="/maldives-resorts/all"
                        className="flex items-center px-5 py-2.5 text-[13.5px] text-[#1a84ff] hover:text-[#1a84ff]/80 hover:bg-white/5 hover:pl-6 transition-all duration-200 font-semibold"
                      >
                        The Full Collection &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sri Lankan Tours */}
            <div className="relative group h-full flex items-center">
              <Link
                href="/sri-lanka-tours"
                className="flex items-center gap-1 text-white/90 hover:text-white text-[13px] font-semibold px-3 py-2 rounded-[10px] hover:bg-white/8 transition-all duration-200 whitespace-nowrap"
              >
                {t.nav.sriLankaTours}
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-300 shrink-0" />
              </Link>
              <div className="absolute top-[calc(100%-8px)] left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                <div className="relative bg-[#041d3c]/95 backdrop-blur-2xl border border-white/10 rounded-[16px] shadow-2xl py-3 min-w-[240px]">
                  <p className="text-[10px] font-semibold tracking-wider text-white/40 px-5 mb-2 uppercase">{t.nav.sriLankaCategory}</p>
                  <div className="flex flex-col">
                    {sriLankaCategories.map((item, i) => (
                      <Link
                        key={item.slug}
                        href={`/sri-lanka-tours/${item.slug}`}
                        className="flex items-center px-5 py-2.5 text-[13.5px] text-white/70 hover:text-white hover:bg-white/5 hover:pl-6 transition-all duration-200"
                      >
                        {item.name}
                      </Link>
                    ))}
                    {/* The Full Collection */}
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <Link
                        href="/sri-lanka-tours/all"
                        className="flex items-center px-5 py-2.5 text-[13.5px] text-[#D4AF37] hover:text-[#D4AF37]/80 hover:bg-white/5 hover:pl-6 transition-all duration-200 font-semibold"
                      >
                        The Full Collection &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple links */}
            {[
              { label: t.nav.whoWeAre, to: '/who-we-are' },
              { label: t.nav.gallery, to: '/gallery' },
              { label: t.nav.blog, to: '/blog' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                href={to}
                className="text-white/90 hover:text-white text-[13px] font-semibold px-3 py-2 rounded-[10px] hover:bg-white/8 transition-all duration-200 whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile placeholder */}
          <div className="lg:hidden" />

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-2.5">
            <div className="hidden lg:flex items-center gap-2.5">

              {/* Language picker — click-controlled */}
              <div className="relative" data-lang-picker>
                <button
                  onClick={() => setLangOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-[12px] border border-white/10 bg-white/5 backdrop-blur-sm text-white text-[13px] font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <img src={`https://flagcdn.com/w40/${language.flag}.png`} alt={language.name} className="w-4 h-auto rounded-sm" />
                  <span>{language.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute top-[calc(100%+4px)] right-0 pt-2 transition-all duration-200 z-50 ${langOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                    }`}
                >
                  <div className="relative bg-[#041d3c]/95 backdrop-blur-2xl border border-white/10 rounded-[16px] shadow-2xl py-2 min-w-[170px]">
                    {LANGUAGES.map((lang) => {
                      const isActive = lang.code === language.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleLangSelect(lang.code)}
                          className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13px] hover:bg-white/5 transition-all duration-150 ${isActive ? 'text-white font-semibold' : 'text-white/60 font-medium'
                            }`}
                        >
                          <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.name} className="w-4 h-auto rounded-sm" />
                          {lang.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/94715233845"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-gradient-to-r from-[#075e54] to-[#128c7e] hover:from-[#128c7e] hover:to-[#075e54] text-white text-[13px] font-semibold hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(7,94,84,0.35)] hover:shadow-[0_8px_20px_rgba(7,94,84,0.45)] transition-all duration-250 whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t.nav.whatsappUs}
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[10px] bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-[#041d3c] z-[70] flex flex-col transition-transform duration-400 ease-out lg:hidden shadow-[-20px_0_60px_rgba(0,0,0,0.4)] ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <img src="/simplifly-logo.svg" alt="Simplifly Finland" className="h-8 w-auto" />
          <button
            className="w-9 h-9 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-white hover:bg-white/15 transition-all"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          <div>
            <button
              onClick={() => toggleMobile('maldives')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-[12px] text-white/90 text-[14px] font-semibold hover:bg-white/6 transition-all"
            >
              {t.nav.maldivesResorts}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileExpanded === 'maldives' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === 'maldives' ? 'max-h-[500px]' : 'max-h-0'}`}>
              <div className="pl-4 pb-2 flex flex-col gap-1 mt-1">
                {maldivesCategories.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/maldives-resorts/${item.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 rounded-[10px] text-white/60 text-[13.5px] font-medium hover:text-white hover:bg-white/5 hover:pl-5 transition-all"
                  >
                    {item.name}
                  </Link>
                ))}
                {/* The Full Collection */}
                <Link
                  href="/maldives-resorts/all"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-[10px] text-[#1a84ff] text-[13.5px] font-semibold hover:bg-white/5 hover:pl-5 transition-all mt-1"
                >
                  The Full Collection &rarr;
                </Link>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => toggleMobile('srilanka')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-[12px] text-white/90 text-[14px] font-semibold hover:bg-white/6 transition-all"
            >
              {t.nav.sriLankaTours}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileExpanded === 'srilanka' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === 'srilanka' ? 'max-h-[500px]' : 'max-h-0'}`}>
              <div className="pl-4 pb-2 flex flex-col gap-1 mt-1">
                {sriLankaCategories.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/sri-lanka-tours/${item.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 rounded-[10px] text-white/60 text-[13.5px] font-medium hover:text-white hover:bg-white/5 hover:pl-5 transition-all"
                  >
                    {item.name}
                  </Link>
                ))}
                {/* The Full Collection */}
                <Link
                  href="/sri-lanka-tours/all"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-[10px] text-[#D4AF37] text-[13.5px] font-semibold hover:bg-white/5 hover:pl-5 transition-all mt-1"
                >
                  The Full Collection &rarr;
                </Link>
              </div>
            </div>
          </div>

          {[
            { label: t.nav.whoWeAre, to: '/who-we-are' },
            { label: t.nav.gallery, to: '/gallery' },
            { label: t.nav.blog, to: '/blog' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              href={to}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-[12px] text-white/90 text-[14px] font-semibold hover:bg-white/6 transition-all"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-5 py-5 border-t border-white/8 flex flex-col gap-3">
          {/* Mobile language grid */}
          <div>
            <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest mb-2 px-1">Language</p>
            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGES.map((lang) => {
                const isActive = lang.code === language.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => { handleLangSelect(lang.code); setMobileOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] font-semibold transition-all ${isActive
                        ? 'bg-[#1a84ff] text-white'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                  >
                    <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.name} className="w-4 h-auto rounded-sm" />
                    {lang.name}
                  </button>
                );
              })}
            </div>
          </div>

          <a
            href="https://wa.me/94715233845"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white text-[13px] font-semibold transition-all w-full shadow-[0_4px_14px_rgba(7,94,84,0.3)]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t.nav.whatsappUs}
          </a>
        </div>
      </div>
    </>
  );
}
