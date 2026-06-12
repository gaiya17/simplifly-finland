"use client";
import { ImageWithFallback } from '../shared/ImageWithFallback';
const tripAdvisorLogo = '/images/tripadvisor.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, MapPin, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useSiteAssets } from '../providers/SiteAssetsProvider';

// Custom Next Arrow
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -right-4 lg:-right-12 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all duration-300 group shadow-lg"
      aria-label="Next package"
    >
      <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
    </button>
  );
};

// Custom Prev Arrow
const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -left-4 lg:-left-12 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all duration-300 group shadow-lg"
      aria-label="Previous package"
    >
      <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
    </button>
  );
};

const BookingComLogo = ({ pkgId }: { pkgId: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-[24px] w-auto" viewBox="0 0 5.693 2.848">
    <defs>
      <clipPath id={`A-${pkgId}`}><path d="M589.5 28.972H684V12.937h-94.5z" /></clipPath>
      <clipPath id={`B-${pkgId}`}><path d="M589.5 12.937H684v16.035h-94.5z" /></clipPath>
      <clipPath id={`C-${pkgId}`}><path d="M589.5 28.972H684V12.937h-94.5z" /></clipPath>
      <clipPath id={`D-${pkgId}`}><path d="M589.5 28.656h94.48V12.958H589.5z" /></clipPath>
      <clipPath id={`E-${pkgId}`}><path d="M589.5 12.937H684v16.035h-94.5z" /></clipPath>
      <clipPath id={`F-${pkgId}`}><path d="M589.5 28.972H684V12.937h-94.5z" /></clipPath>
      <clipPath id={`G-${pkgId}`}><path d="M589.5 12.937H684v16.035h-94.5z" /></clipPath>
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

export function MaldivesResorts({ resorts = [] }: { resorts?: any[] }) {
  const sliderRef = React.useRef<Slider>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const { getAssetUrl } = useSiteAssets();
  const bgImage = getAssetUrl('homepage_maldives_bg', '/images/MaldivesResortBG.jpg');

  const sliderSettings = {
    dots: true,
    infinite: resorts.length > 3,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: true,
          centerMode: true,
          centerPadding: '40px',
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
          centerMode: true,
          centerPadding: '20px',
        }
      }
    ]
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

        {/* Resort Packages Slider */}
        <div className="mt-8 w-full relative mx-auto [&_.slick-dots_li_button:before]:text-white/70 [&_.slick-dots_li.slick-active_button:before]:text-white z-10">
          {resorts.length > 0 ? (
            <Slider key={isMounted ? 'client' : 'server'} ref={sliderRef} {...sliderSettings}>
              {resorts.map((pkg) => (
                <div key={pkg.id} className="px-2 sm:px-4 outline-none pb-12 pt-4">
                  <div className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(4,29,60,0.03)] hover:shadow-[0_24px_60px_rgba(26,132,255,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out h-full group cursor-pointer">

                    {/* Image Container with Zoom effect */}
                    <div className="relative h-[230px] w-full shrink-0 overflow-hidden bg-[#f4f7fb]">
                      <ImageWithFallback
                        src={pkg.heroImage || pkg.packageImage}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
                      <div className="flex items-center gap-4 mb-2.5 pt-0">
                        {/* Booking.com Block */}
                        <div className="flex flex-col gap-1.5 flex-1 text-left">
                          <div className="h-[24px] flex items-center">
                            <BookingComLogo pkgId={pkg.id} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="bg-[#003b95] text-white font-extrabold text-[10.5px] px-1.5 py-0.5 rounded-[4px] leading-tight">
                              {Number(pkg.bookingRating || 0).toFixed(1)}
                            </div>
                            <span className="text-gray-400 text-[10.5px] font-extrabold leading-none mt-0.5">
                              ({pkg.bookingReviews || 0})
                            </span>
                          </div>
                        </div>

                        {/* Vertical Separator */}
                        <div className="w-[1px] h-8 bg-[#041d3c]/8 rounded-full"></div>

                        {/* TripAdvisor Block */}
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
                                  className={`w-[13px] h-[13px] rounded-full border-[1.5px] ${i < Math.round(pkg.tripAdvisorRating || 0)
                                    ? 'bg-[#00aa6c] border-[#00aa6c]'
                                    : 'bg-transparent border-[#00aa6c]'
                                    }`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-400 text-[10.5px] font-extrabold leading-none mt-0.5">
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
            </Slider>
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
