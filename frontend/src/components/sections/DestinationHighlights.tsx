"use client";
import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { useTranslation } from '../../lib/i18n/LanguageContext';

export function DestinationHighlights({ tours = [] }: { tours?: any[] }) {
  const { t } = useTranslation();
  return (
    <section className="bg-transparent w-full pb-[100px] pt-10 lg:pt-12 relative font-poppins overflow-hidden">
      {/* Decorative Brand Ambient Glowing Backgrounds */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.05)_0%,_transparent_70%)] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(4,29,60,0.03)_0%,_transparent_70%)] pointer-events-none z-0" />
      
      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-3.5 shadow-sm border border-[#1a84ff]/10">
            <span>{t.destinations.badge}</span>
          </div>
          <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight mb-4 ">
            {t.destinations.title}
          </h2>
          <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5"></div>
          <p className="text-gray-600 text-[15px] lg:text-[16px] font-medium max-w-3xl leading-relaxed">
            {t.destinations.subtitle}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((pkg) => (
            <Link 
              href={`/sri-lanka-tours/${pkg.category?.slug || 'tour'}/${pkg.slug}`} 
              key={pkg.id} 
              className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(4,29,60,0.03)] hover:shadow-[0_24px_60px_rgba(26,132,255,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out h-full group cursor-pointer block"
            >
              <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-[#f4f7fb]">
                <ImageWithFallback
                  src={pkg.packageImage || pkg.heroImage || 'https://via.placeholder.com/600'}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-65 pointer-events-none" />

                {pkg.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-[#e11d48] text-white rounded-[10px] px-3.5 py-2 font-extrabold text-[11px] shadow-[0_6px_16px_rgba(225,29,72,0.35)] tracking-wide z-10 border border-white/10">
                    -{pkg.discount}%
                  </div>
                )}

                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md border border-white/30 rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] z-10">
                  <Clock className="w-3.5 h-3.5 text-[#1a84ff]" />
                  <span className="text-[#041d3c] font-black text-[10px] uppercase tracking-wider">
                    {pkg.nights}N / {pkg.days}D
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col flex-grow text-left">
                <div className="mb-2">
                  <span className="text-[#1a84ff] font-extrabold text-[10.5px] uppercase tracking-widest block line-clamp-1">
                    {pkg.category?.name || 'Tour Package'}
                  </span>
                </div>

                <h3 className="text-[#041d3c] font-black text-[19px] sm:text-[21px] leading-[1.3] line-clamp-2 mb-3 min-h-[54px]">
                  {pkg.title}
                </h3>

                <div className="mb-5 mt-1.5 min-h-[42px]">
                  <span className="text-black font-extrabold text-[11px] uppercase tracking-wider block mb-1">
                    Destinations
                  </span>
                  <p className="text-black text-[13px] font-medium leading-relaxed line-clamp-2">
                    {pkg.destinations || "Multi-city journey"}
                  </p>
                </div>

                <div className="h-[1px] bg-[#041d3c]/5 w-full mb-5" />

                <div className="mt-auto flex items-center justify-between gap-4">
                  <div className="flex flex-col text-left">
                    <p className="text-gray-400 text-[9.5px] font-extrabold uppercase tracking-widest mb-0.5">
                      {t.destinations.startingFrom}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-black font-black text-[25px] leading-none">
                        €{pkg.discount > 0 ? Math.round(pkg.price * (1 - pkg.discount / 100)) : pkg.price}
                      </span>
                      {pkg.discount > 0 && (
                        <span className="text-gray-400 line-through text-[12.5px] font-bold">
                          €{pkg.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#041d3c] group-hover:bg-[#1a84ff] text-white px-5 py-3 rounded-[12px] font-extrabold text-[12px] tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 shrink-0 shadow-md group-hover:shadow-[0_8px_20px_rgba(26,132,255,0.25)]">
                    <span>{t.destinations.viewMore}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Packages Link Button */}
        <div className="flex justify-center mt-16">
          <Link 
            href="/sri-lanka-tours/all" 
            className="inline-flex items-center justify-center gap-2 bg-[#041d3c] hover:bg-[#1a84ff] text-white font-extrabold px-10 py-4.5 rounded-[16px] shadow-[0_10px_30px_rgba(4,29,60,0.12)] hover:shadow-[0_16px_36px_rgba(26,132,255,0.25)] hover:-translate-y-1 transition-all duration-300 text-[15px] uppercase tracking-wider group w-full md:w-auto text-center"
          >
            <span>{t.destinations.viewAll}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
