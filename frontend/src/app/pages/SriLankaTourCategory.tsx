import { useParams, Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ServicesSection } from '../components/ServicesSection';
import { ReviewsSection } from '../components/ReviewsSection';

// Mock database for categories to provide rich page content
const categoryData: Record<string, any> = {
  "adventure-nature": {
    title: "Adventure & Nature",
    heroImage: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRyYWluJTIwZWxsYXxlbnwxfHx8fDE3Nzk5NDU4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    desc: "Thrilling excursions through misty mountains, dense jungles, and rushing waterfalls. Discover the untamed heart of Sri Lanka.",
    packages: [
      {
        id: "adv-1",
        title: "Ella Highlands Trekking",
        duration: "5 Days / 4 Nights",
        price: "$850",
        desc: "Hike through lush tea estates, climb Little Adam's Peak, and witness the iconic Nine Arch Bridge.",
        image: "https://images.unsplash.com/photo-1491497895121-1334fc14d8c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRlYSUyMHBsYW50YXRpb258ZW58MXx8fHwxNzc5OTQ1ODkzfDA&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        id: "adv-2",
        title: "Knuckles Range Adventure",
        duration: "7 Days / 6 Nights",
        price: "$1,120",
        desc: "A rugged journey into the cloud forests of the Knuckles Mountain Range. Ideal for extreme adventurers.",
        image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRyYWluJTIwZWxsYXxlbnwxfHx8fDE3Nzk5NDU4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  },
  "culture-heritage": {
    title: "Culture & Heritage",
    heroImage: "https://images.unsplash.com/photo-1612862862126-865765df2ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWdpcml5YSUyMHJvY2slMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3Nzk5NDU4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    desc: "Step back in time as you explore ancient ruins, sacred temples, and royal cities dating back millennia.",
    packages: [
      {
        id: "cul-1",
        title: "Cultural Triangle Immersion",
        duration: "8 Days / 7 Nights",
        price: "$1,450",
        desc: "Explore Sigiriya, Polonnaruwa, and Anuradhapura. Uncover the golden era of Sri Lankan kings.",
        image: "https://images.unsplash.com/photo-1612862862126-865765df2ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWdpcml5YSUyMHJvY2slMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3Nzk5NDU4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        id: "cul-2",
        title: "Galle Fort & Coastal History",
        duration: "5 Days / 4 Nights",
        price: "$980",
        desc: "Wander the cobbled streets of the Dutch Fort in Galle, diving into the colonial heritage of the south.",
        image: "https://images.unsplash.com/photo-1704797390682-76479a29dc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGdhbGxlJTIwZm9ydHxlbnwxfHx8fDE3Nzk5NDU4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  },
  "wildlife-tours": {
    title: "Wild Life Tours",
    heroImage: "https://images.unsplash.com/photo-1566708627877-859df13ae63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWxhJTIwc2FmYXJpJTIwbGVvcGFyZHxlbnwxfHx8fDE3Nzk5NDU4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    desc: "Encounter majestic elephants, elusive leopards, and exotic birds in their natural habitats across stunning national parks.",
    packages: [
      {
        id: "wild-1",
        title: "Yala Leopard Safari",
        duration: "4 Days / 3 Nights",
        price: "$890",
        desc: "Stay in luxury glamping tents and track the Sri Lankan leopard in Yala National Park.",
        image: "https://images.unsplash.com/photo-1566708627877-859df13ae63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWxhJTIwc2FmYXJpJTIwbGVvcGFyZHxlbnwxfHx8fDE3Nzk5NDU4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        id: "wild-2",
        title: "Minneriya Elephant Gathering",
        duration: "5 Days / 4 Nights",
        price: "$950",
        desc: "Witness one of the greatest wildlife spectacles on Earth as hundreds of elephants gather around the Minneriya tank.",
        image: "https://images.unsplash.com/photo-1533484482814-3fe2d922be89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGVsZXBoYW50JTIwZ2F0aGVyaW5nfGVufDF8fHx8MTc3OTk0NTg5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  },
  "family-tours": {
    title: "Family Tours",
    heroImage: "https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGJlYWNoJTIwbHV4dXJ5fGVufDF8fHx8MTc3OTk0NTg5MHww&ixlib=rb-4.1.0&q=80&w=1080",
    desc: "Carefully curated experiences that provide comfort, fun, and safety for all ages.",
    packages: [
      {
        id: "fam-1",
        title: "Southern Beach & Turtle Safari",
        duration: "7 Days / 6 Nights",
        price: "$1,800",
        desc: "Relax on golden sands, visit turtle hatcheries, and enjoy family-friendly resort amenities.",
        image: "https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGJlYWNoJTIwbHV4dXJ5fGVufDF8fHx8MTc3OTk0NTg5MHww&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  },
  "sri-lanka-maldives": {
    title: "Sri Lanka + Maldives",
    heroImage: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHVuZGVyd2F0ZXIlMjBkaW5pbmd8ZW58MXx8fHwxNzc5OTQ1ODkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    desc: "The ultimate dual-destination experience, blending rich culture with tropical paradise.",
    packages: [
      {
        id: "dual-1",
        title: "Culture to Coral Reefs",
        duration: "12 Days / 11 Nights",
        price: "$3,500",
        desc: "Begin with Sri Lanka's cultural triangle and finish in a luxurious Maldivian overwater villa.",
        image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHVuZGVyd2F0ZXIlMjBkaW5pbmd8ZW58MXx8fHwxNzc5OTQ1ODkzfDA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  }
};

export function SriLankaTourCategory() {
  const { categoryId } = useParams();
  
  // Default to a generic fallback if slug not found
  const data = categoryId && categoryData[categoryId] ? categoryData[categoryId] : {
    title: "Luxury Tour Packages",
    heroImage: "https://images.unsplash.com/photo-1594805938839-c581da5d8129?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGx1eHVyeSUyMGhvdGVsJTIwdHJvcGljYWx8ZW58MXx8fHwxNzc5OTE0MDgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    desc: "Discover our exclusive hand-picked itineraries across beautiful Sri Lanka.",
    packages: [
      {
        id: "gen-1",
        title: "Grand Sri Lanka Explorer",
        duration: "10 Days / 9 Nights",
        price: "$2,200",
        desc: "A comprehensive journey across the island, from ancient ruins to pristine southern coastlines.",
        image: "https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGJlYWNoJTIwbHV4dXJ5fGVufDF8fHx8MTc3OTk0NTg5MHww&ixlib=rb-4.1.0&q=80&w=1080"
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
          <p className="text-gray-500 font-medium text-[14px] uppercase tracking-[0.2em] mb-4">Select Your Journey</p>
          <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[42px]">Available Tour Packages</h2>
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
                    to={`/sri-lanka-tours/${categoryId || 'all'}/${pkg.id}`}
                    className="bg-[#f8fbff] text-[#041d3c] border border-[#041d3c]/20 hover:bg-[#041d3c] hover:text-white rounded-full px-6 py-2.5 text-[14px] font-bold transition-all shadow-sm"
                  >
                    View Details
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