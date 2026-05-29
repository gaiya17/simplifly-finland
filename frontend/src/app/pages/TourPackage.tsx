import { useState } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Star, Users, CheckCircle2, Send, Calendar, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { SupportCTA } from '../components/SupportCTA';
import { ReviewsSection } from '../components/ReviewsSection';

// --- DUMMY DATA FOR THE PACKAGE ---
const packageInfo = {
  title: "Grand Sri Lanka Explorer",
  heroImage: "https://images.unsplash.com/photo-1594805938839-c581da5d8129?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGx1eHVyeSUyMGhvdGVsJTIwdHJvcGljYWx8ZW58MXx8fHwxNzc5OTE0MDgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  duration: "10 Days / 9 Nights",
  price: "$2,200",
  summary: "Embark on an unforgettable journey across the island, from ancient ruins to pristine southern coastlines. This perfectly curated 10-day tour blends the cultural depth of the cultural triangle, the scenic beauty of the tea country, thrilling wildlife safaris in the south, and ultimate relaxation on golden beaches. Tailored for those who seek a premium, immersive experience with the utmost comfort.",
  locations: "Colombo, Kandy, Nuwara Eliya, Ella, Yala, Mirissa",
  groupSize: "2 - 8 People",
  rating: "4.9/5 (124 Reviews)",
  gallery: [
    "https://images.unsplash.com/photo-1612862862126-865765df2ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWdpcml5YSUyMHJvY2slMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3Nzk5NDU4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRyYWluJTIwZWxsYXxlbnwxfHx8fDE3Nzk5NDU4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1566708627877-859df13ae63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWxhJTIwc2FmYXJpJTIwbGVvcGFyZHxlbnwxfHx8fDE3Nzk5NDU4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGJlYWNoJTIwbHV4dXJ5fGVufDF8fHx8MTc3OTk0NTg5MHww&ixlib=rb-4.1.0&q=80&w=1080"
  ],
  itinerary: [
    { day: "01", route: "Airport → Colombo", activity: "Arrival & City Tour", details: "Arrive in Sri Lanka and transfer to Colombo. Evening city tour exploring markets, colonial landmarks, and coastal vibes.", stay: "Colombo (HB)" },
    { day: "02", route: "Colombo → Kitulgala", activity: "White Water Rafting", details: "Travel to Kitulgala, Sri Lanka’s rafting hub. Enjoy an exhilarating white-water rafting session on the Kelani River.", stay: "Kitulgala (HB)" },
    { day: "03", route: "Kitulgala → Kandy", activity: "Cultural Heart & Temple", details: "Journey to Kandy, the cultural capital. Visit the Temple of the Sacred Tooth Relic and enjoy a traditional dance performance.", stay: "Kandy (HB)" },
    { day: "04", route: "Kandy → Nuwara Eliya", activity: "Scenic Highlands", details: "Take a scenic drive to Nuwara Eliya, known as 'Little England'. Explore tea estates, misty hills, and picturesque waterfalls.", stay: "N. Eliya (HB)" },
    { day: "05", route: "Nuwara Eliya → Ella", activity: "Iconic Train Journey", details: "Experience the world-famous train ride to Ella. Wander through lush landscapes and visit the stunning Nine Arch Bridge.", stay: "Ella (BB)" },
    { day: "06", route: "Ella", activity: "Trekking & Exploration", details: "Early morning hike to Little Adam's Peak for panoramic views. Spend the afternoon relaxing at the majestic Ravana Falls.", stay: "Ella (BB)" },
    { day: "07", route: "Ella → Yala", activity: "Leopard Safari", details: "Descend to the plains of Yala. Enjoy an afternoon jeep safari to spot elusive leopards, elephants, and exotic wildlife.", stay: "Yala (HB)" },
    { day: "08", route: "Yala → Mirissa", activity: "Coastal Bliss", details: "Travel along the southern coast to Mirissa. Relax on pristine golden sands or opt for an afternoon surfing session.", stay: "Mirissa (BB)" },
    { day: "09", route: "Mirissa", activity: "Whale Watching & Galle", details: "Early morning boat tour for blue whale watching. Later, explore the historic Galle Fort and its charming cobbled streets.", stay: "Mirissa (BB)" },
    { day: "10", route: "Mirissa → Airport", activity: "Departure", details: "Enjoy a final morning by the ocean before transferring to the airport for your onward journey, filled with lasting memories.", stay: "Departure" },
  ]
};

const TABS = [
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'included', label: "What's Included" },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'cancellation', label: 'Payment & Cancellation' }
];

