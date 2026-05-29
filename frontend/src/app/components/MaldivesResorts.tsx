import { ImageWithFallback } from './figma/ImageWithFallback';
import bgImage from '../../imports/020437355c6d0b25e55780eb8233d1c9.jpg';
import comoCocoaImg from '../../imports/COMO-Cocoa-Island.jpg';
import comoMaalifushiImg from '../../imports/COMO-Maalifushi.jpg';
import gangehiImg from '../../imports/Gangehi-Island-Resort-Spa.jpg';
import hiltonImg from '../../imports/Hilton-Maldives-Amingiri-Resort-Spa.jpg';
import tripAdvisorLogo from '../../imports/tripadvisor.png';
import trustpilotLogo from '../../imports/trustpilot.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';
import React from 'react';

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

const packages = [
  {
    id: 1,
    title: "COMO Cocoa Island",
    image: comoCocoaImg,
    price: 685,
    trustPilotRating: 5,
    trustPilotReviews: 142,
    tripAdvisorRating: 5,
    tripAdvisorReviews: 124,
    location: "South Malé Atoll, Maldives",
    discount: "1% OFF",
  },
  {
    id: 2,
    title: "COMO Maalifushi",
    image: comoMaalifushiImg,
    price: 950,
    trustPilotRating: 5,
    trustPilotReviews: 96,
    tripAdvisorRating: 4.9,
    tripAdvisorReviews: 89,
    location: "Thaa Atoll, Maldives",
    discount: "5% OFF",
  },
  {
    id: 3,
    title: "Gangehi Island Resort & Spa",
    image: gangehiImg,
    price: 420,
    trustPilotRating: 4.8,
    trustPilotReviews: 210,
    tripAdvisorRating: 4.8,
    tripAdvisorReviews: 156,
    location: "North Ari Atoll, Maldives",
  },
  {
    id: 4,
    title: "Hilton Maldives Amingiri",
    image: hiltonImg,
    price: 1100,
    trustPilotRating: 4.9,
    trustPilotReviews: 312,
    tripAdvisorRating: 4.9,
    tripAdvisorReviews: 210,
    location: "North Malé Atoll, Maldives",
    discount: "10% OFF",
  }
];

