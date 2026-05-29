import { useState } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Star, CheckCircle2, ChevronDown, Calendar, Loader2, Users, BedDouble, Maximize, MessageCircle, Utensils, Shirt } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { SupportCTA } from '../components/SupportCTA';
import { ReviewsSection } from '../components/ReviewsSection';

// --- DUMMY DATA FOR THE PACKAGE ---
const resortInfo = {
  title: "Centara Mirage Lagoon Maldives",
  heroImage: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHJlc29ydCUyMGFlcmlhbHxlbnwxfHx8fDE3Nzk5MDQxMTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  rating: "5.0/5 (184 Reviews)",
  summary: "An underwater world themed paradise, perfect for families and couples alike. Centara Mirage Lagoon Maldives offers stunning overwater villas, expansive beachside accommodations, world-class dining, and an unforgettable water park experience.",
  location: "North Malé Atoll",
  transfer: "45 mins by Speedboat",
  price: "From $450",
  duration: "Per Night",
  gallery: [
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMG92ZXJ3YXRlciUyMHZpbGxhJTIwbHV4dXJ5fGVufDF8fHx8MTc3OTk0ODcyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1526718682953-3dfa184b6790?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHJvbWFudGljJTIwZGlubmVyJTIwYmVhY2h8ZW58MXx8fHwxNzc5OTQ4NzI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1561830016-04cb9459eaa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGZhbWlseSUyMGJlYWNoJTIwcmVzb3J0fGVufDF8fHx8MTc3OTk0ODcyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1628371217613-714161455f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGRpdmluZyUyMGNvcmFsJTIwcmVlZnxlbnwxfHx8fDE3Nzk5NDg3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
  ],
};

const TABS = [
  { id: 'villas', label: 'Villas' },
  { id: 'restaurants', label: 'Restaurants' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'fact-sheet', label: 'FACT Sheet' },
  { id: 'deals', label: 'Deals & Offers' }
];

const RESTAURANTS_DATA = [
  {
    title: "Ocean Breeze Signature",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwb2NlYW4lMjByZXN0YXVyYW50fGVufDF8fHx8MTc4MDAzMDEwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Perched gracefully over the crystal-clear lagoon, Ocean Breeze presents an unparalleled fine dining experience. Indulge in Mediterranean-inspired culinary masterpieces and freshly caught Maldivian seafood.",
    schedules: [
      { meal: "Dinner", time: "19:00 - 22:30" }
    ]
  },
  {
    title: "The Palm Pavilion",
    image: "https://images.unsplash.com/photo-1596252890311-caa6a004a6ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNvcnQlMjBicmVha2Zhc3QlMjBidWZmZXR8ZW58MXx8fHwxNzgwMDMwMTExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Start your day with a lavish international breakfast buffet set amidst lush tropical gardens. By evening, The Palm Pavilion transforms into a vibrant culinary theater with live cooking stations.",
    schedules: [
      { meal: "Breakfast", time: "07:00 - 10:30" },
      { meal: "Dinner", time: "18:30 - 21:30" }
    ]
  },
  {
    title: "Saffron & Spice",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZ1c2lvbiUyMGZpbmUlMjBkaW5pbmclMjBzdXNoaXxlbnwxfHx8fDE3ODAwMzAxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Embark on a gastronomic journey through Asia. From delicate Japanese sushi to aromatic Thai curries, our master chefs blend authentic flavors with modern presentation in an intimate setting.",
    schedules: [
      { meal: "Lunch", time: "12:30 - 15:00" },
      { meal: "Dinner", time: "19:00 - 22:30" }
    ]
  },
  {
    title: "Sunset Edge Bar",
    image: "https://images.unsplash.com/photo-1764687274813-82d3f6e422d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaGZyb250JTIwYmFyJTIwY29ja3RhaWwlMjBzdW5zZXR8ZW58MXx8fHwxNzgwMDMwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "The ultimate vantage point for the Maldives' legendary sunsets. Sip on handcrafted signature cocktails, enjoy premium shisha, and relax to the soothing rhythms of our resident DJ.",
    schedules: [
      { meal: "All Day Dining", time: "10:00 - 00:00" }
    ]
  }
];

