import { Star, BadgeCheck } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';

const reviews = [
  {
    id: 1,
    name: "Ewa",
    time: "6 months ago",
    avatar: "E",
    avatarBg: "bg-[#78909c]",
    review: "We just returned from an amazing trip to Abu Dhabi and the Maldives (Patina Hotel), perfectly organized by Simplifly. Our travel consultan...",
  },
  {
    id: 2,
    name: "Malcm .M",
    time: "7 months ago",
    avatar: "https://images.unsplash.com/photo-1533227260828-531c6b44f566?w=150&h=150&fit=crop",
    avatarBg: "",
    review: "Sri Lanka and Maldives was an amazing journey thanks to Primal of Simplifly OY who formulated a detailed all inclusive itinerary for...",
  },
  {
    id: 3,
    name: "Timothea Prodromou",
    time: "9 months ago",
    avatar: "T",
    avatarBg: "bg-[#5c6bc0]",
    review: "Our second experience with Simplifly Finland Oy was just as seamless as the first. Buddhika took the time to understand wha...",
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    time: "11 months ago",
    avatar: "S",
    avatarBg: "bg-[#5b9e76]",
    review: "Flawless execution from start to finish. We felt completely taken care of throughout our 10-day trip. Highly recommended for luxury travel.",
  }
];

export function ReviewsSection() {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.25, 1, 0.5, 1)",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <section className="bg-transparent py-[80px] w-full overflow-hidden">
      <div className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24">
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column (Company Info) */}
          <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center gap-6 shrink-0 w-full lg:w-auto lg:min-w-[340px]">
            {/* Logo */}
            <div className="w-[88px] h-[88px] rounded-full flex items-center justify-center bg-white shrink-0 shadow-sm border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-[88px] h-[88px]">
                <circle cx="50" cy="50" r="46" fill="white" stroke="#041d3c" strokeWidth="2.5"/>
                <path d="M38,71 c -8,-8 -8,-25 -2,-35 c 8,2 18,10 24,18 c 2,-6 3,-14 -1,-22 c 6,2 12,8 15,14 c 1,-4 0,-9 -2,-13 c 5,4 9,10 10,16 c -3,15 -12,28 -25,31 c -7,2 -15,1 -19,-9 z" fill="#041d3c"/>
              </svg>
            </div>
            
            {/* Company Text */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-[#041d3c] font-bold text-[19px] mb-1 leading-snug">Simplifly Finland Oy</h3>
              <div className="flex items-center gap-1 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-[18px] h-[18px] fill-[#fbbc04] text-[#fbbc04]" />
                ))}
              </div>
              <span className="text-gray-600 text-[14px] mb-3 font-medium">3 Google reviews</span>
              <button className="bg-[#f8f9fa] border border-[#dadce0] rounded-[6px] px-4 py-1.5 text-[14px] font-medium text-[#3c4043] hover:bg-[#f1f3f4] transition-colors shadow-sm w-fit">
                Write a review
              </button>
            </div>
          </div>

          {/* Right Column (Carousel) */}
          <div className="w-full lg:w-0 lg:flex-1 min-w-0">
            <Slider {...settings} className="review-slider mx-[-12px]">
              {reviews.map((review) => (
                <div key={review.id} className="px-3 outline-none">
                  <div className="bg-[#fcfdfd] rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-[240px] flex flex-col cursor-grab active:cursor-grabbing border border-white">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4 items-center">
                        {review.avatar.length === 1 ? (
                          <div className={`w-[42px] h-[42px] rounded-full text-white flex items-center justify-center font-medium text-lg shrink-0 ${review.avatarBg}`}>
                            {review.avatar}
                          </div>
                        ) : (
                          <img 
                            src={review.avatar} 
                            alt={review.name}
                            className="w-[42px] h-[42px] rounded-full object-cover shrink-0 shadow-sm"
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="text-[#041d3c] font-bold text-[15px] leading-tight mb-0.5">{review.name}</span>
                          <span className="text-gray-500 text-[13px]">{review.time}</span>
                        </div>
                      </div>
                      
                      {/* Google G Logo */}
                      <div className="w-[22px] h-[22px] shrink-0">
                        <svg viewBox="0 0 48 48">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Stars & Verified */}
                    <div className="flex items-center gap-2.5 mb-3.5">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-[16px] h-[16px] fill-[#fbbc04] text-[#fbbc04]" />
                        ))}
                      </div>
                      <BadgeCheck className="w-[16px] h-[16px] fill-[#1d8efd] text-white" strokeWidth={2.5} />
                    </div>

                    {/* Review Text */}
                    <p className="text-[#3c4043] text-[14px] leading-[1.6] line-clamp-3 font-medium">
                      {review.review}
                    </p>
                    
                    <button className="text-gray-400 font-medium text-[13px] mt-auto text-left hover:text-gray-700 transition-colors">
                      Read more
                    </button>
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