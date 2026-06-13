"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin, Clock, Users, ArrowRight, Loader2, Leaf, Star, Anchor,
  Calendar, Globe, ArrowLeft, Heart, Binoculars, Zap, Sparkles, Waves, Compass,
  Search, SlidersHorizontal
} from 'lucide-react';
import { resortApi } from '../../../lib/resortApi';
import { ImageWithFallback } from '../../../components/shared/ImageWithFallback';
import { useSiteAssets } from '../../../components/providers/SiteAssetsProvider';
import { ServicesSection } from '../../../components/sections/ServicesSection';
import { ReviewsSection } from '../../../components/sections/ReviewsSection';


export default function AllMaldivesResorts() {
  const { getAssetUrl } = useSiteAssets();
  const allResortsHero = getAssetUrl('maldives_resorts_all_hero', '/images/allmald.webp');
  
  const [resorts, setResorts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(15000); // max price
  const [maxAvailablePrice, setMaxAvailablePrice] = useState<number>(15000);
  const [sortOrder, setSortOrder] = useState<string>('price-asc');

  // Resort specific filters
  const [starRating, setStarRating] = useState<string>('all');
  const [minReviewScore, setMinReviewScore] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resortsData, categoriesData] = await Promise.all([
          resortApi.getPublicResorts(),
          resortApi.getCategories()
        ]);

        setResorts(resortsData);
        setCategories(categoriesData);

        if (resortsData.length > 0) {
          const maxPrice = Math.max(...resortsData.map((r: any) => r.price));
          setMaxAvailablePrice(Math.ceil(maxPrice / 100) * 100);
          setPriceRange(Math.ceil(maxPrice / 100) * 100);
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAndSortedResorts = useMemo(() => {
    let result = [...resorts];

    // 1. Search Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        pkg =>
          pkg.title.toLowerCase().includes(q) ||
          (pkg.location && pkg.location.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(pkg => pkg.categories?.some((c: any) => c.id === selectedCategory));
    }

    // 3. Price Filter
    result = result.filter(pkg => {
      const actualPrice = pkg.discount > 0
        ? Math.round(pkg.price * (1 - pkg.discount / 100))
        : pkg.price;
      return actualPrice <= priceRange;
    });

    // 4. Star Rating Filter
    if (starRating !== 'all') {
      result = result.filter(pkg => pkg.resortRating === Number(starRating));
    }

    // 5. Min Review Score Filter (checking both platforms)
    if (minReviewScore > 0) {
      result = result.filter(pkg => {
        const bookingScore = Number(pkg.bookingRating || 0);
        // TripAdvisor is out of 5, booking is out of 10
        // Convert tripadvisor to out of 10 for comparison
        const taScore = Number(pkg.tripAdvisorRating || 0) * 2;
        return bookingScore >= minReviewScore || taScore >= minReviewScore;
      });
    }

    // 6. Sort
    result.sort((a, b) => {
      const priceA = a.discount > 0 ? Math.round(a.price * (1 - a.discount / 100)) : a.price;
      const priceB = b.discount > 0 ? Math.round(b.price * (1 - b.discount / 100)) : b.price;

      switch (sortOrder) {
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'a-z': return a.title.localeCompare(b.title);
        case 'z-a': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

    return result;
  }, [resorts, searchQuery, selectedCategory, priceRange, sortOrder, starRating, minReviewScore]);

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">
      {/* ── HERO ── */}
      <section className="relative w-full aspect-video min-h-[400px] max-h-[70vh] flex items-end pb-12 md:pb-16 justify-start overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={allResortsHero}
            alt="All Maldives Resorts"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/90 via-[#041d3c]/55 to-[#041d3c]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/80 via-transparent to-[#041d3c]/20" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-start text-left">
          <Link
            href="/maldives-resorts"
            className="flex items-center gap-1.5 text-white/45 hover:text-white text-[11.5px] font-semibold uppercase tracking-wider mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Categories
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-[#1a84ff]" />
            <span>The Full Collection</span>
          </div>

          <h1 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  drop-shadow-lg mb-4">
            All Maldives Resorts
          </h1>
          <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5" />
          <p className="text-white/70 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed">
            Discover our complete portfolio of luxury island resorts and find your perfect Maldivian escape.
          </p>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <ServicesSection />

      {/* ── FILTER BAR & RESORTS GRID ── */}
      <section className="w-full py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(4,29,60,0.03)_0%,_transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10 flex flex-col lg:flex-row gap-10">

          {/* SIDEBAR FILTERS */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(4,29,60,0.04)] border border-[#e2e8f0] sticky top-[100px]">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-[#1a84ff]" />
                <h3 className="text-[#041d3c] font-black text-[18px]">Filter Resorts</h3>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or atoll..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#f4f7fb] border border-transparent focus:border-[#1a84ff]/30 focus:bg-white rounded-[12px] pl-10 pr-4 py-3 text-[14px] text-[#041d3c] font-medium outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#f4f7fb] border border-transparent focus:border-[#1a84ff]/30 focus:bg-white rounded-[12px] px-4 py-3 text-[14px] text-[#041d3c] font-medium outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider block">Max Price</label>
                  <span className="text-[#1a84ff] font-bold text-[14px]">€{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxAvailablePrice}
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#1a84ff] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-[11px] font-semibold text-gray-400">
                  <span>€0</span>
                  <span>€{maxAvailablePrice}</span>
                </div>
              </div>

              {/* Resort Rating */}
              <div className="mb-6">
                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Resort Rating</label>
                <select
                  value={starRating}
                  onChange={(e) => setStarRating(e.target.value)}
                  className="w-full bg-[#f4f7fb] border border-transparent focus:border-[#1a84ff]/30 focus:bg-white rounded-[12px] px-4 py-3 text-[14px] text-[#041d3c] font-medium outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Any Rating</option>
                  <option value="5">5 Star Resorts</option>
                  <option value="4">4 Star Resorts</option>
                  <option value="3">3 Star Resorts</option>
                </select>
              </div>

              {/* Review Score */}
              <div className="mb-6">
                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Min Review Score (Out of 10)</label>
                <select
                  value={minReviewScore}
                  onChange={(e) => setMinReviewScore(Number(e.target.value))}
                  className="w-full bg-[#f4f7fb] border border-transparent focus:border-[#1a84ff]/30 focus:bg-white rounded-[12px] px-4 py-3 text-[14px] text-[#041d3c] font-medium outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="0">Any Score</option>
                  <option value="9">9.0+ Superb</option>
                  <option value="8">8.0+ Very Good</option>
                  <option value="7">7.0+ Good</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-2">
                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Sort By</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full bg-[#f4f7fb] border border-transparent focus:border-[#1a84ff]/30 focus:bg-white rounded-[12px] px-4 py-3 text-[14px] text-[#041d3c] font-medium outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="a-z">Name (A - Z)</option>
                  <option value="z-a">Name (Z - A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[#041d3c] font-black text-2xl lg:text-3xl">
                {filteredAndSortedResorts.length} {filteredAndSortedResorts.length === 1 ? 'Resort' : 'Resorts'} Found
              </h2>
            </div>

            {isLoading ? (
              <div className="py-20 flex justify-center w-full">
                <Loader2 className="w-8 h-8 text-[#1a84ff] animate-spin" />
              </div>
            ) : filteredAndSortedResorts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-[#f4f7fb] rounded-full flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-gray-400" />
                </div>
                <h3 className="text-[18px] font-bold text-[#041d3c] mb-2">No resorts match your filters</h3>
                <p className="text-gray-500 text-[14px]">Try adjusting your search criteria, price, or ratings to see more results.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange(maxAvailablePrice);
                    setSortOrder('price-asc');
                    setStarRating('all');
                    setMinReviewScore(0);
                  }}
                  className="mt-6 px-6 py-2.5 bg-[#1a84ff] hover:bg-[#0066cc] text-white rounded-full font-bold text-[13px] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                {filteredAndSortedResorts.map((pkg: any) => {
                  const discountedPrice = pkg.discount > 0
                    ? Math.round(pkg.price * (1 - pkg.discount / 100))
                    : null;
                  const catSlug = pkg.categories?.[0]?.slug || 'all';

                  return (
                    <Link
                      href={`/maldives-resorts/${catSlug}/${pkg.slug}`}
                      key={pkg.id}
                      className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(4,29,60,0.03)] hover:shadow-[0_24px_60px_rgba(26,132,255,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out h-full group cursor-pointer block"
                    >
                      <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-[#f4f7fb]">
                        <ImageWithFallback
                          src={pkg.packageImage || 'https://via.placeholder.com/600'}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-70 pointer-events-none" />

                        {pkg.discount > 0 && (
                          <div className="absolute top-4 right-4 bg-[#e11d48] text-white rounded-[10px] px-3.5 py-1.5 font-extrabold text-[11px] shadow-[0_6px_16px_rgba(225,29,72,0.35)] tracking-wide z-10 border border-white/10">
                            -{pkg.discount}%
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-white/40 rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10">
                          <Users className="w-3.5 h-3.5 text-[#1a84ff]" strokeWidth={2.5} />
                          <span className="text-[#041d3c] font-black text-[10px] uppercase tracking-wider">
                            1 Night, 2 Adults
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-grow text-left">
                        <h3 className="text-[#041d3c] font-extrabold text-[18px] sm:text-[20px] leading-[1.25] line-clamp-2 mb-1.5 min-h-[44px]">
                          {pkg.title}
                        </h3>

                        <div className="mb-2 mt-0 min-h-[36px]">
                          <span className="text-black font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">
                            Location
                          </span>
                          <p className="text-black text-[12px] font-medium leading-relaxed line-clamp-2">
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

                        <div className="h-[1px] bg-[#041d3c]/5 w-full mb-2.5" />

                        <div className="mt-auto flex items-center justify-between gap-3">
                          <div className="flex flex-col text-left">
                            <p className="text-gray-400 text-[9.5px] font-extrabold uppercase tracking-widest mb-0">
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
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <div className="bg-white">
        <ReviewsSection />
      </div>
    </div>
  );
}
