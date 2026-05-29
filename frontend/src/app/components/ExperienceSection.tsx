import { Leaf, Palmtree, Map, ThumbsUp, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&q=80",
    title: "Overwater Villas",
    location: "Maldives",
    span: "col-span-2 row-span-2"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80",
    title: "Wildlife Safaris",
    location: "Sri Lanka",
    span: "col-span-1 row-span-1"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1729543239723-1feccd5c00b6?auto=format&fit=crop&q=80",
    title: "Beachfront Dining",
    location: "Maldives",
    span: "col-span-1 row-span-1"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1516567722094-336c4540b05f?auto=format&fit=crop&q=80",
    title: "Glass Igloos",
    location: "Finland",
    span: "col-span-1 row-span-1"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1720118509152-2df877673bee?auto=format&fit=crop&q=80",
    title: "Luxury Spas",
    location: "Sri Lanka",
    span: "col-span-1 row-span-1"
  }
];

export function ExperienceSection() {
  return (
    <section className="bg-transparent py-[100px] w-full">
      <div className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24">
        
        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[48px] leading-tight mb-4">
              Capture The Moment
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Explore our curated collection of extraordinary moments across the globe. From sun-kissed Maldivian shores to the enchanting Arctic wilderness.
            </p>
          </div>
          <button className="shrink-0 bg-white text-[#041d3c] px-8 py-3.5 rounded-[8px] font-bold text-[14px] border-2 border-[#041d3c]/10 hover:border-[#041d3c] transition-all duration-300">
            View All Gallery
          </button>
        </div>

        {/* Masonry-style Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
          {galleryImages.map((img) => (
            <div 
              key={img.id} 
              className={`relative rounded-[16px] overflow-hidden group ${img.span}`}
            >
              <ImageWithFallback 
                src={img.url} 
                alt={img.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/90 via-[#041d3c]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-xl mb-1.5 drop-shadow-md">
                  {img.title}
                </h3>
                <div className="flex items-center gap-1.5 text-white/90">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[13px] font-medium tracking-wide">
                    {img.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}