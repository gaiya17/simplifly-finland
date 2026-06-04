"use client";
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { tourApi } from '../../lib/tourApi';
import { resortApi } from '../../lib/resortApi';
import Link from 'next/link';

export function SupportCTA() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tourApi.getOffers().catch(() => []),
      resortApi.getOffers().catch(() => [])
    ]).then(([tours, resorts]) => {
      const tourOffers = Array.isArray(tours) ? tours.map((t: any) => ({ ...t, offerType: 'tour' })) : [];
      const resortOffers = Array.isArray(resorts) ? resorts.map((r: any) => ({ ...r, offerType: 'resort' })) : [];
      const allOffers = [...tourOffers, ...resortOffers].filter(offer => offer.offerPoster);
      setOffers(allOffers);
      setIsLoading(false);
    });
  }, []);

  // Auto rotate carousel every 4.5 seconds
  useEffect(() => {
    if (isHovered || offers.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, offers.length]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  return (
    /* Changed outer wrapper from absolute h-0 to relative block flow with negative top margin.
       This ensures the CTA card occupies physical space in the layout, dynamically pushing
       subsequent content down and mathematically preventing overlaps on all viewports! */
    <div className="w-full relative z-30 flex justify-center mt-[-55px] md:mt-[-70px] lg:mt-[-85px]">
      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24">
        {/* Generous horizontal padding px-10 sm:px-16 lg:px-24 to create spacing from the left and right corners */}
        <div 
          className="w-full bg-gradient-to-r from-[#f0f6ff] to-[#e6f1ff] rounded-[20px] shadow-[0_20px_50px_rgba(26,132,255,0.08)] border border-[#1a84ff]/15 relative min-h-[140px] md:min-h-[155px] lg:min-h-[175px] px-10 sm:px-16 lg:px-24 py-5 md:py-4 lg:py-5 flex items-center justify-between overflow-hidden"
        >

          {/* Grid Layout restored: content on left (col-span-5), carousel on right (col-span-7) to allow maximum poster width */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full h-full relative z-10 py-1">
            
            {/* Left Content Side - Centered text on mobile, perfectly left-aligned on desktop */}
            <div className="col-span-1 md:col-span-5 lg:col-span-5 flex flex-col justify-center items-center md:items-start text-center md:text-left">
              {/* Premium Slim Blue-themed Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a84ff]/10 text-[#1a84ff] font-extrabold text-[9px] lg:text-[10px] tracking-wider uppercase mb-2 shadow-sm border border-[#1a84ff]/10 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a84ff] animate-ping shrink-0" />
                <span>24/7 Premium Concierge</span>
              </div>
              
              {/* Compact title size text-[19px] sm:text-[22px] lg:text-[26px] */}
              <h2 className="text-[#041d3c] font-black text-[19px] sm:text-[22px] lg:text-[26px] leading-[1.2] mb-1.5 ">
                Our Team is Available <span className="text-[#1a84ff]">24 Hours, 7 Days</span>
              </h2>
              
              {/* Compact description text-[11px] lg:text-[12.5px] */}
              <p className="text-[#041d3c]/70 text-[11px] lg:text-[12.5px] font-semibold mb-3 lg:mb-3.5 leading-relaxed max-w-[400px]">
                Connect with our expert travel agents instantly on WhatsApp to plan your dream Maldives holiday.
              </p>

              {/* Compact WhatsApp Button - Centered on mobile */}
              <a 
                href="https://wa.me/358408192758"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white rounded-[12px] shadow-[0_8px_20px_rgba(7,94,84,0.2)] hover:shadow-[0_12px_28px_rgba(7,94,84,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 w-fit overflow-hidden"
              >
                {/* Active Pulse Aura */}
                <span className="absolute inset-0 w-full h-full rounded-[12px] border border-[#128c7e] animate-pulse opacity-60 group-hover:opacity-0 transition-opacity duration-300"></span>
                
                {/* Visual Sheen Sweep */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out z-0"></span>

                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4.5 h-4.5 group-hover:scale-110 group-hover:rotate-[12deg] transition-transform duration-300 relative z-10 shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                
                <span className="text-[12.5px] lg:text-[13.5px] font-bold tracking-wide relative z-10 whitespace-nowrap">+358 40 819 2758</span>
              </a>
            </div>

            {/* Right Side: Expanded Double Poster Slider (Increased height as well to show full wide banner) */}
            <div 
              className="col-span-1 md:col-span-7 lg:col-span-7 flex flex-col justify-center items-center md:items-end w-full relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isLoading ? (
                <div className="relative w-fit h-[75px] sm:h-[110px] lg:h-[150px] flex items-center justify-center gap-3 lg:gap-4 shrink-0 px-2 mt-4 md:mt-0">
                  <div className="w-[125px] sm:w-[185px] lg:w-[270px] h-[62px] sm:h-[92px] lg:h-[135px] rounded-[10px] bg-[#041d3c]/5 animate-pulse shrink-0"></div>
                  <div className="w-[125px] sm:w-[185px] lg:w-[270px] h-[62px] sm:h-[92px] lg:h-[135px] rounded-[10px] bg-[#041d3c]/5 animate-pulse shrink-0 hidden md:block"></div>
                </div>
              ) : offers.length > 0 ? (
                <>
                  <div className="relative w-fit h-[75px] sm:h-[110px] lg:h-[150px] flex items-center justify-center group">
                    
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        className="flex gap-3 lg:gap-4 items-center shrink-0"
                      >
                        {/* First Poster Card */}
                        <Link href={`/${offers[currentIndex].offerType === 'resort' ? 'maldives-resorts' : 'sri-lanka-tours'}/${offers[currentIndex].category?.slug || 'all'}/${offers[currentIndex].slug}`} className="w-[125px] sm:w-[185px] lg:w-[270px] h-[62px] sm:h-[92px] lg:h-[135px] rounded-[10px] overflow-hidden shadow-[0_4px_12px_rgba(4,29,60,0.06)] border border-[#041d3c]/5 shrink-0 bg-white relative block hover:scale-[1.02] transition-transform">
                          <img 
                            src={offers[currentIndex].offerPoster} 
                            alt={offers[currentIndex].title} 
                            className="w-full h-full object-cover select-none" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/4 to-white/8 pointer-events-none" />
                        </Link>

                        {/* Second Poster Card */}
                        {offers.length > 1 && (
                          <Link href={`/${offers[(currentIndex + 1) % offers.length].offerType === 'resort' ? 'maldives-resorts' : 'sri-lanka-tours'}/${offers[(currentIndex + 1) % offers.length].category?.slug || 'all'}/${offers[(currentIndex + 1) % offers.length].slug}`} className="w-[125px] sm:w-[185px] lg:w-[270px] h-[62px] sm:h-[92px] lg:h-[135px] rounded-[10px] overflow-hidden shadow-[0_4px_12px_rgba(4,29,60,0.06)] border border-[#041d3c]/5 shrink-0 bg-white relative block hover:scale-[1.02] transition-transform">
                            <img 
                              src={offers[(currentIndex + 1) % offers.length].offerPoster} 
                              alt={offers[(currentIndex + 1) % offers.length].title} 
                              className="w-full h-full object-cover select-none" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/4 to-white/8 pointer-events-none" />
                          </Link>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Glassmorphic Carousel Navigation Controls */}
                    {offers.length > 1 && (
                      <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none">
                        <button 
                          onClick={handlePrev} 
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-[0_4px_12px_rgba(4,29,60,0.1)] border border-[#041d3c]/5 text-[#041d3c] flex items-center justify-center hover:bg-white hover:text-[#1a84ff] hover:scale-105 active:scale-95 transition-all duration-200 pointer-events-auto cursor-pointer"
                          aria-label="Previous Offer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={handleNext} 
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-[0_4px_12px_rgba(4,29,60,0.1)] border border-[#041d3c]/5 text-[#041d3c] flex items-center justify-center hover:bg-white hover:text-[#1a84ff] hover:scale-105 active:scale-95 transition-all duration-200 pointer-events-auto cursor-pointer"
                          aria-label="Next Offer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Slim Dot Pagination Indicators */}
                  {offers.length > 1 && (
                    <div className="flex gap-2 mt-2.5 z-20 justify-center w-full">
                      {offers.map((offer, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                          <button
                            key={offer.id}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              isActive 
                                ? 'w-5 bg-[#1a84ff] shadow-[0_1.5px_4px_rgba(26,132,255,0.25)]' 
                                : 'w-1.5 bg-[#041d3c]/15 hover:bg-[#041d3c]/30'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              ) : null}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
