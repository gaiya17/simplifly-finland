"use client";
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../../components/shared/ImageWithFallback';
import { ServicesSection } from '../../components/sections/ServicesSection';
import { ReviewsSection } from '../../components/sections/ReviewsSection';
import Link from 'next/link';
import {
  MapPin, Compass, Users, Leaf, Heart, Zap, Binoculars,
  Sparkles, Globe, ArrowRight, Star, Loader2, Waves, Anchor, Sun
} from 'lucide-react';
import { tourApi } from '../../lib/tourApi';
import { useSiteAssets } from '../../components/providers/SiteAssetsProvider';

const iconMap: Record<string, any> = { Waves, MapPin, Heart, Compass, Users, Leaf, Sparkles, Globe, Binoculars, Star, Anchor, Sun, Zap };

const STATS = [
  { value: '50+', label: 'Tour Packages' },
  { value: '8', label: 'Categories' },
  { value: '100%', label: 'Tailored' },
  { value: '5★', label: 'Rating' },
];

export default function SriLankaTours() {
  const { getAssetUrl } = useSiteAssets();
  const sriLankaHero = getAssetUrl('sri_lanka_tours_hero', '/images/srilankatours.webp');

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tourApi.getCategories()
      .then(data => {
        setDbCategories(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const displayCategories = dbCategories.map(dbCat => {
    const resolvedIcon = dbCat.icon ? iconMap[dbCat.icon] : Compass;
    return {
      title: dbCat.name,
      slug: dbCat.slug,
      desc: dbCat.desc || 'Experience the wonders of Sri Lanka.',
      image: dbCat.heroImage || '/images/srilankatours.webp',
      icon: resolvedIcon,
      accent: '#1a84ff',
    };
  });

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">

      {/* ── HERO ── */}
      <section className="relative w-full h-[65vh] min-h-[520px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={sriLankaHero}
            alt="Sri Lanka Luxury Tour"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/95 via-[#041d3c]/60 to-[#041d3c]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/80 via-transparent to-[#041d3c]/20" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 pb-12 lg:pb-16 flex flex-col items-start">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            <span>Pearl of the Indian Ocean</span>
          </div>

          <h1 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  drop-shadow-lg mb-4 max-w-3xl">
            Sri Lanka Tours
          </h1>
          <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-5" />
          <p className="text-white/70 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed">
            Uncover ancient mysteries, breathtaking landscapes, and unparalleled hospitality on the island that has it all.
          </p>

          {/* Quick stat strip */}
          <div className="flex flex-wrap gap-3 mt-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/12 rounded-[10px] px-3.5 py-2">
                <span className="text-white font-black text-[15px]">{value}</span>
                <span className="text-white/55 font-semibold text-[11px] uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO SPLIT SECTION ── */}
      <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-[100px] lg:py-[120px]">
        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Left text */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 border border-[#1a84ff]/10">
              <span>✦ WHY SRI LANKA</span>
            </div>
            <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
              Explore the Wonders of Sri Lanka
            </h2>
            <div className="w-16 h-1.5 bg-[#1a84ff] rounded-full mb-7" />
            <p className="text-gray-500 text-[15px] lg:text-[16px] leading-[1.85] mb-5">
              From the sun-kissed beaches of the southern coast to the misty, tea-carpeted hills of the central highlands, Sri Lanka offers a tapestry of vibrant cultures, wild nature, and ancient wonder.
            </p>
            <p className="text-gray-500 text-[15px] lg:text-[16px] leading-[1.85] mb-8">
              Our bespoke tours are meticulously crafted to deliver the utmost in luxury, authenticity, and comfort — ensuring every moment of your journey is extraordinary.
            </p>

            {/* Feature chips */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Star, text: '5-Star Rated Experiences' },
                { icon: Users, text: 'Private & Group Tours' },
                { icon: Leaf, text: 'Eco-Conscious Travel' },
                { icon: Compass, text: 'Expert Local Guides' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 bg-white rounded-[14px] px-4 py-3.5 shadow-[0_4px_16px_rgba(4,29,60,0.05)] border border-[#041d3c]/5">
                  <div className="w-8 h-8 rounded-[10px] bg-[#1a84ff]/8 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#1a84ff]" />
                  </div>
                  <span className="text-[#041d3c] font-bold text-[12.5px]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right stacked images */}
          <div className="flex-1 relative hidden lg:flex items-center justify-center min-h-[400px] lg:min-h-[480px]">
            {/* Back image */}
            <div className="absolute right-0 top-0 w-[75%] h-[300px] lg:h-[340px] rounded-[24px] overflow-hidden shadow-[0_24px_60px_rgba(4,29,60,0.14)]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1711797750174-c3750dd9d7c9?auto=format&fit=crop&q=80&w=900"
                alt="Sigiriya Rock"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Front image */}
            <div className="absolute left-0 bottom-0 w-[72%] h-[260px] lg:h-[300px] rounded-[24px] overflow-hidden shadow-[0_24px_60px_rgba(4,29,60,0.18)] border-4 border-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1533484482814-3fe2d922be89?auto=format&fit=crop&q=80&w=900"
                alt="Sri Lanka Wildlife"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md border border-white/60 rounded-[16px] shadow-[0_16px_40px_rgba(4,29,60,0.15)] px-5 py-3.5 z-10 flex flex-col items-center justify-center min-w-[110px] group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-[#1a84ff] drop-shadow-sm group-hover:-translate-y-0.5 transition-transform duration-300" />
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#041d3c] to-[#1a84ff] font-black text-[26px] leading-none ">8</p>
              </div>
              <p className="text-gray-500 text-[9.5px] font-extrabold uppercase tracking-[0.2em] ml-1">Tour Types</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <ServicesSection />

      {/* ── TOUR CATEGORIES GRID ── */}
      <section className="w-full py-[100px] lg:py-[120px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(212,175,55,0.04)_0%,_transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">

          {/* Section header */}
          <div className="flex flex-col items-center text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
              <span>✦ CURATED EXPERIENCES</span>
            </div>
            <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
              Our Tour Categories
            </h2>
            <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5" />
            <p className="text-gray-500 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed">
              Eight distinct ways to experience Sri Lanka — each one unforgettable in its own right.
            </p>
          </div>

          {/* 4-column overlay photo card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 py-10 flex justify-center">
                <Loader2 className="w-8 h-8 text-[#1a84ff] animate-spin" />
              </div>
            ) : displayCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href={`/sri-lanka-tours/${cat.slug}`}
                  prefetch={true}
                  className="group relative rounded-[24px] overflow-hidden shadow-[0_8px_28px_rgba(4,29,60,0.10)] hover:shadow-[0_20px_50px_rgba(4,29,60,0.18)] transition-all duration-500 hover:-translate-y-1.5 cursor-pointer h-[320px] block"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Background photo */}
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/95 via-[#041d3c]/40 to-[#041d3c]/5 group-hover:from-[#041d3c]/98 transition-all duration-500" />

                  {/* Icon badge top-left */}
                  <div
                    className="absolute top-4 left-4 w-10 h-10 rounded-[12px] flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300"
                    style={{ backgroundColor: `${cat.accent}25` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.accent }} />
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col">
                    <h3 className="text-white font-black text-[18px] leading-tight mb-2">{cat.title}</h3>
                    <p className="text-white/65 text-[13px] font-medium leading-relaxed line-clamp-2 mb-4 group-hover:text-white/80 transition-colors duration-300">
                      {cat.desc}
                    </p>

                    {/* CTA row */}
                    <div className="flex items-center justify-between">
                      <span className="text-white group-hover:text-[#1a84ff] text-[11.5px] font-extrabold uppercase tracking-wider transition-colors duration-300">
                        Explore Tours
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 group-hover:bg-[#1a84ff] group-hover:border-[#1a84ff] flex items-center justify-center transition-all duration-300">
                        <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </div>

                    {/* Animated underline */}
                    <div className="h-[2.5px] mt-4 rounded-full w-0 group-hover:w-full transition-all duration-500 ease-out bg-[#1a84ff]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <div className="bg-white">
        <ReviewsSection />
      </div>

    </div>
  );
}
