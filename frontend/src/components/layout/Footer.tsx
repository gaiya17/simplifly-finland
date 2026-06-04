'use client';
import { MapPin, Phone, Globe, Camera, Video, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { useTranslation } from '../../lib/i18n/LanguageContext';


const offices = [
  {
    region: 'Finland',
    address: 'Kardinaalinkatu 4C 20, 20540, Turku, Finland',
    phones: ['+358 40 8193030', '+358 40 819 2758'],
  },
  {
    region: 'Sri Lanka',
    address: 'Simplifly Lanka (Pvt) Ltd, No. 46/15, Samanala Mawatha, Athurugiriya,     Sri Lanka',
    phones: ['+94 76 342 7054', '+94 77 227 8407'],
  },
  {
    region: 'Maldives',
    address: 'H Aagadhage, Boduthakurufaanu Magu, Malé 20026, Maldives',
    phones: ['+94 76 342 7054'],
  },
];

export function Footer() {
  const { t } = useTranslation();

  const navLinks = [
    { label: t.footer.navLinks[0], to: '/' },
    { label: t.footer.navLinks[1], to: '/who-we-are' },
    { label: t.footer.navLinks[2], to: '/sri-lanka-tours' },
    { label: t.footer.navLinks[3], to: '/maldives-resorts' },
    { label: t.footer.navLinks[4], to: '/blog' },
    { label: t.footer.navLinks[5], to: '/gallery' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#041d3c] to-[#021124] text-white overflow-hidden font-poppins pt-20 pb-8 border-t border-[#1a84ff]/20">

      {/* Subtle ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(26,132,255,0.06)_0%,_transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_65%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24">

        {/* ── 4-COLUMN MAIN GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1.4fr_1fr] gap-12 lg:gap-16 pb-16">

          {/* COLUMN 1: Brand & Socials */}
          <div className="flex flex-col">
            <Link href="/" className="inline-block mb-4">
              <p className="text-white font-black text-[28px]  leading-none">
                Simplifly <span className="text-[#1a84ff]">Finland</span>
              </p>
            </Link>
            <p className="text-white/50 text-[14px] leading-[1.8] font-medium mb-8 max-w-xs">
              {t.footer.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {[
                { icon: Globe, href: '#', label: 'Facebook' },
                { icon: Camera, href: '#', label: 'Instagram' },
                { icon: Video, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#1a84ff] hover:border-[#1a84ff] transition-all duration-300 shadow-[0_4px_12px_rgba(4,29,60,0.2)] hover:-translate-y-1"
                >
                  <Icon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2: Explore (Links) */}
          <div className="flex flex-col">
            <h4 className="text-white font-black text-[12px] tracking-[0.15em] uppercase mb-6 flex flex-col gap-3">
              {t.footer.explore}
              <span className="w-8 h-0.5 bg-gradient-to-r from-[#1a84ff] to-transparent rounded-full" />
            </h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.to}
                    className="group inline-flex items-center gap-2 text-white/55 hover:text-white text-[13.5px] font-medium transition-all duration-300"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#1a84ff] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Global Offices */}
          <div className="flex flex-col">
            <h4 className="text-white font-black text-[12px] tracking-[0.15em] uppercase mb-6 flex flex-col gap-3">
              {t.footer.offices}
              <span className="w-8 h-0.5 bg-gradient-to-r from-[#1a84ff] to-transparent rounded-full" />
            </h4>

            <div className="flex flex-col gap-6">
              {offices.map((office) => (
                <div key={office.region} className="group flex items-start gap-4 p-3 -ml-3 rounded-[16px] hover:bg-white/5 transition-colors duration-300 cursor-default">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-[#1a84ff]/10 border border-[#1a84ff]/20 flex items-center justify-center group-hover:bg-[#1a84ff] transition-colors duration-300">
                    <MapPin className="w-4 h-4 text-[#1a84ff] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-white font-extrabold text-[13px] uppercase tracking-wider">{office.region}</p>
                    <p className="text-white/45 text-[12px] leading-[1.6] font-medium max-w-[240px]">{office.address}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      {office.phones.map((phone, idx) => (
                        <a key={idx} href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 text-white/45 hover:text-[#1a84ff] text-[12px] font-medium transition-colors duration-200">
                          <Phone className="w-3 h-3" /> {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 4: Certifications */}
          <div className="flex flex-col">
            <h4 className="text-white font-black text-[12px] tracking-[0.15em] uppercase mb-6 flex flex-col gap-3">
              {t.footer.accreditations}
              <span className="w-8 h-0.5 bg-gradient-to-r from-[#1a84ff] to-transparent rounded-full" />
            </h4>

            <div className="flex flex-col gap-6 items-start mt-1">
              <ImageWithFallback src="/images/TRANS2.jpg" alt="KKV Registration" className="h-11 w-auto object-contain mix-blend-screen opacity-90 hover:opacity-100 transition-opacity duration-300" />
              <ImageWithFallback src="/images/images-Picsart-AiImageEnhancer-copy.jpg" alt="SMAL Tunnus" className="h-11 w-auto object-contain mix-blend-screen opacity-90 hover:opacity-100 transition-opacity duration-300" />
              <ImageWithFallback src="/images/pata-finland-chapter.jpg" alt="PATA Finland Chapter" className="h-9 w-auto object-contain rounded-md hover:opacity-90 transition-opacity duration-300" />
            </div>
          </div>

        </div>

        {/* ── SEPARATOR ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-6" />

        {/* ── BOTTOM BAR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-[12px] font-medium text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-white/60">Simplifly Finland</span>. {t.footer.copyright}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-white/40 hover:text-white text-[12px] font-medium transition-colors duration-200">{t.footer.privacyPolicy}</Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <Link href="/terms-and-conditions" className="text-white/40 hover:text-white text-[12px] font-medium transition-colors duration-200">{t.footer.terms}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
