"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from '../../../components/shared/ImageWithFallback';
import { ServicesSection } from '../../../components/sections/ServicesSection';
import { ReviewsSection } from '../../../components/sections/ReviewsSection';
import { MapPin, ArrowLeft, Users, ArrowRight, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { resortApi } from '../../../lib/resortApi';
const tripAdvisorLogo = '/images/tripadvisor.png';

// Inlined Booking.com logo component
const BookingComLogo = ({ pkgId }: { pkgId: string }) => (
  <svg width="68" height="12" viewBox="0 0 114 20" xmlns="http://www.w3.org/2000/svg" className="w-auto h-full object-contain">
    <defs>
      <clipPath id={`A-${pkgId}`}>
        <path d="M578.932 12.395h111v14h-111z" />
      </clipPath>
      <clipPath id={`B-${pkgId}`}>
        <path d="M0 452h734V0H0z" />
      </clipPath>
      <clipPath id={`C-${pkgId}`}>
        <path d="M642.292 18.644h25.362v8.87h-25.362z" />
      </clipPath>
      <clipPath id={`D-${pkgId}`}>
        <path d="M642.292 18.644h25.362v8.87h-25.362z" />
      </clipPath>
      <clipPath id={`E-${pkgId}`}>
        <path d="M0 452h734V0H0z" />
      </clipPath>
      <clipPath id={`F-${pkgId}`}>
        <path d="M583.14 11.758h67.51v18.33h-67.51z" />
      </clipPath>
      <clipPath id={`G-${pkgId}`}>
        <path d="M0 452h734V0H0z" />
      </clipPath>
    </defs>
    <g transform="matrix(.05809 0 0 -.05809 -34.141832 2.632382)">
      <g clipPath={`url(#F-${pkgId})`}>
        <g clipPath={`url(#G-${pkgId})`}>
          <path d="M626.558 27.217a1.436 1.436 0 1 0 2.872 0 1.437 1.437 0 0 0-2.872 0" fill="#003580" />
          <path d="M649.215 17.64c0 .797.642 1.44 1.433 1.44a1.44 1.44 0 1 0-1.433-1.44" fill="#00b4f1" />
          <path d="M603 18.263c-1.236 0-2.096.982-2.096 2.386s.86 2.384 2.097 2.384c1.243 0 2.112-.98 2.112-2.384 0-1.426-.85-2.386-2.113-2.386zm0 6.867c-2.616 0-4.515-1.885-4.515-4.48s1.9-4.48 4.515-4.48c2.627 0 4.533 1.884 4.533 4.48s-1.906 4.482-4.532 4.482m20.785-4.706a2.136 2.136 0 0 1-.342.483l-.08.083.084.08a3.56 3.56 0 0 1 .36.45l2.3 3.432h-2.804l-1.735-2.685c-.098-.144-.296-.216-.593-.216h-.395v5.076c0 1.015-.633 1.153-1.316 1.153h-1.17l.003-11.98h2.484v3.594h.233c.283 0 .475-.033.564-.187l1.37-2.586c.383-.702.764-.82 1.482-.82h1.903l-1.418 2.344-.94 1.78m12.057 4.726c-1.264 0-2.07-.562-2.522-1.037l-.15-.152-.054.207c-.132.51-.58.788-1.253.788h-1.113l.007-8.653h2.467v3.988c0 .39.05.728.154 1.037.274.935 1.04 1.516 1.997 1.516.77 0 1.07-.407 1.07-1.457v-3.77c0-.896.415-1.315 1.312-1.315h1.174l-.004 5.504c0 2.186-1.067 3.342-3.086 3.342m-7.8-.196h-1.17l.008-8.653h1.247l.044-.002.582.002h.578v.003h.004l.005 7.335c0 .885-.423 1.314-1.298 1.314m-15.345-6.69c-1.236 0-2.097.982-2.097 2.386s.86 2.384 2.098 2.384 2.112-.98 2.112-2.384c0-1.426-.85-2.386-2.112-2.386zm0 6.867c-2.618 0-4.518-1.885-4.518-4.48s1.9-4.48 4.52-4.48 4.533 1.884 4.533 4.48-1.9 4.482-4.533 4.482" fill="#003580" />
        </g>
      </g>
      <g clipPath={`url(#C-${pkgId})`}>
        <g clipPath={`url(#D-${pkgId})`}>
          <g clipPath={`url(#E-${pkgId})`}>
            <path d="M665.555 18.263c-1.236 0-2.098.982-2.098 2.386s.862 2.384 2.098 2.384c1.242 0 2.113-.98 2.113-2.384 0-1.426-.85-2.386-2.113-2.386zm0 6.867c-2.618 0-4.517-1.885-4.517-4.48s1.9-4.48 4.517-4.48c2.624 0 4.533 1.884 4.533 4.48s-1.9 4.482-4.533 4.482" fill="#00b4f1" />
            <path d="M644.122 18.644c-1.35 0-1.83 1.176-1.83 2.28 0 .486.123 2.07 1.7 2.07.783 0 1.826-.224 1.826-2.15 0-1.817-.923-2.198-1.697-2.198zm2.978 6.332c-.468 0-.828-.187-1-.528l-.068-.132-.114.1c-.398.344-1.112.753-2.27.753-2.307 0-3.86-1.733-3.86-4.31s1.607-4.376 3.906-4.376c.785 0 1.406.184 1.898.556l.2.143v-.24c0-1.156-.747-1.794-2.102-1.794a4.98 4.98 0 0 0-1.66.306c-.522.158-.83.027-1.04-.498l-.196-.484-.277-.708.17-.09c.868-.46 1.997-.735 3.017-.735 2.1 0 4.554 1.075 4.554 4.1l.01 7.937H647.1" fill="#003580" />
          </g>
        </g>
      </g>
      <g clipPath={`url(#A-${pkgId})`}>
        <g clipPath={`url(#B-${pkgId})`}>
          <path d="M593.805 18.362l-2.008.002v2.4c0 .514.2.78.638.842h1.37c.977 0 1.6-.616 1.6-1.613-.001-1.024-.617-1.63-1.6-1.63zm-2.008 6.476v.632c0 .553.234.816.747.85h1.028c.88 0 1.4-.527 1.4-1.41 0-.672-.362-1.457-1.377-1.457h-1.807zm4.572-2.396l-.363.204.317.27c.37.317.986 1.03.986 2.26 0 1.884-1.46 3.1-3.72 3.1h-2.874a1.26 1.26 0 0 1-1.214-1.244v-10.69h4.14c2.513 0 4.135 1.368 4.135 3.487 0 1.14-.524 2.116-1.405 2.612" fill="#003580" />
          <path d="M681.107 25.12a3.4 3.4 0 0 1-2.648-1.283l-.178-.226-.14.253c-.458.833-1.244 1.256-2.337 1.256-1.147 0-1.916-.64-2.273-1.02l-.234-.253-.1.333c-.13.48-.557.743-1.203.743h-1.037l-.01-8.62h2.355v3.805a4.26 4.26 0 0 0 .125 1.008c.225.92.843 1.91 1.882 1.81.64-.062.954-.557.954-1.513v-5.11h2.372v3.805a3.45 3.45 0 0 0 .133 1.041c.2.878.836 1.778 1.838 1.778.726 0 .994-.41.994-1.514v-3.85c0-.87.388-1.26 1.26-1.26h1.108l.002 5.503c0 2.2-.968 3.314-2.872 3.314m-21.434-5.824c-.007-.01-1.02-1.077-2.355-1.077-1.216 0-2.444.746-2.444 2.41 0 1.438.952 2.443 2.316 2.443.442 0 .946-.158 1.025-.425l.01-.045a.866.866 0 0 1 .84-.637l1.3-.002v1.128c0 1.488-1.893 2.028-3.166 2.028-2.724 0-4.7-1.896-4.7-4.508s1.954-4.504 4.65-4.504c2.338 0 3.6 1.537 3.622 1.552l.068.084-1.022 1.695-.135-.143" fill="#00b4f1" />
        </g>
      </g>
    </g>
  </svg>
);

export default function AllMaldivesResorts() {
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
      result = result.filter(pkg => pkg.categoryId === selectedCategory);
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
      <section className="relative w-full h-[60vh] min-h-[480px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/images/allmald.webp"
            alt="All Maldives Resorts"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/90 via-[#041d3c]/55 to-[#041d3c]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/80 via-transparent to-[#041d3c]/20" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 pb-12 lg:pb-16 flex flex-col items-start">
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
                  const catSlug = pkg.category?.slug || 'all';

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
                        <h3 className="text-[#041d3c] font-black text-[18px] sm:text-[20px] leading-[1.25] line-clamp-2 mb-1.5 min-h-[44px]">
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

                        <div className="flex items-center gap-4 mb-2.5 pt-0">
                          <div className="flex flex-col gap-1.5 flex-1 text-left">
                            <div className="h-[24px] flex items-center">
                              <BookingComLogo pkgId={pkg.id} />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="bg-[#003b95] text-white font-extrabold text-[10.5px] px-1.5 py-0.5 rounded-[4px] leading-tight">
                                {Number(pkg.bookingRating || 0).toFixed(1)}
                              </div>
                              <span className="text-gray-400 text-[10px] font-extrabold leading-none mt-0.5">
                                ({pkg.bookingReviews || 0})
                              </span>
                            </div>
                          </div>

                          <div className="w-[1px] h-8 bg-[#041d3c]/8 rounded-full"></div>

                          <div className="flex flex-col gap-1.5 flex-1 pl-2 text-left">
                            <ImageWithFallback
                              src={(tripAdvisorLogo as any)?.src || (tripAdvisorLogo as any) || ''}
                              alt="TripAdvisor"
                              className="h-[24px] w-auto object-contain object-left"
                            />
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-[3px]">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-[11px] h-[11px] rounded-full border-[1.5px] ${i < Math.round(pkg.tripAdvisorRating || 0)
                                        ? 'bg-[#00aa6c] border-[#00aa6c]'
                                        : 'bg-transparent border-[#00aa6c]'
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-gray-400 text-[10px] font-extrabold leading-none mt-0.5">
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

                          <div className="bg-black group-hover:bg-[#1a84ff] text-white w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300">
                            <ArrowRight className="w-4 h-4" />
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
