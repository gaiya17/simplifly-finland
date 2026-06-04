"use client";
import { Star, BadgeCheck, ExternalLink } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const reviews = [
  {
    id: 1,
    name: "Ewa",
    time: "6 months ago",
    avatar: "E",
    avatarColor: "#78909c",
    review: "We just returned from an amazing trip to Abu Dhabi and the Maldives (Patina Hotel), perfectly organized by Simplifly. Our travel consultant was incredibly attentive and the whole journey was flawless from start to finish.",
  },
  {
    id: 2,
    name: "Malcm .M",
    time: "7 months ago",
    avatar: "https://images.unsplash.com/photo-1533227260828-531c6b44f566?w=150&h=150&fit=crop",
    avatarColor: "",
    review: "Sri Lanka and Maldives was an amazing journey thanks to Primal of Simplifly OY who formulated a detailed all inclusive itinerary for our family. Every detail was carefully arranged.",
  },
  {
    id: 3,
    name: "Timothea Prodromou",
    time: "9 months ago",
    avatar: "T",
    avatarColor: "#5c6bc0",
    review: "Our second experience with Simplifly Finland Oy was just as seamless as the first. Buddhika took the time to understand what we wanted and delivered a truly memorable holiday.",
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    time: "11 months ago",
    avatar: "S",
    avatarColor: "#5b9e76",
    review: "Flawless execution from start to finish. We felt completely taken care of throughout our 10-day trip. Highly recommended for luxury travel.",
  },
];

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export function ReviewsSection() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4500,
    speed: 800,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    cssEase: 'cubic-bezier(0.25, 1, 0.5, 1)',
    dotsClass: 'slick-dots !bottom-[-32px]',
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="w-full bg-[#f8fafc] py-[90px] lg:py-[110px] font-poppins overflow-hidden relative">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[radial-gradient(circle,_rgba(4,29,60,0.03)_0%,_transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">

          {/* ── LEFT: Company Info Panel ── */}
          <div className="shrink-0 w-full lg:w-[260px] flex flex-col items-center lg:items-start gap-6">

            {/* Brand logo circle */}
            <div className="w-[80px] h-[80px] rounded-full bg-black shadow-[0_8px_28px_rgba(4,29,60,0.10)] border border-[#041d3c]/6 overflow-hidden flex items-center justify-center">
              {/* Replace the src below with your SVG path */}
              <img src="/images/simplifly-bird-logo.svg" alt="Simplifly" className="w-[90%] h-[90%] object-contain" />
            </div>

            {/* Company name & rating */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2">
              <h3 className="text-[#041d3c] font-black text-[18px] leading-snug">Simplifly Finland Oy</h3>

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-[17px] h-[17px] fill-[#fbbc04] text-[#fbbc04]" />
                ))}
              </div>

              {/* Google badge */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <GoogleIcon />
                <span className="text-gray-500 text-[13px] font-medium">Google Reviews</span>
              </div>

              {/* Score pill */}
              <div className="flex items-center gap-2 bg-white border border-[#041d3c]/6 rounded-[10px] px-3.5 py-2 shadow-sm mt-1">
                <span className="text-[#041d3c] font-black text-[22px] leading-none">5.0</span>
                <div className="w-[1px] h-5 bg-[#041d3c]/10" />
                <span className="text-gray-400 text-[12px] font-semibold leading-tight">Perfect<br/>Score</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-[#041d3c]/6 w-full" />

            {/* Write a review CTA */}
            <a
              href="https://www.google.com/maps/place/Simplifly+Finland+Oy/@60.472829,22.3170561,17z/data=!3m1!4b1!4m6!3m5!1s0x468c772fff66f9f3:0xbe8c4c80f6e7d7e8!8m2!3d60.472829!4d22.3170561!16s%2Fg%2F11txlb37rk?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#f0f5ff] text-[#041d3c] border border-[#041d3c]/12 hover:border-[#1a84ff]/30 rounded-[12px] px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-[0_4px_16px_rgba(26,132,255,0.12)] hover:-translate-y-0.5 group w-full justify-center lg:justify-start"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#1a84ff] group-hover:scale-110 transition-transform" />
              Write a Review
            </a>
          </div>

          {/* ── RIGHT: Review Cards Carousel ── */}
          <div className="w-full lg:flex-1 min-w-0 pb-10">
            <Slider {...settings}>
              {reviews.map((review) => (
                <div key={review.id} className="px-3 outline-none">
                  <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(4,29,60,0.05)] hover:shadow-[0_12px_40px_rgba(4,29,60,0.09)] transition-all duration-300 hover:-translate-y-1 cursor-default group flex flex-col gap-4 min-h-[220px]">

                    {/* Header: avatar + name + google icon */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {review.avatar.startsWith('http') ? (
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-[44px] h-[44px] rounded-full object-cover shrink-0 ring-2 ring-[#041d3c]/6"
                          />
                        ) : (
                          <div
                            className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-white font-black text-[16px] shrink-0 ring-2 ring-white shadow-sm"
                            style={{ backgroundColor: review.avatarColor }}
                          >
                            {review.avatar}
                          </div>
                        )}
                        {/* Name & time */}
                        <div>
                          <p className="text-[#041d3c] font-bold text-[14px] leading-tight">{review.name}</p>
                          <p className="text-gray-400 text-[12px] font-medium mt-0.5">{review.time}</p>
                        </div>
                      </div>
                      <GoogleIcon />
                    </div>

                    {/* Stars + verified */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-[14px] h-[14px] fill-[#fbbc04] text-[#fbbc04]" />
                        ))}
                      </div>
                      <BadgeCheck className="w-[15px] h-[15px] fill-[#1a84ff] text-white" strokeWidth={2.5} />
                    </div>

                    {/* Review text */}
                    <p className="text-gray-600 text-[14px] leading-[1.7] line-clamp-3 font-normal flex-1">
                      {review.review}
                    </p>

                    {/* Thin accent bottom border on hover */}
                    <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#1a84ff]/60 to-transparent rounded-full transition-all duration-500 ease-out" />
                  </div>
                </div>
              ))}
            </Slider>
          </div>

        </div>
      </div>
    </section>
  );
}
