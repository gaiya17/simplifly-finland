"use client";
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { ChevronLeft, ChevronRight, MapPin, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React, { useRef } from 'react';
import { useSiteAssets } from '../providers/SiteAssetsProvider';

export function MaldivesResorts({ resorts = [] }: { resorts?: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { getAssetUrl } = useSiteAssets();
  const bgImage = getAssetUrl('homepage_maldives_bg', '/images/MaldivesResortBG.jpg');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? window.innerWidth * 0.85 : 360;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative w-full overflow-hidden min-h-[600px] py-[100px] lg:py-[140px] font-poppins">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={bgImage}
          alt="Maldives Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Blue vibe gradient overlay */}
        <div className="absolute inset-0 bg-[#041d3c]/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/90 via-[#041d3c]/60 to-[#041d3c]/20"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-12 lg:px-24 h-full flex flex-col justify-center items-center">

        {/* Centered Modern Section Header matching Sri Lanka Section */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 backdrop-blur-sm text-white font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-3.5 shadow-sm border border-white/12">
            <span>✦ EXCLUSIVE TROPICAL ESCAPES</span>
          </div>
          <h2 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight mb-4  drop-shadow-lg">
            Maldives Resorts
          </h2>
          <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5"></div>
          <p className="text-white/90 text-[15px] lg:text-[16px] font-medium max-w-3xl leading-relaxed drop-shadow-md">
            Escape to the Maldives for an ultra-luxury holiday beyond imagination
          </p>
        </div>

        {/* Resort Packages Native CSS Slider */}
        <div className="mt-8 w-full relative z-10 group">
          {resorts.length > 0 ? (
            <>
              {/* Native Scroll Container */}
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 px-4 sm:px-0 hide-scrollbar scroll-smooth w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {resorts.map((pkg) => (
                  <div 
                    key={pkg.id} 
                    className="snap-center shrink-0 w-[85vw] sm:w-[340px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] outline-none"
                  >
                    <div className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(4,29,60,0.03)] hover:shadow-[0_24px_60px_rgba(26,132,255,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out h-full group/card cursor-pointer">

                      {/* Image Container with Zoom effect */}
                    <div className="relative h-[230px] w-full shrink-0 overflow-hidden bg-[#f4f7fb]">
                        <ImageWithFallback
                          src={pkg.heroImage || pkg.packageImage}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                        />

                      {/* Glossy Overlay inside Image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-70 pointer-events-none" />

                      {/* Top Right: Discount Tag (Coral Red) */}
                      {pkg.discount > 0 && (
                        <div className="absolute top-4 right-4 bg-[#e11d48] text-white rounded-[10px] px-3.5 py-2 font-extrabold text-[11px] shadow-[0_6px_16px_rgba(225,29,72,0.35)] tracking-wide z-10 border border-white/10">
                          {pkg.discount}%
                        </div>
                      )}

                      {/* Bottom Left: Glassmorphic Guests/Nights Badge */}
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-white/40 rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10">
                        <Users className="w-3.5 h-3.5 text-[#1a84ff]" strokeWidth={2.5} />
                        <span className="text-[#041d3c] font-black text-[10px] uppercase tracking-wider">
                          1 Night, 2 Adults
                        </span>
                      </div>
                    </div>

                    {/* Content Wrapper (Sleeker and highly compact) */}
                    <div className="p-4 flex flex-col flex-grow text-left">

                      {/* Title */}
                      <h3 className="text-[#041d3c] font-extrabold text-[17px] sm:text-[19px] md:text-[21px] leading-[1.25] line-clamp-2 mb-1.5 min-h-[44px]">
                        {pkg.title}
                      </h3>

                      {/* Location Block (Destinations layout styled in Black with tight spacing) */}
                      <div className="mb-2 mt-0 min-h-[36px]">
                        <span className="text-black font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">
                          Location
                        </span>
                        <p className="text-black text-[13px] font-medium leading-relaxed line-clamp-2">
                          {pkg.location}
                        </p>
                      </div>

                      {/* Symmetrical Platforms Reviews Block (Reduced spacing) */}
                      <div className="flex items-center justify-between w-full mb-2.5 pt-0">
                        {/* Booking.com Block */}
                        <div className="flex flex-col gap-1.5 w-[45%] shrink-0 text-left">
                          <div className="h-[18px] sm:h-[20px] flex items-center justify-start">
                            <ImageWithFallback src="/images/booking-logo.png" alt="Booking.com" className="h-[14px] sm:h-[16px] w-auto object-contain object-left shrink-0" style={{ minWidth: '70px' }} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="bg-[#003b95] text-white font-extrabold text-[10.5px] px-1.5 py-0.5 rounded-[4px] leading-tight shrink-0">
                              {Number(pkg.bookingRating || 0).toFixed(1)}
                            </div>
                            <span className="text-gray-400 text-[9.5px] sm:text-[10px] font-extrabold leading-none mt-0.5 truncate">
                              ({pkg.bookingReviews || 0})
                            </span>
                          </div>
                        </div>

                        {/* Vertical Separator */}
                        <div className="w-[1px] h-8 bg-[#041d3c]/8 rounded-full shrink-0"></div>

                        {/* TripAdvisor Block */}
                        <div className="flex flex-col gap-1.5 w-[45%] shrink-0 pl-1 text-left">
                          <div className="h-[18px] sm:h-[20px] flex items-center justify-start">
                            <ImageWithFallback
                              src="/images/tripadvisor-logo.png"
                              alt="TripAdvisor"
                              className="h-[14px] sm:h-[16px] w-auto object-contain object-left shrink-0"
                              style={{ minWidth: '70px' }}
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-[2px] sm:gap-[3px] shrink-0">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] rounded-full border-[1.5px] ${i < Math.round(pkg.tripAdvisorRating || 0)
                                    ? 'bg-[#00aa6c] border-[#00aa6c]'
                                    : 'bg-transparent border-[#00aa6c]'
                                    }`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-400 text-[9.5px] sm:text-[10px] font-extrabold leading-none mt-0.5 truncate">
                              ({pkg.tripAdvisorReviews || 0})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Elegant Separator Line (Compressed margin) */}
                      <div className="h-[1px] bg-[#041d3c]/5 w-full mb-2.5" />

                      {/* Bottom Action Section */}
                      <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        {/* Price block (Matches Sri Lanka Tours card sizes and Black colorway) */}
                        <div className="flex flex-col text-left">
                          <p className="text-gray-400 text-[9.5px] font-extrabold uppercase tracking-widest mb-0">
                            Starting From
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

                        {/* Action Buttons — stacked full-width on mobile, fixed-width column on sm+ */}
                        <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-[125px]">
                          <Link
                            href={`/maldives-resorts/${pkg.categories?.[0]?.slug || 'luxury'}/${pkg.slug}#inquire-form`}
                            className="w-full bg-white hover:bg-[#f4f7fb] text-[#041d3c] border border-[#041d3c]/20 hover:border-[#041d3c]/40 py-2 rounded-[12px] font-extrabold text-[11px] tracking-wider uppercase transition-all duration-300 text-center block"
                          >
                            Get a Quote
                          </Link>
                          <Link
                            href={`/maldives-resorts/${pkg.categories?.[0]?.slug || 'luxury'}/${pkg.slug}`}
                            className="w-full bg-[#041d3c] hover:bg-[#1a84ff] text-white py-2 rounded-[12px] font-extrabold text-[11px] tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-[0_8px_20px_rgba(26,132,255,0.25)] hover:-translate-y-0.5 text-center block"
                          >
                            Explore More
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

              {/* Navigation Arrows (visible on mobile if > 1 resort, on desktop if > 3 resorts) */}
              {resorts.length > 1 && (
                <>
                  <button
                    onClick={() => scroll('left')}
                    className={`flex absolute top-1/2 left-2 sm:left-4 lg:-left-12 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 items-center justify-center rounded-full bg-black/20 hover:bg-black/40 lg:bg-white/10 lg:hover:bg-white/20 backdrop-blur-md border border-white/40 lg:border-white/30 text-white transition-all duration-300 shadow-lg ${resorts.length <= 3 ? 'lg:hidden' : ''}`}
                    aria-label="Previous package"
                  >
                    <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    className={`flex absolute top-1/2 right-2 sm:right-4 lg:-right-12 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 items-center justify-center rounded-full bg-black/20 hover:bg-black/40 lg:bg-white/10 lg:hover:bg-white/20 backdrop-blur-md border border-white/40 lg:border-white/30 text-white transition-all duration-300 shadow-lg ${resorts.length <= 3 ? 'lg:hidden' : ''}`}
                    aria-label="Next package"
                  >
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 hover:scale-110 transition-transform" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-white/60 font-medium text-[15px]">No resorts selected to display.</p>
            </div>
          )}
        </div>

        {/* View All Resorts Button Below */}
        <div className="flex justify-center mt-12 z-10 relative">
          <Link
            href="/maldives-resorts/all"
            className="inline-flex items-center justify-center gap-2 bg-[#041d3c] hover:bg-[#1a84ff] text-white font-extrabold px-10 py-4.5 rounded-[16px] shadow-[0_10px_30px_rgba(4,29,60,0.12)] hover:shadow-[0_16px_36px_rgba(26,132,255,0.25)] hover:-translate-y-1 transition-all duration-300 text-[15px] uppercase tracking-wider group w-full md:w-auto text-center"
          >
            <span>View All Resorts</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>

      </div>
    </section>
  );
}
