"use client";
import React from 'react';
import { ImageWithFallback } from '../shared/ImageWithFallback';

const logos = [
  { type: "image", src: '/images/partners/Accor Hotels.png', alt: "Accor Hotels" },
  { type: "image", src: '/images/partners/Crossroads Maldives.png', alt: "Crossroads Maldives" },
  { type: "image", src: '/images/partners/Emerald-Faarufushi-Resort-and-Spa.png', alt: "Emerald Faarufushi Resort & Spa" },
  { type: "image", src: '/images/partners/JW Mariott Maldives.png', alt: "JW Mariott Maldives" },
  { type: "image", src: '/images/partners/Joali Maldives.png', alt: "Joali Maldives" },
  { type: "image", src: '/images/partners/Marriott Resort Weligama Bay.png', alt: "Marriott Resort Weligama Bay" },
  { type: "image", src: '/images/partners/One-and-Only-Reethi-Rah-Malidives.png', alt: "One&Only Reethi Rah Malidives" },
  { type: "image", src: '/images/partners/Patina Maldives Fari ISland.png', alt: "Patina Maldives Fari ISland" },
  { type: "image", src: '/images/partners/Shangri-La-Hotels-and-Resorts.png', alt: "Shangri-La Hotels & Resorts" },
  { type: "image", src: '/images/partners/St. Regis.png', alt: "St. Regis" },
  { type: "image", src: '/images/partners/Sun Siyam Resorts.png', alt: "Sun Siyam Resorts" },
  { type: "image", src: '/images/partners/The RITZ Carlton Maldives.png', alt: "The RITZ Carlton Maldives" },
  { type: "image", src: '/images/partners/Universal Resorts.png', alt: "Universal Resorts" },
  { type: "image", src: '/images/partners/Villa-Hotels-and-Resorts-Maldives.png', alt: "Villa Hotels & Resorts Maldives" },
  { type: "image", src: '/images/partners/Waldorf Astoria Maldives Ithafushi.png', alt: "Waldorf Astoria Maldives Ithafushi" },
];

export function BrandLogos() {
  return (
    <section className="bg-transparent py-[80px] lg:py-[100px] w-full overflow-hidden relative font-poppins">
      
      {/* Subtle Glowing Background Blur */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[150px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none z-0" />

      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-center relative z-10">
        
        {/* Advanced Centered Section Header Badge with Symmetrical Flow Lines */}
        <div className="flex items-center gap-5 mb-14 w-full max-w-4xl justify-center">
          <div className="h-[1px] bg-[#1a84ff]/15 flex-grow rounded-full hidden sm:block" />
          <span className="text-[#1a84ff] font-extrabold text-[11px] lg:text-[12px] uppercase tracking-[0.3em] whitespace-nowrap bg-[#1a84ff]/8 border border-[#1a84ff]/10 rounded-full px-6 py-2 shadow-sm">
            ✦ Our Trusted Partners
          </span>
          <div className="h-[1px] bg-[#1a84ff]/15 flex-grow rounded-full hidden sm:block" />
        </div>

        {/* Marquee Infinite Smooth Scrolling Container (Completely Box-less!) */}
        <div className="relative w-full overflow-hidden flex [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          
          <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap items-center py-4">
            
            {/* Loop 1 */}
            {logos.map((logo, index) => (
              <div 
                key={`logo-1-${index}`} 
                className="flex items-center justify-center mx-10 lg:mx-16 shrink-0 transition-all duration-500 hover:scale-105 cursor-pointer group"
              >
                <ImageWithFallback 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="h-[55px] md:h-[75px] w-auto object-contain transition-all duration-500 opacity-85 group-hover:opacity-100" 
                />
              </div>
            ))}
            
            {/* Loop 2 (Seamless clone) */}
            {logos.map((logo, index) => (
              <div 
                key={`logo-2-${index}`} 
                className="flex items-center justify-center mx-10 lg:mx-16 shrink-0 transition-all duration-500 hover:scale-105 cursor-pointer group"
              >
                <ImageWithFallback 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="h-[55px] md:h-[75px] w-auto object-contain transition-all duration-500 opacity-85 group-hover:opacity-100" 
                />
              </div>
            ))}

            {/* Loop 3 (Extra buffer clone) */}
            {logos.map((logo, index) => (
              <div 
                key={`logo-3-${index}`} 
                className="flex items-center justify-center mx-10 lg:mx-16 shrink-0 transition-all duration-500 hover:scale-105 cursor-pointer group"
              >
                <ImageWithFallback 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="h-[55px] md:h-[75px] w-auto object-contain transition-all duration-500 opacity-85 group-hover:opacity-100" 
                />
              </div>
            ))}
            
          </div>
        </div>

      </div>

      {/* Internal Style for Continuous Smooth Scrolling Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}} />
    </section>
  );
}
