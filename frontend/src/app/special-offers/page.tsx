"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from '../../components/shared/ImageWithFallback';
import { Clock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { tourApi } from '../../lib/tourApi';
import { resortApi } from '../../lib/resortApi';
import { useSiteAssets } from '../../components/providers/SiteAssetsProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpecialOffers() {
  const { getAssetUrl } = useSiteAssets();
  const heroAsset = getAssetUrl('sri_lanka_tours_hero', '/images/sltours.webp');

  const [tours, setTours] = useState<any[]>([]);
  const [resorts, setResorts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tours' | 'resorts'>('tours');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursData, resortsData] = await Promise.all([
          tourApi.getOffers().catch(() => []),
          resortApi.getOffers().catch(() => [])
        ]);
        
        const rawResorts = Array.isArray(resortsData) ? resortsData : [];
        const flattenedResorts: any[] = [];
        rawResorts.forEach(r => {
          if (r.customOffers && r.customOffers.length > 0) {
            r.customOffers.forEach((co: any, idx: number) => {
              flattenedResorts.push({
                ...r,
                uniqueKey: `${r.id}-offer-${idx}`,
                offerIdx: idx,
                customOffers: [co]
              });
            });
          } else {
            flattenedResorts.push({ ...r, uniqueKey: r.id });
          }
        });
        
        setTours(Array.isArray(toursData) ? toursData : []);
        setResorts(flattenedResorts);
      } catch (error) {
        console.error("Failed to fetch special offers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderTourCard = (pkg: any) => {
    const discountedPrice = pkg.discount > 0 
      ? Math.round(pkg.price * (1 - pkg.discount / 100)) 
      : null;

    return (
      <Link
        href={`/special-offers/${pkg.slug}`}
        key={pkg.id}
        className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(4,29,60,0.03)] hover:shadow-[0_24px_60px_rgba(26,132,255,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out h-full group cursor-pointer block"
      >
        <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-[#f4f7fb]">
          <ImageWithFallback
            src={pkg.packageImage || 'https://via.placeholder.com/600'}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-70 pointer-events-none" />

          {/* Discount Badge */}
          {(pkg.discount > 0 || pkg.offerPoster) && (
            <div className="absolute top-4 right-4 bg-[#e11d48] text-white rounded-[10px] px-3.5 py-1.5 font-extrabold text-[11px] shadow-[0_6px_16px_rgba(225,29,72,0.35)] tracking-wide z-10 border border-white/10">
              {pkg.discount > 0 ? `${pkg.discount}% OFF` : 'SPECIAL OFFER'}
            </div>
          )}

          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md border border-white/30 rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] z-10">
            <Clock className="w-3.5 h-3.5 text-[#1a84ff]" />
            <span className="text-[#041d3c] font-black text-[10px] uppercase tracking-wider">{pkg.nights}N / {pkg.days}D</span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow text-left">
          <div className="mb-2">
            <span className="text-[#1a84ff] font-extrabold text-[10px] uppercase tracking-widest block line-clamp-1">
              {pkg.category?.name || 'Tour Package'}
            </span>
          </div>

          <h3 className="text-[#041d3c] font-extrabold text-[18px] leading-[1.3] mb-3">
            {pkg.title}
          </h3>

          <div className="mb-5 mt-1">
            <span className="text-black font-extrabold text-[11px] uppercase tracking-wider block mb-1">
              Destinations
            </span>
            <p className="text-black text-[12px] font-medium leading-relaxed line-clamp-2">
              {pkg.destinations || "Multi-city journey"}
            </p>
          </div>

          <div className="h-[1px] bg-[#041d3c]/5 w-full mb-5" />

          <div className="mt-auto flex items-center justify-between gap-4">
            <div className="flex flex-col text-left">
              <p className="text-gray-400 text-[9.5px] font-extrabold uppercase tracking-widest mb-0.5">
                Starting From
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-black font-black text-[22px] leading-none">
                  €{discountedPrice ? discountedPrice.toLocaleString() : pkg.price.toLocaleString()}
                </span>
                {pkg.discount > 0 && (
                  <span className="text-gray-400 line-through text-[12px] font-bold">
                    €{pkg.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-[#041d3c] group-hover:bg-[#1a84ff] text-white px-5 py-3 rounded-[12px] font-extrabold text-[12px] tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 shrink-0 shadow-md group-hover:shadow-[0_8px_20px_rgba(26,132,255,0.25)]">
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const renderResortCard = (pkg: any) => {
    const discountedPrice = pkg.discount > 0 
      ? Math.round(pkg.price * (1 - pkg.discount / 100)) 
      : null;

    return (
      <Link
        href={pkg.offerIdx !== undefined ? `/special-offers/${pkg.slug}?offerIdx=${pkg.offerIdx}` : `/special-offers/${pkg.slug}`}
        key={pkg.uniqueKey || pkg.id}
        className="font-poppins bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(4,29,60,0.03)] hover:shadow-[0_24px_60px_rgba(26,132,255,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out h-full group cursor-pointer block"
      >
        <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-[#f4f7fb]">
          <ImageWithFallback
            src={pkg.packageImage || 'https://via.placeholder.com/600'}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-70 pointer-events-none" />

          {/* Discount Badge */}
          {(pkg.discount > 0 || pkg.offerPoster || (pkg.customOffers && pkg.customOffers.length > 0)) && (
            <div className="absolute top-4 right-4 bg-[#e11d48] text-white rounded-[10px] px-3.5 py-1.5 font-extrabold text-[11px] shadow-[0_6px_16px_rgba(225,29,72,0.35)] tracking-wide z-10 border border-white/10">
              {pkg.discount > 0 ? `${pkg.discount}% OFF` : 'SPECIAL OFFER'}
            </div>
          )}

          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md border border-white/30 rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] z-10">
            <span className="text-[#041d3c] font-black text-[10px] uppercase tracking-wider">{pkg.location}</span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow text-left">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[#1a84ff] font-extrabold text-[10px] uppercase tracking-widest block line-clamp-1">
              {pkg.categories?.[0]?.name || 'Maldives Resort'}
            </span>
          </div>

          <h3 className="text-[#041d3c] font-extrabold text-[18px] leading-[1.3] mb-3">
            {pkg.title}
          </h3>

          {pkg.customOffers && pkg.customOffers.length > 0 ? (
            <div className="mb-5 mt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between bg-[#f8fafc] border border-[#e8edf4] rounded-[14px] p-3 shadow-sm shadow-[#041d3c]/5">
                <div className="flex flex-col items-center flex-1">
                  <span className="text-[#1a84ff] text-[9.5px] font-black uppercase tracking-widest mb-1">Duration</span>
                  <span className="text-[#041d3c] text-[14px] font-bold">{pkg.customOffers[0].nights} Nights</span>
                </div>
                <div className="w-[1px] h-8 bg-[#e8edf4]" />
                <div className="flex flex-col items-center flex-1">
                  <span className="text-[#1a84ff] text-[9.5px] font-black uppercase tracking-widest mb-1">Guests</span>
                  <span className="text-[#041d3c] text-[14px] font-bold">{pkg.customOffers[0].adults || 2} Adults</span>
                </div>
                <div className="w-[1px] h-8 bg-[#e8edf4]" />
                <div className="flex flex-col items-center flex-1">
                  <span className="text-[#1a84ff] text-[9.5px] font-black uppercase tracking-widest mb-1">Package</span>
                  <span className="text-rose-500 text-[15px] font-black">${pkg.customOffers[0].offerPrice}</span>
                </div>
              </div>
              {(pkg.customOffers[0].mealPlan || pkg.customOffers[0].transfer) && (
                <div className="flex flex-wrap gap-2">
                  {pkg.customOffers[0].mealPlan && (
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {pkg.customOffers[0].mealPlan === 'BB' ? 'Bed and Breakfast' : 
                       pkg.customOffers[0].mealPlan === 'HB' ? 'Half Board' : 
                       pkg.customOffers[0].mealPlan === 'FB' ? 'Full Board' : 
                       pkg.customOffers[0].mealPlan === 'AI' ? 'All Inclusive' : 
                       pkg.customOffers[0].mealPlan}
                    </span>
                  )}
                  {pkg.customOffers[0].transfer && (
                    <span className="bg-[#e0f2fe] text-[#0369a1] text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {pkg.customOffers[0].transfer}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-5 mt-1">
              <p className="text-gray-500 text-[13px] font-medium leading-relaxed line-clamp-2">
                {pkg.summary || "Experience luxury and breathtaking views."}
              </p>
            </div>
          )}

          <div className="h-[1px] bg-[#041d3c]/5 w-full mb-5" />

          <div className={`mt-auto flex items-center gap-4 ${pkg.customOffers && pkg.customOffers.length > 0 ? 'justify-center w-full' : 'justify-between'}`}>
            {!(pkg.customOffers && pkg.customOffers.length > 0) && (
              <div className="flex flex-col text-left">
                <p className="text-gray-400 text-[9.5px] font-extrabold uppercase tracking-widest mb-0.5">
                  Starting From
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-black font-black text-[22px] leading-none">
                    €{discountedPrice ? discountedPrice.toLocaleString() : pkg.price.toLocaleString()}
                  </span>
                  {pkg.discount > 0 && (
                    <span className="text-gray-400 line-through text-[12px] font-bold">
                      €{pkg.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className={`bg-[#041d3c] group-hover:bg-[#1a84ff] text-white px-5 py-3 rounded-[12px] font-extrabold text-[12px] tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0 shadow-md group-hover:shadow-[0_8px_20px_rgba(26,132,255,0.25)] ${pkg.customOffers && pkg.customOffers.length > 0 ? 'w-full' : ''}`}>
              <span>{pkg.customOffers && pkg.customOffers.length > 0 ? 'View Offer Details' : 'View'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">
      {/* ── HERO ── */}
      <section className="relative w-full aspect-video min-h-[400px] max-h-[70vh] flex items-end pb-12 md:pb-16 justify-start overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={heroAsset}
            alt="Special Offers"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/90 via-[#041d3c]/55 to-[#041d3c]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/80 via-transparent to-[#041d3c]/20" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-start text-left">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/45 hover:text-white text-[11.5px] font-semibold uppercase tracking-wider mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <span>EXCLUSIVE DEALS</span>
          </div>

          <h1 className="text-white font-black text-2xl sm:text-3xl lg:text-[42px] leading-tight drop-shadow-lg mb-4">
            Special Offers
          </h1>
          <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-5" />
          <p className="text-white/70 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed">
            Discover our carefully curated selection of discounted packages and exclusive promotions for your perfect getaway.
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="w-full py-16 lg:py-24 relative overflow-hidden">
        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10 flex flex-col items-center">
          
          {/* TABS */}
          <div className="flex p-1.5 bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm mb-12">
            <button
              onClick={() => setActiveTab('tours')}
              className={`px-8 py-3 rounded-[12px] text-[14px] font-bold transition-all duration-300 ${
                activeTab === 'tours' 
                  ? 'bg-[#1a84ff] text-white shadow-md' 
                  : 'text-gray-500 hover:text-[#041d3c] hover:bg-gray-50'
              }`}
            >
              Sri Lanka Tours
            </button>
            <button
              onClick={() => setActiveTab('resorts')}
              className={`px-8 py-3 rounded-[12px] text-[14px] font-bold transition-all duration-300 ${
                activeTab === 'resorts' 
                  ? 'bg-[#1a84ff] text-white shadow-md' 
                  : 'text-gray-500 hover:text-[#041d3c] hover:bg-gray-50'
              }`}
            >
              Maldives Resorts
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch w-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-sm border border-gray-100 h-full animate-pulse">
                  <div className="h-[240px] w-full bg-gray-200" />
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="h-3 w-1/3 bg-gray-200 rounded mb-4" />
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-4" />
                    <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded mb-6" />
                    
                    <div className="mt-auto flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1 w-1/2">
                        <div className="h-2 w-1/2 bg-gray-200 rounded" />
                        <div className="h-5 w-3/4 bg-gray-200 rounded" />
                      </div>
                      <div className="h-10 w-24 bg-gray-200 rounded-[12px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {activeTab === 'tours' ? (
                  tours.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center w-full max-w-2xl mx-auto">
                      <h3 className="text-[18px] font-bold text-[#041d3c] mb-2">No Active Tour Offers</h3>
                      <p className="text-gray-500 text-[14px]">Check back later for exclusive Sri Lanka tour deals!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch w-full">
                      {tours.map(renderTourCard)}
                    </div>
                  )
                ) : (
                  resorts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center w-full max-w-2xl mx-auto">
                      <h3 className="text-[18px] font-bold text-[#041d3c] mb-2">No Active Resort Offers</h3>
                      <p className="text-gray-500 text-[14px]">Check back later for exclusive Maldives resort deals!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch w-full">
                      {resorts.map(renderResortCard)}
                    </div>
                  )
                )}
              </motion.div>
            </AnimatePresence>
          )}

        </div>
      </section>
    </div>
  );
}
