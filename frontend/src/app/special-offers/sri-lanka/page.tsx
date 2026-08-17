"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageWithFallback } from "../../../components/shared/ImageWithFallback";
import {
  Clock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { tourApi } from "../../../lib/tourApi";
import { useSiteAssets } from "../../../components/providers/SiteAssetsProvider";
import { motion } from "framer-motion";

export default function SriLankaOffers() {
  const { getAssetUrl } = useSiteAssets();
  const heroAsset = getAssetUrl("sri_lanka_tours_hero", "/images/sltours.webp");

  const [tours, setTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const toursData = await tourApi.getOffers().catch(() => []);
        const sortedTours = (Array.isArray(toursData) ? toursData : [])
          .slice()
          .sort((a: any, b: any) => (a.title || '').localeCompare(b.title || ''));
        setTours(sortedTours);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderTourCard = (pkg: any) => {
    const discountedPrice =
      pkg.discount > 0
        ? Math.round(pkg.price * (1 - pkg.discount / 100))
        : null;

    return (
      <Link
        href={`/special-offers/${pkg.slug}`}
        key={pkg.id}
        className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(4,29,60,0.03)] hover:shadow-[0_24px_60px_rgba(26,132,255,0.12)] hover:-translate-y-1.5 active:scale-[0.98] active:opacity-90 transition-all duration-500 ease-out h-full group cursor-pointer block"
      >
        <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-[#f4f7fb]">
          <ImageWithFallback
            src={pkg.packageImage || "https://via.placeholder.com/600"}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-70 pointer-events-none" />

          {(pkg.discount > 0 || pkg.offerPoster) && (
            <div className="absolute top-4 right-4 bg-[#e11d48] text-white rounded-[10px] px-3.5 py-1.5 font-extrabold text-[11px] shadow-[0_6px_16px_rgba(225,29,72,0.35)] tracking-wide z-10 border border-white/10">
              {pkg.discount > 0 ? `${pkg.discount}% OFF` : "SPECIAL OFFER"}
            </div>
          )}

          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md border border-white/30 rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] z-10">
            <Clock className="w-3.5 h-3.5 text-[#1a84ff]" />
            <span className="text-[#041d3c] font-black text-[10px] uppercase tracking-wider">
              {pkg.nights}N / {pkg.days}D
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow text-left">
          <div className="mb-2">
            <span className="text-[#1a84ff] font-extrabold text-[10px] uppercase tracking-widest block line-clamp-1">
              {pkg.category?.name || "Tour Package"}
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
                  €
                  {discountedPrice
                    ? discountedPrice.toLocaleString()
                    : pkg.price.toLocaleString()}
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

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">
      {/* ── HERO ── */}
      <section className="relative w-full aspect-video min-h-[400px] max-h-[70vh] flex items-end pb-12 md:pb-16 justify-start overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={heroAsset}
            alt="Sri Lanka Special Offers"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/90 via-[#041d3c]/55 to-[#041d3c]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/80 via-transparent to-[#041d3c]/20" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-start text-left">
          <Link
            href="/special-offers"
            className="flex items-center gap-1.5 text-white/45 hover:text-white text-[11.5px] font-semibold uppercase tracking-wider mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Offers
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <span>🇱🇰 SRI LANKA DEALS</span>
          </div>

          <h1 className="text-white font-black text-2xl sm:text-3xl lg:text-[42px] leading-tight drop-shadow-lg mb-4">
            Sri Lanka Special Offers
          </h1>
          <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-5" />
          <p className="text-white/70 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed">
            Exclusive limited-time deals on our most popular Sri Lanka tour
            packages. Book now and save on your dream tropical holiday.
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="w-full py-16 lg:py-24 relative overflow-hidden">
        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10 flex flex-col items-center">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch w-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-sm border border-gray-100 h-full animate-pulse"
                >
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
          ) : tours.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center w-full max-w-2xl mx-auto">
              <h3 className="text-[18px] font-bold text-[#041d3c] mb-2">
                No Active Sri Lanka Offers
              </h3>
              <p className="text-gray-500 text-[14px] mb-6">
                Check back later for exclusive Sri Lanka tour deals!
              </p>
              <Link
                href="/special-offers"
                className="px-6 py-2.5 bg-[#1a84ff] text-white rounded-[12px] font-bold text-[13px] hover:bg-[#041d3c] transition-colors"
              >
                View All Offers
              </Link>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch w-full"
            >
              {tours.map(renderTourCard)}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