export function MaldivesResorts() {
  const sliderRef = React.useRef<Slider>(null);

  const sliderSettings = {
    dots: true,
    infinite: true,
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
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
        }
      }
    ]
  };

  return (
    <section className="relative w-full overflow-hidden min-h-[600px] py-[100px] lg:py-[140px]">
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
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-12 lg:px-24 h-full flex flex-col justify-center items-center">
        <div className="mb-4 flex flex-col items-center text-center">
          <h2 className="text-white font-bold text-4xl lg:text-[48px] tracking-wide drop-shadow-lg text-center leading-tight mb-4">
            Maldives Resorts
          </h2>
          <p className="text-white/90 text-lg drop-shadow-md text-center font-normal max-w-3xl">
            Escape to the Maldives for an ultra-luxury holiday beyond imagination
          </p>
        </div>

        {/* Resort Packages Slider */}
        <div className="mt-8 w-full relative mx-auto [&_.slick-dots_li_button:before]:text-white/70 [&_.slick-dots_li.slick-active_button:before]:text-white">
          <Slider ref={sliderRef} {...sliderSettings}>
            {packages.map((pkg) => (
              <div key={pkg.id} className="px-4 outline-none pb-12 pt-4">
                <div className="bg-white rounded-[16px] p-3 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-[#041d3c]/[0.15] hover:border-[#041d3c]/30 hover:-translate-y-1 transition-all duration-500 ease-out h-full group">
                  {/* Image Container */}
                  <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-[12px] bg-[#f4f7fb]">
                    <ImageWithFallback
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    
                    {/* Overlay Gradient for Image depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Top Right: Discount */}
                    {pkg.discount && (
                      <div className="absolute top-3 right-3 bg-[#e81d2c] text-white rounded-[8px] px-3 py-1.5 font-bold text-[12px] shadow-[0_4px_12px_rgba(232,29,44,0.2)] tracking-wide z-10">
                        {pkg.discount}
                      </div>
                    )}

                    {/* Bottom Left: Nights/Adults overlay on image */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-[8px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-w-[85%]">
                      <Users className="w-3.5 h-3.5 text-[#041d3c] shrink-0" />
                      <span className="text-[#041d3c] font-bold text-[11px] uppercase tracking-wider truncate">
                        1 Night, 2 Adults
                      </span>
                    </div>
                  </div>

                  {/* Content Wrapper */}
                  <div className="pt-4 pb-2 px-3 flex flex-col flex-grow text-left">
                    
                    {/* Title */}
                    <h3 className="text-[#041d3c] font-semibold text-[20px] leading-[1.3] line-clamp-2 mb-1 min-h-[52px]">
                      {pkg.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 mb-3 text-gray-500">
                      <MapPin className="w-4 h-4 shrink-0 text-[#041d3c]/60" />
                      <span className="text-[13px] font-medium tracking-wide">
                        {pkg.location}
                      </span>
                    </div>

                    {/* Dual Platform Reviews */}
                    <div className="flex items-center gap-4 mb-4">
                      {/* Trustpilot Block */}
                      <div className="flex flex-col gap-2 flex-1">
                        <ImageWithFallback
                          src={trustpilotLogo}
                          alt="Trustpilot"
                          className="h-[30px] w-auto object-contain object-left"
                        />
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-[2px]">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-[14px] h-[14px] flex items-center justify-center ${
                                  i < Math.round(pkg.trustPilotRating)
                                    ? 'bg-[#00b67a]'
                                    : 'bg-gray-200'
                                }`}
                              >
                                <svg className="w-[10px] h-[10px] text-white fill-current" viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              </div>
                            ))}
                          </div>
                          <span className="text-gray-400 text-[11px] font-semibold leading-none mt-0.5">
                            {pkg.trustPilotReviews}
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="w-[1px] h-10 bg-gray-200 rounded-full mt-1"></div>

                      {/* TripAdvisor Block */}
                      <div className="flex flex-col gap-2 flex-1 pl-1">
                        <ImageWithFallback
                          src={tripAdvisorLogo}
                          alt="TripAdvisor"
                          className="h-[30px] w-auto object-contain object-left"
                        />
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-[3px]">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-[14px] h-[14px] rounded-full border-[2px] ${
                                  i < Math.round(pkg.tripAdvisorRating)
                                    ? 'bg-[#00aa6c] border-[#00aa6c]'
                                    : 'bg-transparent border-[#00aa6c]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-400 text-[11px] font-semibold leading-none mt-0.5">
                            {pkg.tripAdvisorReviews}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-auto border-t border-gray-100 pt-4 flex items-end justify-between gap-3">
                      {/* Price */}
                      <div className="flex flex-col justify-end pb-1">
                        <p className="text-black text-[11px] font-normal uppercase tracking-widest mb-1">
                          Starting From
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[#041d3c] font-bold text-[24px] leading-none">
                            €{pkg.price}
                          </span>
                          {pkg.discount && (
                            <span className="text-gray-400 line-through text-[13px] font-semibold">
                              €{Math.round(pkg.price / (1 - parseInt(pkg.discount?.replace(/\D/g, '') || '0') / 100))}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 shrink-0 w-[115px]">
                        <button className="w-full bg-white text-[#041d3c] py-2 rounded-[8px] font-bold text-[11px] border border-[#041d3c]/20 hover:bg-[#f4f7fb] hover:border-[#041d3c]/40 transition-all duration-300">
                          Get a Quote
                        </button>
                        <button className="w-full bg-[#041d3c] text-white py-2 rounded-[8px] font-bold text-[11px] hover:bg-[#041d3c]/90 shadow-[0_4px_12px_rgba(4,29,60,0.15)] transition-all duration-300">
                          Explore More
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}