'use client';

import { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ImageWithFallback } from '../../components/shared/ImageWithFallback';
import { X, ZoomIn, MapPin, Loader2 } from 'lucide-react';
import { galleryApi } from '../../lib/galleryApi';
import { useSiteAssets } from '../../components/providers/SiteAssetsProvider';

type Category = 'All' | 'Maldives' | 'Sri Lanka' | 'Experiences';

const categories: Category[] = ['All', 'Experiences', 'Maldives', 'Sri Lanka'];

export default function GalleryPage() {
  const { getAssetUrl } = useSiteAssets();
  const galleryHero = getAssetUrl('gallery_hero', '/images/galleryhero.webp');
  
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [lightbox, setLightbox] = useState<{ url: string; title: string; category: string } | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      try {
        const assets = await galleryApi.getAssets();
        setGalleryImages(assets);
      } catch (error) {
        console.error("Failed to load gallery images", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filtered =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">

      {/* ── HERO ── */}
      <section className="relative w-full aspect-video min-h-[400px] max-h-[70vh] flex items-end pb-12 md:pb-16 justify-start overflow-hidden bg-[#041d3c]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={galleryHero}
            alt="Gallery - Simplifly Finland Oy"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c] via-[#041d3c]/80 to-[#041d3c]/40" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <span>✦ VISUAL JOURNEY</span>
          </div>
          <h1 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  drop-shadow-lg mb-4">
            Our Gallery
          </h1>
          <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-5" />
          <p className="text-white/70 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed">
            Visual glimpses into the extraordinary destinations and experiences we craft for our travelers.
          </p>
        </div>
      </section>

      {/* ── FILTER + GALLERY ── */}
      <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-[80px] lg:py-[100px]">

        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
            <span>✦ CAPTURED MEMORIES</span>
          </div>
          <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
            Explore Our World
          </h2>
          <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5" />
          <p className="text-gray-500 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed">
            From Maldivian overwater villas to Sri Lanka's ancient temples — every photo tells a story.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-[12px] text-[13px] font-extrabold uppercase tracking-wider transition-all duration-300 ${activeCategory === cat
                  ? 'bg-[#041d3c] text-white shadow-[0_8px_24px_rgba(4,29,60,0.18)] -translate-y-0.5'
                  : 'bg-white text-gray-500 border border-[#041d3c]/8 hover:border-[#041d3c]/20 hover:text-[#041d3c] hover:-translate-y-0.5 shadow-[0_2px_10px_rgba(4,29,60,0.04)]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image count */}
        <p className="text-gray-400 text-[12px] font-extrabold uppercase tracking-widest text-center mb-8">
          {filtered.length} {filtered.length === 1 ? 'Photo' : 'Photos'}
        </p>

        {/* Masonry Gallery */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#1a84ff] animate-spin" />
          </div>
        ) : (
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3 }}>
            <Masonry gutter="16px">
              {filtered.map((img, i) => (
                <div
                  key={`${img.id || img.url}-${i}`}
                  className="relative overflow-hidden rounded-[20px] shadow-[0_4px_20px_rgba(4,29,60,0.07)] hover:shadow-[0_16px_48px_rgba(4,29,60,0.15)] transition-all duration-500 group cursor-pointer"
                  onClick={() => setLightbox(img)}
                >
                  <ImageWithFallback
                    src={img.url}
                    alt={img.title}
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/85 via-[#041d3c]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-between p-5">
                    {/* Top-right zoom icon */}
                    <div className="flex justify-end">
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/25 flex items-center justify-center translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                      <h3 className="text-white font-black text-[15px] leading-tight mb-1.5">{img.title}</h3>
                      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-[6px] px-2.5 py-1 w-fit">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        <span className="text-white/85 text-[11px] font-extrabold uppercase tracking-wide">{img.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Category pill (always visible) */}
                  <div className="absolute top-3.5 left-3.5 bg-[#041d3c]/70 backdrop-blur-sm border border-white/15 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-[6px]">
                    {img.category}
                  </div>
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </section>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="rounded-[20px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <img
                src={lightbox.url}
                alt={lightbox.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>

            {/* Caption bar */}
            <div className="mt-4 flex items-center justify-between gap-4 px-1">
              <div>
                <h3 className="text-white font-black text-[17px] leading-tight">{lightbox.title}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-white/55 text-[12px] font-semibold">{lightbox.category}</span>
                </div>
              </div>
              <button
                className="text-white/40 text-[12px] font-semibold hover:text-white/70 transition-colors"
                onClick={() => setLightbox(null)}
              >
                Close ×
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
