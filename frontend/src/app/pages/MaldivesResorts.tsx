import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ServicesSection } from '../components/ServicesSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { Link } from 'react-router';

export function MaldivesResorts() {
  const categories = [
    {
      title: "Overwater Villas",
      slug: "overwater-villas",
      desc: "Wake up to the gentle sound of the Indian Ocean in your private luxury overwater sanctuary.",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGx1eHVyeSUyMHJlc29ydCUyMHdhdGVyJTIwdmlsbGF8ZW58MXx8fHwxNzc5OTE1MDA1fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Romantic Getaways",
      slug: "romantic-getaways",
      desc: "The ultimate honeymoon destination with secluded beaches, private pools, and spectacular sunsets.",
      image: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHJvbWFudGljJTIwY291cGxlJTIwYmVhY2h8ZW58MXx8fHwxNzc5OTE1MDA2fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Family Resorts",
      slug: "family-resorts",
      desc: "Spacious beach villas, kids' clubs, and exciting water sports for unforgettable family moments.",
      image: "https://images.unsplash.com/photo-1583297084116-e420ca5aba80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBwbGF5aW5nJTIwYmVhY2glMjB0cm9waWNhbCUyMHJlc29ydHxlbnwxfHx8fDE3Nzk5MTUwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Luxury Wellness & Spa",
      slug: "luxury-wellness-spa",
      desc: "Rejuvenate with world-class holistic therapies, yoga pavilions, and underwater spa treatments.",
      image: "https://images.unsplash.com/photo-1488345979593-09db0f85545f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcGElMjB0cmVhdG1lbnQlMjB3ZWxsbmVzc3xlbnwxfHx8fDE3Nzk5MTUwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Diving & Snorkeling",
      slug: "diving-snorkeling",
      desc: "Explore vibrant coral reefs, swim with manta rays, and discover abundant marine life.",
      image: "https://images.unsplash.com/photo-1593665840592-8c662655fb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGRpdmluZyUyMHNub3JrZWxpbmclMjBjb3JhbHxlbnwxfHx8fDE3Nzk5MTUwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Exclusive Dining",
      slug: "exclusive-dining",
      desc: "From sandbank picnics to extraordinary underwater restaurants serving global gastronomy.",
      image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGRpbmluZyUyMHByaXZhdGUlMjBkaW5uZXJ8ZW58MXx8fHwxNzc5OTE1MDEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Private Yacht & Cruises",
      slug: "private-yacht-cruises",
      desc: "Sail the atolls in sheer luxury, complete with private chefs and tailored itineraries.",
      image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHN1bnNldCUyMGNydWlzZSUyMHlhY2h0fGVufDF8fHx8MTc3OTkxNTAxMHww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Private Islands",
      slug: "private-islands",
      desc: "Experience the pinnacle of exclusivity by renting an entire island just for you and your guests.",
      image: "https://images.unsplash.com/photo-1574226780565-388f10f8121e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHByaXZhdGUlMjBpc2xhbmQlMjBhZXJpYWx8ZW58MXx8fHwxNzc5OTE1MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <div className="w-full bg-[#f8fbff] flex flex-col font-poppins min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#041d3c]/40 z-10 mix-blend-multiply" />
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGx1eHVyeSUyMHJlc29ydCUyMGFlcmlhbHxlbnwxfHx8fDE3Nzk5MDQxMTd8MA&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="Maldives Luxury Resort" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 text-center px-6 mt-16">
          <p className="text-white/90 font-medium text-[14px] uppercase tracking-[0.3em] mb-4 drop-shadow-md">
            Escape to Tropical Perfection
          </p>
          <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
            Maldives Resorts
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md">
            Discover a world of crystal-clear lagoons, pristine white sands, and unrivaled luxury.
          </p>
        </div>
      </section>

      {/* Intro Description */}
      <section className="w-full max-w-screen-xl mx-auto px-12 lg:px-24 pt-24 pb-8 text-center">
        <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[42px] mb-6">Experience Unmatched Luxury</h2>
        <p className="text-[#041d3c]/80 text-[16px] lg:text-[18px] leading-[1.8] font-medium max-w-4xl mx-auto">
          Immerse yourself in the tranquility of the Maldives, an archipelago renowned for its breathtaking beauty and exclusive resorts. Whether you desire a romantic getaway in an overwater villa or a fun-filled family vacation on a private island, our curated selection of properties guarantees a spectacular and lavish escape.
        </p>
      </section>

      {/* Best Service Section */}
      <div className="mb-12">
        <ServicesSection />
      </div>

      {/* Resort Categories Grid */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 pb-24">
        <div className="text-center mb-16">
          <p className="text-gray-500 font-medium text-[14px] uppercase tracking-[0.2em] mb-4">Island Sanctuaries</p>
          <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[42px]">Resort Experiences</h2>
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
                  <Link to={`/maldives-resorts/${category.slug}`} className="bg-[#041d3c] hover:bg-[#041d3c]/90 text-white rounded-full px-6 py-2.5 text-[14px] font-bold transition-colors w-full text-center block">
                    Explore Resorts
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <div className="pb-12 bg-white">
        <ReviewsSection />
      </div>

    </div>
  );
}