const VILLAS_DATA = [
  {
    title: "Beach Villas",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHZpbGxhJTIwbWFsZGl2ZXN8ZW58MXx8fHwxNzc5OTUwOTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Experience barefoot luxury set along pristine white sands and turquoise lagoons. Designed with tropical elegance and modern comfort for a relaxing island escape.",
    size: "135 sqm",
    capacity: "3 Adults or 2 Adults + 1 Child",
    bed: "1 King Bed / Twin Beds",
    features: ["Direct beach access", "Private terraces", "Ocean views", "Indoor & outdoor shower"]
  },
  {
    title: "Deluxe Beach Villas",
    image: "https://images.unsplash.com/photo-1582719478250-c89af14eb366?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGludGVyaW9yfGVufDF8fHx8MTc3OTk1MDkyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Upgrade your island retreat with spacious contemporary interiors. Wake up to gentle ocean breezes and unwind with uninterrupted lagoon views.",
    size: "165 sqm",
    capacity: "3 Adults or 2 Adults + 2 Children",
    bed: "1 King Bed / Twin Beds",
    features: ["Steps from water", "Enhanced privacy", "Outdoor lounging", "Espresso machine"]
  },
  {
    title: "Jacuzzi Beach Villas",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwamFjdXp6aXxlbnwxfHx8fDE3Nzk5NTA5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Indulge in ultimate relaxation under the stars. Beachfront living meets private comfort, creating an intimate and secluded Maldives getaway.",
    size: "165 sqm",
    capacity: "3 Adults or 2 Adults + 2 Children",
    bed: "1 King Bed",
    features: ["Outdoor Jacuzzi", "Spa-style comfort", "Stylish interiors", "Direct beach access"]
  },
  {
    title: "Sunset Deluxe Beach Villas",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBiZWFjaHxlbnwxfHx8fDE3Nzk5NTA5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "End your days watching breathtaking Maldivian sunsets right from your private terrace. A perfectly positioned sanctuary for evening relaxation.",
    size: "165 sqm",
    capacity: "3 Adults or 2 Adults + 2 Children",
    bed: "1 King Bed",
    features: ["Uninterrupted sunset views", "Prime west-facing location", "Premium amenities", "Outdoor daybed"]
  },
  {
    title: "Two-Bedroom Family Beach Villa",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjByZXNvcnR8ZW58MXx8fHwxNzc5OTUwOTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Designed with family bonding in mind, these spacious villas offer shared living areas while maintaining privacy for parents and children alike.",
    size: "200 sqm",
    capacity: "4 Adults + 2 Children",
    bed: "1 King Bed & 2 Twin Beds",
    features: ["Interconnecting rooms", "Child-friendly spaces", "Shared living area", "Multiple bathrooms"]
  },
  {
    title: "Two-Bedroom Deluxe Family Beach Villa",
    image: "https://images.unsplash.com/photo-1618773928120-2942445d4750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBhbnNpdmUlMjB2aWxsYXxlbnwxfHx8fDE3Nzk5NTA5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Elevate your family vacation with expansive interiors, upgraded amenities, and extra space to comfortably accommodate larger groups by the sea.",
    size: "230 sqm",
    capacity: "4 Adults + 2 Children",
    bed: "1 King Bed & 2 Twin Beds",
    features: ["Expansive layout", "Upgraded privacy", "Premium beachfront", "Large outdoor terrace"]
  },
  {
    title: "Honeymoon Suite",
    image: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGJlZHxlbnwxfHx8fDE3Nzk5NTA5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Celebrate your love in a secluded sanctuary designed purely for romance, offering intimate privacy and unforgettable moments.",
    size: "180 sqm",
    capacity: "2 Adults",
    bed: "1 King Bed",
    features: ["Romantic room setup", "Exclusive seclusion", "Tailored services", "Champagne on arrival"]
  },
  {
    title: "Meedhupparu Residence with Pool",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwcG9vbHxlbnwxfHx8fDE3Nzk5NTA5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "The pinnacle of island luxury. Step straight from your bedroom into your private pool, backed by unmatched personalized service.",
    size: "300 sqm",
    capacity: "4 Adults",
    bed: "2 King Beds",
    features: ["Private plunge pool", "Expansive wooden deck", "VIP personalized service", "Dedicated butler"]
  },
  {
    title: "Prestige Water Villa",
    image: "https://images.unsplash.com/photo-1439130490301-25e322d88054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdmVyd2F0ZXIlMjBidW5nYWxvd3xlbnwxfHx8fDE3Nzk5NTA5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Suspended over the turquoise lagoon, offering direct access to the vibrant coral reefs below. The quintessential Maldivian overwater experience.",
    size: "150 sqm",
    capacity: "2 Adults",
    bed: "1 King Bed",
    features: ["Overwater location", "Glass floor panels", "Direct ocean access", "Overwater hammock"]
  }
];