export function TourPackage() {
  const { packageId } = useParams();
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Inquiry data:", data);
    toast.success("Tour inquiry sent successfully! Our team will contact you soon.");
    setIsSubmitting(false);
    reset();
  };

  // Fallback info rendering for now (in real app, use packageId to fetch data)
  const data = packageInfo;

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

      {/* 2. Tour Summary & Info Card */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 pt-32 lg:pt-40 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left: Summary */}
          <div className="flex-1 space-y-6">
            <h2 className="text-[#041d3c] font-bold text-3xl lg:text-[40px] leading-tight">
              Tour Summary
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
                  <h4 className="text-[#041d3c] font-bold text-[16px]">Destinations</h4>
                  <p className="text-[#041d3c]/70 text-[14px] font-medium mt-1">{data.locations}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#eef4fa] p-3 rounded-xl text-[#041d3c]">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[#041d3c] font-bold text-[16px]">Group Size</h4>
                  <p className="text-[#041d3c]/70 text-[14px] font-medium mt-1">{data.groupSize}</p>
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
                  alt="Tour Image" 
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
                    <h3 className="text-[#041d3c] font-bold text-3xl">{data.price} <span className="text-[16px] font-medium text-gray-500 normal-case tracking-normal">/ person</span></h3>
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
                  Book This Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Gallery & Form */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
          {/* Left: Gallery */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-[#041d3c] font-bold text-2xl lg:text-[32px] mb-8">Tour Gallery</h3>
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

          {/* Right: Form */}
          <div className="w-full lg:w-[450px] shrink-0 flex flex-col mt-14 lg:mt-0">
            <div className="bg-white rounded-[16px] shadow-[0_20px_60px_rgba(4,29,60,0.15)] p-8 flex-grow flex flex-col justify-center">
              <h3 className="text-[#041d3c] font-bold text-2xl mb-2">Inquire Now</h3>
              <p className="text-[#041d3c]/70 text-[14px] font-medium mb-6">Customize this tour to fit your exact needs.</p>
              
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    {...register("name", { required: true })}
                    className={`w-full bg-[#f8fbff] border ${errors.name ? 'border-red-500' : 'border-[#041d3c]/10'} rounded-[12px] px-4 py-3.5 text-[#041d3c] font-medium text-[14px] focus:outline-none focus:border-[#041d3c] transition-colors`} 
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    className={`w-full bg-[#f8fbff] border ${errors.email ? 'border-red-500' : 'border-[#041d3c]/10'} rounded-[12px] px-4 py-3.5 text-[#041d3c] font-medium text-[14px] focus:outline-none focus:border-[#041d3c] transition-colors`} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Phone" 
                    {...register("phone")}
                    className="w-full bg-[#f8fbff] border border-[#041d3c]/10 rounded-[12px] px-4 py-3.5 text-[#041d3c] font-medium text-[14px] focus:outline-none focus:border-[#041d3c] transition-colors" 
                  />
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Date" 
                      {...register("date")}
                      onFocus={(e) => {
                        e.target.type = 'date';
                        try { e.target.showPicker(); } catch (err) {}
                      }} 
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = 'text';
                      }} 
                      className="w-full bg-[#f8fbff] border border-[#041d3c]/10 rounded-[12px] px-4 py-3.5 text-[#041d3c] font-medium text-[14px] focus:outline-none focus:border-[#041d3c] transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                    />
                    <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#041d3c]/50 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <textarea 
                    placeholder="Your Message or Special Requests" 
                    rows={4} 
                    {...register("message")}
                    className="w-full bg-[#f8fbff] border border-[#041d3c]/10 rounded-[12px] px-4 py-3.5 text-[#041d3c] font-medium text-[14px] focus:outline-none focus:border-[#041d3c] transition-colors resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#041d3c] text-white disabled:bg-[#041d3c]/70 rounded-[12px] py-4 font-bold text-[16px] hover:bg-[#eef4fa] hover:text-[#041d3c] transition-all duration-300 shadow-md mt-2 group"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Inquiry"}
                  {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Tabs Section */}
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
        <div className="bg-white rounded-[16px] shadow-[0_20px_60px_rgba(4,29,60,0.15)] p-8 lg:p-12 min-h-[500px] border border-[#041d3c]/10">
          <AnimatePresence mode="wait">
            
            {activeTab === 'itinerary' && (
              <motion.div
                key="itinerary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#026fe6] text-white uppercase text-[13px] tracking-wider font-bold">
                        <th className="py-5 px-4 text-center w-[8%] rounded-tl-[12px]">Day</th>
                        <th className="py-5 px-4 w-[18%]">Route</th>
                        <th className="py-5 px-4 w-[20%]">Activity</th>
                        <th className="py-5 px-4 w-[42%]">Details</th>
                        <th className="py-5 px-4 text-center w-[12%] rounded-tr-[12px]">Stay & Meals</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.itinerary.map((item, index) => (
                        <tr key={index} className="border-b border-[#041d3c]/5 hover:bg-[#f8fbff]/50 transition-colors group">
                          <td className="py-6 px-4 text-center font-bold text-[#041d3c] text-[16px]">
                            {item.day}
                          </td>
                          <td className="py-6 px-4 text-[#041d3c]/80 font-semibold text-[14px]">
                            {item.route}
                          </td>
                          <td className="py-6 px-4 text-[#041d3c] font-bold text-[15px]">
                            {item.activity}
                          </td>
                          <td className="py-6 px-4 text-[#041d3c]/70 font-medium text-[14px] leading-[1.7]">
                            {item.details}
                          </td>
                          <td className="py-6 px-4 text-center text-[#041d3c] font-semibold text-[13px]">
                            <span className="bg-[#eef4fa] text-[#041d3c] py-1.5 px-3 rounded-full group-hover:bg-[#041d3c] group-hover:text-white transition-colors">
                              {item.stay}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'included' && (
              <motion.div
                key="included"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h3 className="text-[#041d3c] font-bold text-2xl mb-6">What's Included in the Tour</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Accommodation in luxury 4/5 star hotels and boutique properties.",
                    "Daily breakfast and dinner (Half Board basis).",
                    "Transportation in an air-conditioned private vehicle.",
                    "Services of a dedicated English-speaking chauffeur-guide.",
                    "Entrance fees to all major attractions mentioned in the itinerary.",
                    "All local taxes, service charges, and highway tolls.",
                    "Welcome meet and greet at the airport.",
                    "Complimentary Wi-Fi in the vehicle."
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-[#041d3c] shrink-0 mt-0.5" />
                      <p className="text-[#041d3c]/80 font-medium text-[15px] leading-[1.6]">{item}</p>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-[#041d3c] font-bold text-xl mt-12 mb-4">Not Included</h3>
                <ul className="list-disc list-inside text-[#041d3c]/70 font-medium text-[15px] space-y-2 ml-4">
                  <li>International flights and visa fees.</li>
                  <li>Lunches and beverages (unless specified).</li>
                  <li>Optional excursions and activities not listed.</li>
                  <li>Tips for guide, driver, and hotel staff.</li>
                </ul>
              </motion.div>
            )}

            {activeTab === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="prose max-w-none"
              >
                <h3 className="text-[#041d3c] font-bold text-2xl mb-6">Terms & Conditions</h3>
                <div className="space-y-6 text-[#041d3c]/80 font-medium text-[15px] leading-[1.8]">
                  <p>
                    <strong>1. Booking & Confirmation:</strong> All bookings are subject to availability. A booking is confirmed only upon receipt of the specified deposit. We reserve the right to decline any booking at our discretion.
                  </p>
                  <p>
                    <strong>2. Passport & Visas:</strong> It is the traveler's responsibility to ensure that their passport is valid for at least 6 months from the date of entry into Sri Lanka. Appropriate tourist visas must be obtained prior to arrival or via ETA.
                  </p>
                  <p>
                    <strong>3. Insurance:</strong> We strongly highly recommend that all travelers purchase comprehensive travel insurance covering trip cancellation, medical emergencies, and baggage loss.
                  </p>
                  <p>
                    <strong>4. Alterations to Itinerary:</strong> While every effort is made to adhere to the planned itinerary, we reserve the right to modify routes, accommodations, or activities due to unforeseen circumstances such as extreme weather, strikes, or road closures, ensuring the alternative is of a similar standard.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'cancellation' && (
              <motion.div
                key="cancellation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="prose max-w-none"
              >
                <h3 className="text-[#041d3c] font-bold text-2xl mb-6">Payment & Cancellation Policy</h3>
                
                <div className="bg-[#eef4fa] p-8 rounded-[12px] mb-8">
                  <h4 className="text-[#041d3c] font-bold text-lg mb-4">Payment Schedule</h4>
                  <ul className="list-disc list-inside text-[#041d3c]/80 font-medium text-[15px] space-y-3">
                    <li>A 30% deposit is required at the time of booking to secure your reservation.</li>
                    <li>The remaining 70% balance must be paid at least 30 days prior to your arrival date.</li>
                    <li>For bookings made within 30 days of arrival, full payment is required immediately.</li>
                  </ul>
                </div>

                <div className="border border-[#041d3c]/10 p-8 rounded-[12px]">
                  <h4 className="text-[#041d3c] font-bold text-lg mb-4">Cancellation Terms</h4>
                  <ul className="space-y-4 text-[#041d3c]/80 font-medium text-[15px]">
                    <li className="flex justify-between items-center border-b border-[#041d3c]/10 pb-3">
                      <span>31 days or more prior to arrival</span>
                      <span className="font-bold text-[#041d3c]">Full Refund (minus processing fees)</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-[#041d3c]/10 pb-3">
                      <span>15 to 30 days prior to arrival</span>
                      <span className="font-bold text-[#041d3c]">50% Cancellation Fee</span>
                    </li>
                    <li className="flex justify-between items-center pb-1">
                      <span>14 days or less / No Shows</span>
                      <span className="font-bold text-[#041d3c]">100% Cancellation Fee (No Refund)</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* 6. Reviews Section */}
      <div className="pb-12 bg-white">
        <ReviewsSection />
      </div>

    </div>
  );
}