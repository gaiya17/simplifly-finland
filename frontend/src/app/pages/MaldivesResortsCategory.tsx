import { useParams, Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ServicesSection } from '../components/ServicesSection';
import { ReviewsSection } from '../components/ReviewsSection';

// Mock database for categories to provide rich page content
const categoryData: Record<string, any> = {
  "overwater-villas": {
    title: "Overwater Villas",
    heroImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMG92ZXJ3YXRlciUyMHZpbGxhJTIwbHV4dXJ5fGVufDF8fHx8MTc3OTk0ODcyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    desc: "Wake up to the gentle sound of the Indian Ocean in your private luxury overwater sanctuary. Step directly from your deck into the crystal-clear lagoon below, and experience the quintessential Maldivian dream.",
    packages: [
      {
        id: "villa-1",
        title: "Ocean Pool Retreat",
        duration: "5 Days / 4 Nights",
        price: "$4,500",
        desc: "An expansive overwater villa featuring a private infinity pool, glass-bottom floors, and personal butler service.",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMG92ZXJ3YXRlciUyMHZpbGxhJTIwbHV4dXJ5fGVufDF8fHx8MTc3OTk0ODcyNXww&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        id: "villa-2",
        title: "Sunset Water Pavilion",
        duration: "7 Days / 6 Nights",
        price: "$6,200",
        desc: "Positioned perfectly for uninterrupted sunset views. Includes private dining deck, direct ocean access, and lavish amenities.",
        image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGx1eHVyeSUyMHJlc29ydCUyMGFlcmlhbHxlbnwxfHx8fDE3Nzk5MDQxMTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  },
  "romantic-getaways": {
    title: "Romantic Getaways",
    heroImage: "https://images.unsplash.com/photo-1526718682953-3dfa184b6790?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHJvbWFudGljJTIwZGlubmVyJTIwYmVhY2h8ZW58MXx8fHwxNzc5OTQ4NzI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    desc: "The ultimate destination for couples and honeymooners. Secluded beaches, private pools, spectacular sunsets, and intimate candlelit dinners under the stars set the stage for unforgettable romance.",
    packages: [
      {
        id: "rom-1",
        title: "Honeymoon Bliss Package",
        duration: "6 Days / 5 Nights",
        price: "$5,800",
        desc: "Includes couples massage, private beach dinner, sunset cruise, and floral bed decorations.",
        image: "https://images.unsplash.com/photo-1526718682953-3dfa184b6790?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHJvbWFudGljJTIwZGlubmVyJTIwYmVhY2h8ZW58MXx8fHwxNzc5OTQ4NzI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        id: "rom-2",
        title: "Secluded Island Escape",
        duration: "8 Days / 7 Nights",
        price: "$7,500",
        desc: "Stay in an isolated island sanctuary with maximum privacy, daily champagne breakfasts, and tailored experiences.",
        image: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHJvbWFudGljJTIwY291cGxlJTIwYmVhY2h8ZW58MXx8fHwxNzc5OTE1MDA2fDA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  },
  "family-resorts": {
    title: "Family Resorts",
    heroImage: "https://images.unsplash.com/photo-1561830016-04cb9459eaa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGZhbWlseSUyMGJlYWNoJTIwcmVzb3J0fGVufDF8fHx8MTc3OTk0ODcyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    desc: "Spacious multi-bedroom beach villas, interactive kids' clubs, and exciting water sports ensure unforgettable family moments in a safe, tropical paradise.",
    packages: [
      {
        id: "fam-1",
        title: "Family Beach Pavilion",
        duration: "7 Days / 6 Nights",
        price: "$6,900",
        desc: "Two-bedroom beachfront villa with a private garden, direct beach access, and complimentary daily kids club.",
        image: "https://images.unsplash.com/photo-1561830016-04cb9459eaa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGZhbWlseSUyMGJlYWNoJTIwcmVzb3J0fGVufDF8fHx8MTc3OTk0ODcyNXww&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  },
  "diving-snorkeling": {
    title: "Diving & Snorkeling",
    heroImage: "https://images.unsplash.com/photo-1628371217613-714161455f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGRpdmluZyUyMGNvcmFsJTIwcmVlZnxlbnwxfHx8fDE3Nzk5NDg3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    desc: "Explore vibrant, colorful coral reefs, swim alongside gentle manta rays and whale sharks, and discover the abundant marine life that makes the Maldives a world-class diving destination.",
    packages: [
      {
        id: "dive-1",
        title: "Atoll Diver's Paradise",
        duration: "6 Days / 5 Nights",
        price: "$4,100",
        desc: "Includes PADI certification courses, daily guided boat dives, and underwater photography sessions.",
        image: "https://images.unsplash.com/photo-1628371217613-714161455f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGRpdmluZyUyMGNvcmFsJTIwcmVlZnxlbnwxfHx8fDE3Nzk5NDg3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  }
};

export function MaldivesResortsCategory() {
  const { categoryId } = useParams();
  
  // Default to a generic fallback if slug not found
  const data = categoryId && categoryData[categoryId] ? categoryData[categoryId] : {
    title: "Luxury Island Resorts",
    heroImage: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGx1eHVyeSUyMHJlc29ydCUyMGFlcmlhbHxlbnwxfHx8fDE3Nzk5MDQxMTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    desc: "Discover a world of crystal-clear lagoons, pristine white sands, and unrivaled luxury tailored precisely to your preferences.",
    packages: [
      {
        id: "gen-1",
        title: "Signature Island Escape",
        duration: "7 Days / 6 Nights",
        price: "$5,500",
        desc: "A harmonious blend of beach and overwater living, offering the finest amenities and world-class culinary experiences.",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMG92ZXJ3YXRlciUyMHZpbGxhJTIwbHV4dXJ5fGVufDF8fHx8MTc3OTk0ODcyNXww&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  };

  return (
    <div className="w-full bg-[#f8fbff] flex flex-col font-poppins min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#041d3c]/60 z-10 mix-blend-multiply" />
        <ImageWithFallback 
          src={data.heroImage} 
          alt={data.title} 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg">
            {data.title}
          </h1>
        </div>
      </section>

      {/* Intro Description */}
      <section className="w-full max-w-screen-xl mx-auto px-12 lg:px-24 pt-24 text-center">
        <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[42px] mb-6">About {data.title}</h2>
        <p className="text-[#041d3c]/80 text-[16px] lg:text-[18px] leading-[1.8] font-medium max-w-4xl mx-auto">
          {data.desc}
        </p>
      </section>

      {/* Services Section */}
      <div className="pt-20 pb-12">
        <ServicesSection />
      </div>

      {/* Available Packages Section */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 pb-24">
        <div className="text-center mb-16">
          <p className="text-gray-500 font-medium text-[14px] uppercase tracking-[0.2em] mb-4">Select Your Sanctuary</p>
          <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[42px]">Available Resorts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.packages.map((pkg: any) => (
            <div 
              key={pkg.id} 
              className="group bg-white rounded-[16px] overflow-hidden shadow-[0_10px_30px_rgba(4,29,60,0.05)] hover:shadow-[0_20px_60px_rgba(4,29,60,0.15)] transition-all duration-500 flex flex-col h-full border border-[#041d3c]/10"
            >
              <div className="relative w-full h-[260px] overflow-hidden">
                <ImageWithFallback 
                  src={pkg.image} 
                  alt={pkg.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[#041d3c] font-bold text-[14px] shadow-sm">
                  {pkg.duration}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-[#041d3c] font-bold text-[22px] mb-3 leading-tight">
                  {pkg.title}
                </h3>
                <p className="text-[#041d3c]/70 text-[15px] leading-[1.7] font-medium flex-grow mb-6">
                  {pkg.desc}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#041d3c]/10">
                  <div>
                    <span className="text-gray-500 text-[13px] font-medium block">Starting from</span>
                    <span className="text-[#041d3c] font-bold text-[20px]">{pkg.price}</span>
                  </div>
                  <Link 
                    to={`/maldives-resorts/${categoryId || 'luxury'}/${pkg.id}`}
                    className="bg-[#f8fbff] text-[#041d3c] border border-[#041d3c]/20 hover:bg-[#041d3c] hover:text-white rounded-full px-6 py-2.5 text-[14px] font-bold transition-all shadow-sm"
                  >
                    View Resort
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
