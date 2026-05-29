import { Clock, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

import imgFamily from '../../imports/4-1.png';
import imgSports from '../../imports/3-1.png';
import imgAdventure1 from '../../imports/2-1.png';
import imgRomantic from '../../imports/Romantic-Tour-2.jpg';
import imgMaldives from '../../imports/Sri-Lanka-Maldives-Tours-6.jpg';
import imgAdventure2 from '../../imports/Adventure-Nature-Based-Tour-2.jpg';

const packages = [
  {
    id: 1,
    title: 'Perfect Family Holiday in Sri Lanka',
    duration: '7 Nights',
    rating: 5,
    reviews: 134,
    price: 1204,
    image: imgFamily,
    discount: '-10%',
    category: 'Family Tours',
    featured: true
  },
  {
    id: 2,
    title: 'Golf, Culture, Wildlife & Coastal Thrills',
    duration: '8 Nights',
    rating: 4.8,
    reviews: 89,
    price: 1350,
    image: imgSports,
    discount: '-15%',
    category: 'Sports & Adventure Tours'
  },
  {
    id: 3,
    title: 'Breathe Wild, Travel Free.',
    duration: '6 Nights',
    rating: 4.9,
    reviews: 156,
    price: 980,
    image: imgAdventure1,
    category: 'Adventure & Nature Based Tours'
  },
  {
    id: 4,
    title: 'Where Love Meets The Island',
    duration: '5 Nights',
    rating: 5,
    reviews: 201,
    price: 1420,
    image: imgRomantic,
    discount: '-20%',
    category: 'Romantic Tours'
  },
  {
    id: 5,
    title: 'Wildlife, Culture & Maldives Blue',
    duration: '9 Nights',
    rating: 4.7,
    reviews: 112,
    price: 1650,
    image: imgMaldives,
    category: 'Sri Lanka + Maldives Tours',
    featured: true
  },
  {
    id: 6,
    title: 'Adventure Starts in Nature',
    duration: '7 Nights',
    rating: 4.9,
    reviews: 143,
    price: 1125,
    image: imgAdventure2,
    discount: '-5%',
    category: 'Adventure & Nature Based Tours',
    featured: true
  },
];

export function DestinationHighlights() {
  return (
    <section className="bg-transparent w-full pb-[100px] pt-[160px] lg:pt-[190px] relative">
      <div className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[48px] leading-[1.1] mb-4">
            Sri Lanka Multiday Tours
          </h2>
          <p className="text-gray-600 text-lg font-normal max-w-3xl">
            Explore our handpicked collection of premium tour packages designed to showcase the very best of Sri Lanka.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="bg-white rounded-[16px] p-3 flex flex-col shadow-[0_8px_30px_rgba(4,29,60,0.04)] hover:shadow-[0_20px_40px_rgba(4,29,60,0.08)] border border-[#041d3c]/[0.08] hover:border-[#041d3c]/20 hover:-translate-y-1 transition-all duration-500 ease-out h-full group"
            >
              {/* Image Container */}
              <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-[12px] bg-[#f4f7fb]">
                <ImageWithFallback
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                
                {/* Overlay Gradient for Image depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Top Left: Featured Badge */}
                {pkg.featured && (
                  <div className="absolute top-3 left-3 bg-sky-500 text-white rounded-[8px] px-3 py-1.5 font-bold text-[11px] shadow-[0_4px_12px_rgba(14,165,233,0.3)] uppercase tracking-wider">
                    Featured
                  </div>
                )}

                {/* Top Right: Discount */}
                {pkg.discount && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white rounded-[8px] px-3 py-1.5 font-bold text-[12px] shadow-[0_4px_12px_rgba(220,38,38,0.3)] tracking-wide">
                    {pkg.discount}
                  </div>
                )}

                {/* Bottom Left: Duration */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-[8px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                  <Clock className="w-3.5 h-3.5 text-[#041d3c]" />
                  <span className="text-[#041d3c] font-bold text-[11px] uppercase tracking-wider">{pkg.duration}</span>
                </div>
              </div>

              {/* Content Wrapper */}
              <div className="pt-4 pb-2 px-3 flex flex-col flex-grow text-left">
                
                {/* Title */}
                <h3 className="text-[#041d3c] font-semibold text-[20px] leading-[1.3] line-clamp-2 mb-2 min-h-[52px]">
                  {pkg.title}
                </h3>

                {/* Category */}
                <div className="mb-4">
                  <span className="text-black font-normal text-[11px] uppercase tracking-[0.15em]">
                    {pkg.category}
                  </span>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto border-t border-gray-100 pt-4 flex items-end justify-between gap-4">
                  {/* Price */}
                  <div className="flex flex-col justify-end">
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

                  {/* View Details Action */}
                  <button className="bg-[#041d3c] text-white px-4 py-2.5 rounded-[10px] font-bold text-[13px] group-hover:bg-[#f4f7fb] group-hover:text-[#041d3c] transition-colors duration-300 flex items-center gap-1.5 shrink-0 border border-transparent group-hover:border-[#041d3c]/10">
                    View More
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* View More Packages Button */}
        <div className="flex justify-center mt-12">
          <button className="inline-flex items-center justify-center gap-2 bg-[#041d3c] text-white font-bold px-10 py-4 rounded-[12px] hover:bg-[#041d3c]/90 shadow-[0_4px_20px_rgba(4,29,60,0.2)] transition-all duration-300 text-[16px] group w-full md:w-auto">
            View More Packages
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}