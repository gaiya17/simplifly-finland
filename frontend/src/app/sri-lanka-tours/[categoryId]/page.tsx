import Link from 'next/link';
import { ImageWithFallback } from '../../../components/shared/ImageWithFallback';
import { ServicesSection } from '../../../components/sections/ServicesSection';
import { ReviewsSection } from '../../../components/sections/ReviewsSection';
import { MapPin, ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { tourApi } from '../../../lib/tourApi';

export default async function SriLankaTourCategory({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  
  let data;
  try {
    data = await tourApi.getCategory(categoryId);
  } catch (error) {
    data = null;
  }

  if (!data) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <h2 className="text-[24px] font-black text-[#041d3c] mb-2">Category Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't find the tour category you're looking for.</p>
        <Link href="/sri-lanka-tours" className="px-6 py-2.5 bg-[#1a84ff] text-white rounded-full font-bold">
          View All Tours
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">

      {/* ── HERO ── */}
      <section className="relative w-full aspect-video min-h-[400px] max-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={data.heroImage || 'https://images.unsplash.com/photo-1594805938839-c581da5d8129'}
            alt={data.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/90 via-[#041d3c]/55 to-[#041d3c]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/80 via-transparent to-[#041d3c]/20" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-start">
          <Link
            href="/sri-lanka-tours"
            className="flex items-center gap-1.5 text-white/45 hover:text-white text-[11.5px] font-semibold uppercase tracking-wider mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sri Lanka Tours
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            <span>{data.subtitle || 'Sri Lanka Explorer'}</span>
          </div>

          <h1 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  drop-shadow-lg mb-4 break-words hyphens-auto">
            {data.name}
          </h1>
          <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-5" />
          <p className="text-white/70 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed break-words whitespace-pre-wrap">
            {data.desc}
          </p>
        </div>
      </section>

      {/* ── DESCRIPTION ── */}
      {data.longDesc && (
        <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-14 lg:py-16">
          <p className="text-gray-500 text-[15px] lg:text-[16px] leading-[1.9] max-w-4xl mx-auto text-center break-words whitespace-pre-wrap">
            {data.longDesc}
          </p>
        </section>
      )}

      {/* ── SERVICES ── */}
      <ServicesSection />

      {/* ── PACKAGES GRID ── */}
      <section className="w-full py-[100px] lg:py-[120px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(4,29,60,0.03)_0%,_transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
          <div className="flex flex-col items-center text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
              <span>✦ SELECT YOUR JOURNEY</span>
            </div>
            <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
              Available Tour Packages
            </h2>
            <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5" />
            <p className="text-gray-500 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed">
              Each itinerary is handcrafted to give you the very best of Sri Lanka in comfort and style.
            </p>
          </div>

          {data.packages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[24px] shadow-sm border border-gray-100">
              <h3 className="text-[18px] font-bold text-gray-400">No active packages in this category yet.</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
              {data.packages.map((pkg: any) => {
                const discountedPrice = pkg.discount
                  ? Math.round(pkg.price * (1 - pkg.discount / 100))
                  : null;

                return (
                  <Link
                    href={`/sri-lanka-tours/${categoryId}/${pkg.slug}`}
                    key={pkg.id}
                    className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(4,29,60,0.03)] hover:shadow-[0_24px_60px_rgba(26,132,255,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out h-full group cursor-pointer block"
                  >
                    <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-[#f4f7fb]">
                      <ImageWithFallback
                        src={pkg.packageImage || 'https://via.placeholder.com/600'}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-65 pointer-events-none" />

                      {pkg.discount && (
                        <div className="absolute top-4 right-4 bg-[#e11d48] text-white rounded-[10px] px-3.5 py-2 font-extrabold text-[11px] shadow-[0_6px_16px_rgba(225,29,72,0.35)] tracking-wide z-10 border border-white/10">
                          {pkg.discount}% OFF
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md border border-white/30 rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] z-10">
                        <Clock className="w-3.5 h-3.5 text-[#1a84ff]" />
                        <span className="text-[#041d3c] font-black text-[10px] uppercase tracking-wider">{pkg.nights}N / {pkg.days}D</span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7 flex flex-col flex-grow text-left">
                      <div className="mb-2">
                        <span className="text-[#1a84ff] font-extrabold text-[10.5px] uppercase tracking-widest block">
                          {data.name}
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
                            Starting From
                          </p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-black font-black text-[25px] leading-none">
                              €{discountedPrice ? discountedPrice.toLocaleString() : pkg.price.toLocaleString()}
                            </span>
                            {pkg.discount && (
                              <span className="text-gray-400 line-through text-[12.5px] font-bold">
                                €{pkg.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="bg-[#041d3c] group-hover:bg-[#1a84ff] text-white px-5 py-3 rounded-[12px] font-extrabold text-[12px] tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 shrink-0 shadow-md group-hover:shadow-[0_8px_20px_rgba(26,132,255,0.25)]">
                          <span>View More</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <div className="bg-white">
        <ReviewsSection />
      </div>

    </div>
  );
}
