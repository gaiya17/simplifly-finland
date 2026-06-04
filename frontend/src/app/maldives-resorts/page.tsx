"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { resortApi } from '../../lib/resortApi';
import { ImageWithFallback } from '../../components/shared/ImageWithFallback';
import { ServicesSection } from '../../components/sections/ServicesSection';
import { ReviewsSection } from '../../components/sections/ReviewsSection';
import { Waves, Heart, Users, Compass, ArrowRight, MapPin, Star, Leaf, Sparkles, Globe, Binoculars, Anchor, Sun, UtensilsCrossed, Ship } from 'lucide-react';

const iconMap: Record<string, any> = { Waves, MapPin, Heart, Compass, Users, Leaf, Sparkles, Globe, Binoculars, Star, Anchor, Sun, UtensilsCrossed, Ship };



const highlights = [
  { value: '50+', label: 'Luxury Resorts' },
  { value: '26', label: 'Atolls Covered' },
  { value: '100%', label: 'Tailored Packages' },
  { value: '5★', label: 'Average Rating' },
];

export default function MaldivesResorts() {
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    resortApi.getCategories()
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
    const resolvedIcon = dbCat.icon ? iconMap[dbCat.icon] : Waves;
    return {
      title: dbCat.name,
      slug: dbCat.slug,
      desc: dbCat.desc || 'Discover an unforgettable luxury experience curated just for you.',
      image: dbCat.heroImage || 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1080',
      icon: resolvedIcon,
      accent: '#1a84ff',
    };
  });

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">

      {/* ── HERO ── */}
      <section className="relative w-full h-[65vh] min-h-[520px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&q=80&w=1920"
            alt="Maldives Luxury Resort"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/90 via-[#041d3c]/55 to-[#041d3c]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/70 via-transparent to-[#041d3c]/20" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 pt-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            <span>ESCAPE TO TROPICAL PERFECTION</span>
          </div>
          <h1 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  drop-shadow-lg mb-4">
            Maldives Resorts
          </h1>
          <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-5" />
          <p className="text-white/70 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed mb-8">
            Discover a world of crystal-clear lagoons, pristine white sands, and unrivaled luxury — curated for the discerning Nordic traveler.
          </p>

          {/* Quick stat strip */}
          <div className="flex flex-wrap gap-3">
            {highlights.map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-[12px] px-4 py-2.5 flex flex-col">
                <span className="text-white font-black text-[18px] leading-none">{value}</span>
                <span className="text-white/55 text-[10px] font-extrabold uppercase tracking-wider mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO SPLIT SECTION ── */}
      <section className="w-full py-[100px] lg:py-[120px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none" />
        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left — text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
                <span>✦ ISLAND SANCTUARIES</span>
              </div>
              <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
                Experience<br />Unmatched Luxury
              </h2>
              <div className="w-16 h-1.5 bg-[#1a84ff] rounded-full mb-7" />
              <p className="text-gray-600 text-[15px] lg:text-[16px] leading-[1.85] font-normal mb-5">
                Immerse yourself in the tranquility of the Maldives, an archipelago renowned for its breathtaking beauty and exclusive resorts.
              </p>
              <p className="text-gray-600 text-[15px] lg:text-[16px] leading-[1.85] font-normal">
                Whether you desire a romantic getaway in an overwater villa or a fun-filled family vacation on a private island, our curated selection of properties guarantees a spectacular and lavish escape.
              </p>
            </div>

            {/* Right — stacked image pair */}
            <div className="relative h-[440px] hidden lg:block">
              <div className="absolute top-0 left-0 w-[70%] h-[75%] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(4,29,60,0.15)]">
                <img
                  src="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&q=80&w=800"
                  alt="Maldives Dining"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-[60%] h-[65%] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(4,29,60,0.15)] border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800"
                  alt="Maldives Sunset"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md border border-white/60 rounded-[16px] shadow-[0_16px_40px_rgba(4,29,60,0.15)] px-5 py-3.5 z-10 flex flex-col items-center justify-center min-w-[110px] group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4 text-[#1a84ff] drop-shadow-sm group-hover:-translate-y-0.5 transition-transform duration-300" />
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#041d3c] to-[#1a84ff] font-black text-[26px] leading-none ">26</p>
                </div>
                <p className="text-gray-500 text-[9.5px] font-extrabold uppercase tracking-[0.2em] ml-1">Atolls</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <ServicesSection />

      {/* ── RESORT CATEGORIES GRID ── */}
      <section className="w-full py-[100px] lg:py-[120px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">

          {/* Section header */}
          <div className="flex flex-col items-center text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
              <span>✦ CURATED EXPERIENCES</span>
            </div>
            <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
              Resort Experiences
            </h2>
            <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5" />
            <p className="text-gray-500 text-[15px] lg:text-[16px] font-medium max-w-2xl leading-relaxed">
              From overwater villas to private islands — explore every kind of luxury the Maldives has to offer.
            </p>
          </div>

          {/* 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 py-10 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#1a84ff]/30 border-t-[#1a84ff] rounded-full animate-spin" />
              </div>
            ) : displayCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href={`/maldives-resorts/${cat.slug}`}
                  className="group relative rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(4,29,60,0.07)] hover:shadow-[0_16px_48px_rgba(4,29,60,0.14)] transition-all duration-500 cursor-pointer block"
                >
                  {/* Image */}
                  <div className="relative h-[280px] overflow-hidden">
                    <ImageWithFallback
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Gradient overlay — always on */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/90 via-[#041d3c]/35 to-transparent" />

                    {/* Icon badge top-left */}
                    <div
                      className="absolute top-4 left-4 w-9 h-9 rounded-[10px] flex items-center justify-center backdrop-blur-sm border border-white/20"
                      style={{ backgroundColor: `${cat.accent}25` }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>

                    {/* Content overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-black text-[16px] leading-snug mb-1.5">{cat.title}</h3>
                      <p className="text-white/60 text-[12.5px] font-normal leading-[1.65] line-clamp-2 mb-4">{cat.desc}</p>

                      {/* CTA row */}
                      <div className="flex items-center gap-1.5 text-white group-hover:text-[#1a84ff] text-[11.5px] font-extrabold uppercase tracking-wider transition-colors duration-300">
                        Explore Resorts
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                      {/* Underline */}
                      <div className="w-0 group-hover:w-10 h-[2px] rounded-full mt-2 transition-all duration-500 ease-out bg-[#1a84ff]" />
                    </div>
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
