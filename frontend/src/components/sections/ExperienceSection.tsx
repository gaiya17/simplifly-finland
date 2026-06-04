"use client";
import { MapPin, ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { useTranslation } from '../../lib/i18n/LanguageContext';

export function ExperienceSection({ gallery = [] }: { gallery?: any[] }) {
  const spanStyles = [
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1"
  ];
  const { t } = useTranslation();
  return (
    <section className="bg-transparent py-[80px] lg:py-[100px] w-full font-poppins relative overflow-hidden">
      {/* Subtle Ambient Decorative Glowing Background lights */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_75%)] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(4,29,60,0.03)_0%,_transparent_75%)] pointer-events-none z-0" />

      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
        
        {/* Centered Modern Section Header */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-3.5 shadow-sm border border-[#1a84ff]/10">
            <span>{t.experience.badge}</span>
          </div>
          <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight mb-4 ">
            {t.experience.title}
          </h2>
          <div className="w-16 h-1 bg-[#1a84ff] rounded-full mb-5"></div>
          <p className="text-gray-600 text-[15px] lg:text-[16px] font-medium max-w-3xl leading-relaxed">
            {t.experience.subtitle}
          </p>
        </div>

        {/* Masonry-style Grid Gallery with Deep Rounded Borders & Advanced Hover Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-5 h-[650px]">
          {gallery.map((img, index) => (
            <div 
              key={img.id} 
              className={`relative rounded-[24px] overflow-hidden group border border-[#041d3c]/5 shadow-sm hover:shadow-[0_20px_50px_rgba(4,29,60,0.12)] transition-all duration-500 ease-out cursor-pointer ${spanStyles[index % spanStyles.length]}`}
            >
              <ImageWithFallback 
                src={img.url} 
                alt={img.title || img.category}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out z-0" 
              />
              
              {/* Modern Glassmorphic ArrowUpRight Badge floating in top right on Hover */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/25 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-20 shadow-md">
                <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>

              {/* Dynamic Gradient Overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/85 via-black/20 to-transparent opacity-65 group-hover:opacity-85 transition-opacity duration-500 z-10"></div>
              
              {/* Content Overlay - Text elements lift smoothly on card hover */}
              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-7 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out z-20 flex flex-col items-start text-left">
                <h3 className="text-white font-black text-lg sm:text-xl lg:text-[22px] mb-2 leading-tight drop-shadow-md">
                  {img.title || img.category}
                </h3>
                <div className="flex items-center gap-1.5 text-white/90 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-[6px] border border-white/10 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#1a84ff]" />
                  <span className="text-[12px] font-extrabold uppercase tracking-widest leading-none">
                    {img.category || "Location"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Gallery Button Redirected to Down as Center Link */}
        <div className="flex justify-center mt-16">
          <Link 
            href="/gallery" 
            className="inline-flex items-center justify-center gap-2 bg-[#041d3c] hover:bg-[#1a84ff] text-white font-extrabold px-10 py-4.5 rounded-[16px] shadow-[0_10px_30px_rgba(4,29,60,0.12)] hover:shadow-[0_16px_36px_rgba(26,132,255,0.25)] hover:-translate-y-1 transition-all duration-300 text-[15px] uppercase tracking-wider group w-full md:w-auto text-center"
          >
            <span>{t.experience.viewAll}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>

      </div>
    </section>
  );
}
