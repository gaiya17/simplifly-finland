import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

import offer1 from '../../imports/Blue_Yellow_Modern_Travel_Facebook_Post.png';
import offer2 from '../../imports/Blue_and_White_Illustrative_Travel_Promo_Banner.png';
import offer3 from '../../imports/Blue_and_White_Illustrative_Travel_Promo_Banner__1_.png';

const OFFERS = [
  { id: 1, image: offer1, alt: "Modern Travel Promo" },
  { id: 2, image: offer2, alt: "Illustrative Travel Deal" },
  { id: 3, image: offer3, alt: "Special Travel Offer" },
];

// Create a long array to simulate a seamless infinite carousel loop
const EXTENDED_OFFERS = Array.from({ length: 60 }).map((_, i) => OFFERS[i % OFFERS.length]);

export function SupportCTA() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= EXTENDED_OFFERS.length - 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const paginate = (direction: number) => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + direction;
      if (nextIndex < 0) return 0;
      if (nextIndex >= EXTENDED_OFFERS.length - 2) return prev;
      return nextIndex;
    });
  };

  return (
    <div className="w-full relative z-30 flex justify-center h-0 pointer-events-none mt-2 sm:mt-6 md:mt-0">
      <div className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 absolute top-[-70px] lg:top-[-90px]">
        <div className="w-full bg-white rounded-[16px] shadow-[0_12px_40px_rgba(4,29,60,0.08)] flex flex-col md:flex-row items-center justify-between pointer-events-auto overflow-hidden relative min-h-[140px] md:h-[180px] lg:h-[200px] px-8 lg:px-16 py-8 md:py-0">
          
          {/* Decorative Background Element */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#eef4fa] to-transparent opacity-80 -z-10 transform skew-x-12 translate-x-10"></div>
          </div>

          {/* Left Content */}
          <div className="w-full md:w-auto shrink-0 flex flex-col justify-center items-start text-left z-10">
            <h2 className="text-[#041d3c] font-bold text-[24px] lg:text-[32px] leading-tight mb-5 max-w-[450px]">
              Our team are available 24 hours, 7 days
            </h2>
            <a 
              href="https://wa.me/358408192758"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white rounded-[16px] shadow-[0_12px_24px_rgba(7,94,84,0.3)] hover:shadow-[0_16px_32px_rgba(7,94,84,0.4)] hover:-translate-y-0.5 transition-all duration-500 w-fit overflow-hidden"
            >
              {/* Pulse effect */}
              <span className="absolute inset-0 w-full h-full rounded-[16px] border border-[#128c7e] animate-ping opacity-60 group-hover:opacity-0 transition-opacity duration-300"></span>
              
              {/* Shine effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></span>

              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 group-hover:scale-110 group-hover:rotate-[15deg] transition-transform duration-300 relative z-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-[15px] font-bold tracking-wide relative z-10 whitespace-nowrap">+358 40 819 2758</span>
            </a>
          </div>

          {/* Right Image Container - Peek Carousel */}
          <div className="hidden md:flex relative z-10 items-center justify-end">
            <div className="relative w-[504px] lg:w-[664px] h-[140px] lg:h-[160px] group overflow-hidden">
              
              {EXTENDED_OFFERS.map((offer, i) => {
                const offset = i - currentIndex;
                if (offset < -1 || offset > 2) return null;
                
                return (
                  <motion.div
                    key={i}
                    className="absolute top-0 w-[240px] lg:w-[320px] h-full rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(4,29,60,0.08)] bg-gray-100"
                    initial={false}
                    animate={{ 
                      x: offset === 0 ? "0%" : `calc(${offset * 100}% + ${offset * 24}px)`,
                      opacity: offset < 0 ? 0 : 1,
                      scale: 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ zIndex: 10 - offset }}
                  >
                    <img src={offer.image} alt={offer.alt} className="absolute inset-0 w-full h-full object-cover" />
                  </motion.div>
                );
              })}

              {/* Carousel Controls */}
              <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none px-2">
                <button 
                  onClick={() => paginate(-1)} 
                  className="bg-white/95 backdrop-blur-sm shadow-md p-1.5 rounded-full text-[#041d3c] hover:bg-white hover:scale-110 transition-all duration-300 pointer-events-auto"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => paginate(1)} 
                  className="bg-white/95 backdrop-blur-sm shadow-md p-1.5 rounded-full text-[#041d3c] hover:bg-white hover:scale-110 transition-all duration-300 pointer-events-auto"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Fallback - Peek Carousel */}
          <div className="md:hidden w-full px-6 pb-6 mt-[-10px] z-10 relative">
            <div className="relative w-full h-[150px]">
              {EXTENDED_OFFERS.map((offer, i) => {
                const offset = i - currentIndex;
                if (offset < -1 || offset > 1) return null;
                return (
                  <motion.div
                    key={i}
                    className="absolute top-0 left-0 w-[85%] h-full rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(4,29,60,0.08)] bg-gray-100"
                    initial={false}
                    animate={{ 
                      x: offset === 0 ? "0%" : `calc(${offset * 100}% + ${offset * 16}px)`,
                      opacity: offset < 0 ? 0 : 1,
                      scale: offset === 0 ? 1 : 0.95
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ zIndex: 10 - offset }}
                  >
                    <img src={offer.image} alt={offer.alt} className="absolute inset-0 w-full h-full object-cover" />
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}