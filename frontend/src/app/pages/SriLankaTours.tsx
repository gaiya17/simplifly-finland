import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ServicesSection } from '../components/ServicesSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { Link } from 'react-router';

export function SriLankaTours() {
  const categories = [
    {
      title: "Adventure & Nature",
      slug: "adventure-nature",
      desc: "Thrilling excursions through misty mountains, dense jungles, and rushing waterfalls.",
      image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRyYWluJTIwbmF0dXJlfGVufDF8fHx8MTc3OTkxNDA3OXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Culture & Heritage",
      slug: "culture-heritage",
      desc: "Step back in time as you explore ancient ruins, sacred temples, and royal cities.",
      image: "https://images.unsplash.com/photo-1711797750174-c3750dd9d7c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHNpZ2lyaXlhJTIwcm9ja3xlbnwxfHx8fDE3Nzk5MTQwNzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Family Tours",
      slug: "family-tours",
      desc: "Carefully curated experiences that provide comfort, fun, and safety for all ages.",
      image: "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMGx1eHVyeSUyMHJlc29ydHxlbnwxfHx8fDE3Nzk5MTQwODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Wild Life Tours",
      slug: "wildlife-tours",
      desc: "Encounter majestic elephants, elusive leopards, and exotic birds in their natural habitats.",
      image: "https://images.unsplash.com/photo-1533484482814-3fe2d922be89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGVsZXBoYW50JTIwc2FmYXJpfGVufDF8fHx8MTc3OTkwNDEyMHww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Romantic Tours",
      slug: "romantic-tours",
      desc: "Idyllic escapes designed for couples, featuring secluded beaches and intimate dinners.",
      image: "https://images.unsplash.com/photo-1539576776193-2c07122e5fee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGNvdXBsZSUyMGhvbmV5bW9vbnxlbnwxfHx8fDE3Nzk5MTQwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Sustainable Tours",
      slug: "sustainable-tours",
      desc: "Eco-friendly journeys that support local communities and protect natural ecosystems.",
      image: "https://images.unsplash.com/photo-1564889054706-1d6953ba63c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRlYSUyMHBsYW50YXRpb24lMjBsdXh1cnl8ZW58MXx8fHwxNzc5OTE0MDc1fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Wellness & Ayurveda",
      slug: "wellness-ayurveda",
      desc: "Rejuvenate your mind, body, and soul with ancient healing traditions and luxury spas.",
      image: "https://images.unsplash.com/photo-1716864963557-f671917abc9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxheXVydmVkYSUyMHNwYSUyMGx1eHVyeSUyMHNyaSUyMGxhbmthfGVufDF8fHx8MTc3OTkxNDA3NXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Sri Lanka + Maldives",
      slug: "sri-lanka-maldives",
      desc: "The ultimate dual-destination experience, blending rich culture with tropical paradise.",
      image: "https://images.unsplash.com/photo-1623137285532-ec3df3e9abc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHZhY2F0aW9uJTIwY291cGxlfGVufDF8fHx8MTc3OTkwOTg3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <div className="w-full bg-[#f8fbff] flex flex-col font-poppins min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#041d3c]/50 z-10 mix-blend-multiply" />
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1594805938839-c581da5d8129?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGx1eHVyeSUyMGhvdGVsJTIwdHJvcGljYWx8ZW58MXx8fHwxNzc5OTE0MDgzfDA&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="Sri Lanka Luxury Tour" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 text-center px-6 mt-16">
          <p className="text-white/90 font-medium text-[14px] uppercase tracking-[0.3em] mb-4 drop-shadow-md">
            Journey to the Pearl of the Indian Ocean
          </p>
          <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
            Sri Lanka Tours
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md">
            Uncover ancient mysteries, breathtaking landscapes, and unparalleled hospitality.
          </p>
        </div>
      </section>

      {/* Intro Description */}
      <section className="w-full max-w-screen-xl mx-auto px-12 lg:px-24 pt-24 pb-8 text-center">
        <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[42px] mb-6">Explore the Wonders of Sri Lanka</h2>
        <p className="text-[#041d3c]/80 text-[16px] lg:text-[18px] leading-[1.8] font-medium max-w-4xl mx-auto">
          From the sun-kissed beaches of the southern coast to the misty, tea-carpeted hills of the central highlands, Sri Lanka offers a tapestry of vibrant cultures and untamed wilderness. Our bespoke tours are meticulously crafted to deliver the utmost in luxury, authenticity, and comfort, ensuring every moment of your journey is extraordinary.
        </p>
      </section>

      {/* Best Service Section (Reused from Home) */}
      <div className="mb-12">
        <ServicesSection />
      </div>

      {/* Tour Categories Grid */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 pb-24">
        <div className="text-center mb-16">
          <p className="text-gray-500 font-medium text-[14px] uppercase tracking-[0.2em] mb-4">Curated Experiences</p>
          <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[42px]">Our Tour Categories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, idx) => (
            <div 
              key={idx} 
              className="group cursor-pointer bg-white rounded-[16px] overflow-hidden shadow-[0_10px_30px_rgba(4,29,60,0.05)] hover:shadow-[0_20px_60px_rgba(4,29,60,0.15)] transition-all duration-500 flex flex-col h-full border border-[#041d3c]/10"
            >
              <div className="relative w-full h-[240px] overflow-hidden">
                <ImageWithFallback 
                  src={category.image} 
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                {/* Subtle dark gradient overlay at the bottom for image depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow bg-white relative">
                <h3 className="text-[#041d3c] font-bold text-[20px] mb-3 leading-tight">{category.title}</h3>
                <p className="text-[#041d3c]/70 text-[15px] leading-[1.7] font-medium flex-grow">
                  {category.desc}
                </p>
                <div className="mt-8 w-full">
                  <Link to={`/sri-lanka-tours/${category.slug}`} className="bg-[#041d3c] hover:bg-[#041d3c]/90 text-white rounded-full px-6 py-2.5 text-[14px] font-bold transition-colors w-full text-center block">
                    Explore Tours
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section (Reused from Home) */}
      <div className="pb-12 bg-white">
        <ReviewsSection />
      </div>

    </div>
  );
}