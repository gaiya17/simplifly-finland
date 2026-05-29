import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const galleryImages = [
  "https://images.unsplash.com/photo-1512100356356-de1b84283e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGx1eHVyeSUyMHJlc29ydCUyMGFlcmlhbHxlbnwxfHx8fDE3Nzk5MDQxMTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1533484482814-3fe2d922be89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGVsZXBoYW50JTIwc2FmYXJpfGVufDF8fHx8MTc3OTkwNDEyMHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1658298208155-ab71765747a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHNub3JrZWxpbmd8ZW58MXx8fHwxNzc5OTA0MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1604293679030-7cfcd7174ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGx1eHVyeSUyMHJlc29ydHxlbnwxfHx8fDE3Nzk5MDQwODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHByaXZhdGUlMjBkaW5uZXJ8ZW58MXx8fHwxNzc5OTA0MDg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRyYWluJTIwam91cm5leXxlbnwxfHx8fDE3Nzk5MDQwOTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
];

export function GalleryPage() {
  return (
    <div className="w-full bg-[#f8fbff] flex flex-col">
      
      {/* Mini Hero */}
      <section className="relative w-full h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#041d3c] pt-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        <div className="relative z-20 text-center px-6 mt-10">
          <h1 className="text-white text-5xl md:text-6xl font-bold uppercase tracking-wide mb-4">Gallery</h1>
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Visual glimpses into the extraordinary.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 py-[100px]">
        <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 1024: 3}}>
          <Masonry gutter="24px">
            {galleryImages.map((src, i) => (
              <div 
                key={i} 
                className="overflow-hidden rounded-[16px] shadow-[0_12px_40px_rgba(4,29,60,0.08)] group cursor-pointer"
              >
                <ImageWithFallback 
                  src={src} 
                  alt={`Gallery Image ${i + 1}`} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </section>

    </div>
  );
}