export function ResortPackage() {
  const { resortId } = useParams();
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Inquiry data:", data);
    toast.success("Inquiry sent successfully! Our team will contact you soon.");
    setIsSubmitting(false);
    reset();
  };

  // Fallback info rendering for now
  const data = resortInfo;

  return (
    <div className="w-full bg-[#f8fbff] flex flex-col font-poppins min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/80 via-[#041d3c]/40 to-transparent z-10" />
        <ImageWithFallback 
          src={data.heroImage} 
          alt={data.title} 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 text-center px-6 mt-20 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight drop-shadow-lg"
          >
            {data.title}
          </motion.h1>
        </div>
      </section>

      {/* 1.5 Support CTA Overlay */}
      <div className="relative z-30">
        <SupportCTA />
      </div>

      {/* 2. Resort Overview & Info Card */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 pt-32 lg:pt-40 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left: Summary */}
          <div className="flex-1 space-y-6">
            <h2 className="text-[#041d3c] font-bold text-3xl lg:text-[40px] leading-tight">
              Resort Overview
            </h2>
            <div className="w-20 h-1.5 bg-[#041d3c] rounded-full mb-8"></div>
            <p className="text-[#041d3c]/80 text-[16px] lg:text-[18px] leading-[1.8] font-medium">
              {data.summary}
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#eef4fa] p-3 rounded-xl text-[#041d3c]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[#041d3c] font-bold text-[16px]">Location</h4>
                  <p className="text-[#041d3c]/70 text-[14px] font-medium mt-1">{data.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#eef4fa] p-3 rounded-xl text-[#041d3c]">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[#041d3c] font-bold text-[16px]">Transfer Time</h4>
                  <p className="text-[#041d3c]/70 text-[14px] font-medium mt-1">{data.transfer}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info Card */}
          <div className="w-full lg:w-[450px] shrink-0">
            <div className="bg-white rounded-[16px] shadow-[0_20px_60px_rgba(4,29,60,0.15)] overflow-hidden flex flex-col h-full sticky top-32">
              <div className="h-[240px] relative">
                <ImageWithFallback 
                  src={data.heroImage} 
                  alt="Resort Image" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-[#041d3c] font-bold shadow-md">
                  <Star className="w-4 h-4 fill-[#041d3c]" />
                  <span className="text-[14px]">{data.rating}</span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 font-medium text-[14px] uppercase tracking-widest mb-1">Price</p>
                    <h3 className="text-[#041d3c] font-bold text-3xl">{data.price} <span className="text-[16px] font-medium text-gray-500 normal-case tracking-normal">/ night</span></h3>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 font-medium text-[14px] uppercase tracking-widest mb-1">Duration</p>
                    <div className="flex items-center gap-2 text-[#041d3c] font-bold text-[16px]">
                      <Clock className="w-5 h-5" />
                      {data.duration}
                    </div>
                  </div>
                </div>
                
                <hr className="border-[#041d3c]/10" />
                
                <button className="w-full bg-[#041d3c] text-white rounded-[12px] py-4 font-bold text-[16px] hover:bg-[#eef4fa] hover:text-[#041d3c] transition-all duration-300 shadow-md">
                  Book This Resort
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Gallery & Form */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
          {/* Left: Gallery */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-[#041d3c] font-bold text-2xl lg:text-[32px] mb-8">Resort Gallery</h3>
            <div className="grid grid-cols-3 gap-4 flex-grow">
              <div className="col-span-3 rounded-[16px] overflow-hidden shadow-sm h-[260px] lg:h-[280px]">
                <ImageWithFallback src={data.gallery[0]} alt="Gallery 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              {data.gallery.slice(1).map((img, i) => (
                <div key={i} className="col-span-1 rounded-[16px] overflow-hidden shadow-sm h-[140px] lg:h-[150px]">
                  <ImageWithFallback src={img} alt={`Gallery ${i + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Inquire Form */}
          <div id="inquire-form" className="w-full lg:w-[480px] shrink-0 flex flex-col mt-14 lg:mt-0 scroll-mt-32">
            <div className="bg-white rounded-[16px] shadow-[0_20px_60px_rgba(4,29,60,0.15)] p-8 flex-grow flex flex-col justify-center border border-[#041d3c]/10">
              <h3 className="text-[#041d3c] font-bold text-2xl mb-6 text-center">Inquire Now</h3>
              
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="FIRST NAME *" 
                      {...register("firstName", { required: true })}
                      className={`w-full bg-white border ${errors.firstName ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-[4px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#041d3c] transition-colors placeholder:text-gray-400`} 
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="SURNAME *" 
                      {...register("surname", { required: true })}
                      className={`w-full bg-white border ${errors.surname ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-[4px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#041d3c] transition-colors placeholder:text-gray-400`} 
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div>
                  <input 
                    type="email" 
                    placeholder="EMAIL *" 
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-[4px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#041d3c] transition-colors placeholder:text-gray-400`} 
                  />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select 
                      defaultValue="" 
                      {...register("nationality", { required: true })}
                      className={`w-full appearance-none bg-white border ${errors.nationality ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-[4px] px-4 py-3 text-gray-500 font-medium text-[13px] focus:outline-none focus:border-[#041d3c] transition-colors cursor-pointer`}
                    >
                      <option value="" disabled>NATIONALITY *</option>
                      <option value="us">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="au">Australia</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="PHONE (+CODE)" 
                    {...register("phone")}
                    className="w-full bg-white border border-[#e2e8f0] rounded-[4px] px-4 py-3 text-[#041d3c] font-medium text-[12px] focus:outline-none focus:border-[#041d3c] transition-colors placeholder:text-gray-400" 
                  />
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="CHECK-IN" 
                      {...register("checkIn")}
                      onFocus={(e) => { e.target.type = 'date'; try { e.target.showPicker(); } catch(err){} }} 
                      onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                      className="w-full bg-white border border-[#e2e8f0] rounded-[4px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#041d3c] transition-colors placeholder:text-gray-400 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="CHECK-OUT" 
                      {...register("checkOut")}
                      onFocus={(e) => { e.target.type = 'date'; try { e.target.showPicker(); } catch(err){} }} 
                      onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                      className="w-full bg-white border border-[#e2e8f0] rounded-[4px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#041d3c] transition-colors placeholder:text-gray-400 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Row 5 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f8fbff] rounded-[4px] px-4 py-3 flex items-center col-span-2 border border-[#041d3c]/10">
                    <span className="text-[#041d3c] font-medium text-[14px] truncate">{data.title}</span>
                    <input type="hidden" value={data.title} {...register("resort")} />
                  </div>
                </div>

                {/* Row 6 */}
                <div>
                  <div className="relative">
                    <select 
                      defaultValue="" 
                      {...register("roomType")}
                      className="w-full appearance-none bg-white border border-[#e2e8f0] rounded-[4px] px-4 py-3 text-gray-500 font-medium text-[13px] focus:outline-none focus:border-[#041d3c] transition-colors cursor-pointer"
                    >
                      <option value="" disabled>ROOM TYPE</option>
                      <option value="beach">Beach Villas</option>
                      <option value="water">Prestige Water Villa</option>
                      <option value="family">Family Beach Villa</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Row 7 */}
                <div>
                  <textarea 
                    placeholder="ANY OTHER DETAILS..." 
                    rows={4} 
                    {...register("details")}
                    className="w-full bg-white border border-[#e2e8f0] rounded-[4px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#041d3c] transition-colors placeholder:text-gray-400 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex justify-center">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 bg-[#041d3c] hover:bg-[#021124] disabled:bg-[#041d3c]/70 text-white font-bold text-[13px] tracking-wider uppercase px-12 py-4 rounded-[12px] transition-all duration-300 shadow-md w-full"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "REQUEST A QUOTE"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tabs Section */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 pb-24">
        {/* Tab Header */}
        <div className="flex flex-wrap lg:flex-nowrap bg-white rounded-[16px] shadow-[0_10px_30px_rgba(4,29,60,0.05)] p-2 mb-10 border border-[#041d3c]/10">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 rounded-[12px] text-[15px] font-bold transition-all duration-300 relative ${
                  isActive ? 'text-[#041d3c]' : 'text-[#041d3c]/70 hover:text-[#041d3c] hover:bg-[#eef4fa]'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabBg" 
                    className="absolute inset-0 bg-[#eef4fa] rounded-[12px] border border-[#041d3c]/10 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-[16px] shadow-[0_20px_60px_rgba(4,29,60,0.15)] p-8 lg:p-12 min-h-[500px] border border-[#041d3c]/10 overflow-hidden">
          <AnimatePresence mode="wait">
            
            {activeTab === 'villas' && (
              <motion.div
                key="villas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col space-y-0"
              >
                {VILLAS_DATA.map((villa, idx) => (
                  <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 border-b border-[#041d3c]/10 first:pt-0 last:border-0 last:pb-0">
                    
                    {/* Left: Image */}
                    <div className="lg:col-span-4 overflow-hidden rounded-[16px] shadow-sm self-start">
                      <ImageWithFallback 
                        src={villa.image} 
                        alt={villa.title} 
                        className="w-full aspect-[4/3] object-cover hover:scale-[1.05] transition-transform duration-700" 
                      />
                    </div>

                    {/* Right: Content */}
                    <div className="lg:col-span-8 flex flex-col justify-between py-2">
                      <div>
                        <h4 className="text-[#041d3c] text-2xl font-bold mb-3">{villa.title}</h4>
                        <p className="text-[#041d3c]/70 text-[15px] mb-6 leading-relaxed font-medium">
                          {villa.description}
                        </p>
                        
                        {/* Elegant Stats Row */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6 bg-[#eef4fa]/50 py-3 px-5 rounded-[12px] border border-[#041d3c]/5 w-fit">
                          <div className="flex items-center gap-2 text-[#041d3c] text-[13px] font-bold tracking-wide uppercase">
                            <Maximize className="w-4 h-4 opacity-70" /> 
                            {villa.size}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-[#041d3c]/20 hidden sm:block"></div>
                          <div className="flex items-center gap-2 text-[#041d3c] text-[13px] font-bold tracking-wide uppercase">
                            <Users className="w-4 h-4 opacity-70" /> 
                            {villa.capacity}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-[#041d3c]/20 hidden sm:block"></div>
                          <div className="flex items-center gap-2 text-[#041d3c] text-[13px] font-bold tracking-wide uppercase">
                            <BedDouble className="w-4 h-4 opacity-70" /> 
                            {villa.bed}
                          </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 mb-8">
                          {villa.features.map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-3">
                              <CheckCircle2 className="w-4 h-4 text-[#041d3c] shrink-0" />
                              <span className="text-[#041d3c]/80 text-[14px] font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#041d3c]/5">
                        <button 
                          onClick={() => document.getElementById('inquire-form')?.scrollIntoView({ behavior: 'smooth' })}
                          className="flex w-full items-center justify-center gap-2 px-8 py-3.5 bg-[#041d3c] text-white rounded-[12px] font-bold text-[14px] hover:bg-[#021124] transition-all duration-300 shadow-md"
                        >
                          Book Now
                        </button>
                        <a 
                          href="https://wa.me/358408192758"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white rounded-[12px] font-bold text-[14px] hover:shadow-lg transition-all duration-300 group overflow-hidden relative"
                        >
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
                          <span className="relative z-10">WhatsApp Us</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'restaurants' && (
              <motion.div
                key="restaurants"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col"
              >
                {RESTAURANTS_DATA.map((restaurant, idx) => (
                  <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 border-b border-[#041d3c]/10 first:pt-0 last:border-0 last:pb-0">
                    
                    {/* Left: Image */}
                    <div className="lg:col-span-4 overflow-hidden rounded-[16px] shadow-sm self-start">
                      <ImageWithFallback 
                        src={restaurant.image} 
                        alt={restaurant.title} 
                        className="w-full aspect-[4/3] object-cover hover:scale-[1.05] transition-transform duration-700" 
                      />
                    </div>

                    {/* Right: Content */}
                    <div className="lg:col-span-8 flex flex-col py-2">
                      <h4 className="text-[#041d3c] text-2xl font-bold mb-3">{restaurant.title}</h4>
                      <p className="text-[#041d3c]/70 text-[15px] mb-6 leading-relaxed font-medium">
                        {restaurant.description}
                      </p>
                      
                      {/* Schedules List */}
                      <div className="flex flex-col w-full max-w-sm gap-3 mt-2">
                        {restaurant.schedules.map((schedule, sIdx) => (
                          <div key={sIdx} className="flex items-center w-full">
                            <span className="text-[#041d3c] text-[13px] font-bold tracking-wide uppercase w-[120px] shrink-0">
                              {schedule.meal}
                            </span>
                            <div className="flex-1 border-b-[2px] border-dotted border-[#041d3c]/20 mx-4 opacity-70"></div>
                            <span className="text-[#041d3c]/80 text-[14px] font-semibold whitespace-nowrap shrink-0">
                              {schedule.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'facilities' && (
              <motion.div
                key="facilities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-[#041d3c] font-bold text-2xl mb-6">Resort Facilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["Award-winning Overwater Spa", "PADI Certified Dive Centre", "Water Sports Hub", "Kids' Club & Play Area", "Infinity Pool", "Fully Equipped Fitness Centre"].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-[#041d3c] shrink-0 mt-0.5" />
                      <p className="text-[#041d3c]/80 font-medium text-[15px] leading-[1.6]">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'fact-sheet' && (
              <motion.div
                key="fact-sheet"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-[#041d3c] font-bold text-2xl mb-6">FACT Sheet</h3>
                <p className="text-[#041d3c]/80 font-medium text-[15px] leading-[1.8] mb-4">
                  Download or view our comprehensive resort fact sheet for detailed information on villa dimensions, dining hours, and full amenities list.
                </p>
                <button className="bg-[#eef4fa] text-[#041d3c] font-bold px-6 py-3 rounded-[12px] border border-[#041d3c]/10 hover:bg-[#041d3c] hover:text-white transition-colors">
                  Download FACT Sheet (PDF)
                </button>
              </motion.div>
            )}

            {activeTab === 'deals' && (
              <motion.div
                key="deals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-[#041d3c] font-bold text-2xl mb-6">Deals & Offers</h3>
                <div className="bg-[#eef4fa] border border-[#041d3c]/10 p-6 rounded-[12px]">
                  <h4 className="text-[#041d3c] font-bold text-lg mb-2">Early Bird Special</h4>
                  <p className="text-[#041d3c]/80 font-medium text-[14px]">
                    Book 90 days in advance and receive a complimentary room upgrade (subject to availability) and a 30-minute couples massage.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* 5. Reviews Section */}
      <div className="pb-12 bg-white">
        <ReviewsSection />
      </div>

    </div>
  );
}