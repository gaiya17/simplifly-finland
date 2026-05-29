import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const allPosts = [
  {
    id: 1,
    title: "10 Must-Visit Hidden Gems in Sri Lanka",
    excerpt: "Discover the untouched beauty of Sri Lanka's lesser-known destinations, from secluded beaches to misty mountain towns.",
    category: "Destinations",
    date: "Oct 15, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1672289945029-817528cf089b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRyYXZlbHxlbnwxfHx8fDE3Nzk4MjEyMDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    title: "The Ultimate Guide to Maldives Luxury Resorts",
    excerpt: "Everything you need to know about choosing the perfect overwater villa for your dream Maldivian getaway.",
    category: "Travel Tips",
    date: "Oct 12, 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1662792721650-545a15f07ff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHJlc29ydCUyMG92ZXJ3YXRlcnxlbnwxfHx8fDE3Nzk4MjEyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    title: "Essential Packing List for Tropical Vacations",
    excerpt: "Travel smart with our comprehensive packing guide tailored specifically for Sri Lanka and the Maldives.",
    category: "Guides",
    date: "Oct 08, 2023",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1779364815233-84ec09c6d6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBwYWNraW5nJTIwbHVnZ2FnZXxlbnwxfHx8fDE3Nzk4MjEyMTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    title: "Culinary Journey: Top 5 Sri Lankan Dishes",
    excerpt: "A deep dive into the rich, spicy, and unforgettable flavors of authentic Sri Lankan cuisine.",
    category: "Food",
    date: "Sep 28, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1626804475297-41609ea2b4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGZvb2R8ZW58MXx8fHwxNzc5OTA0MTU0fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 5,
    title: "When to Visit the Maldives: A Seasonal Guide",
    excerpt: "Navigate the monsoon seasons and find the absolute perfect time of year for your luxury island retreat.",
    category: "Guides",
    date: "Sep 20, 2023",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMG9jZWFufGVufDF8fHx8MTc3OTkwNDE4Mnww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 6,
    title: "Scenic Train Rides: The Ella Odyssey",
    excerpt: "Experience one of the world's most beautiful train journeys through the lush tea plantations of Sri Lanka.",
    category: "Experiences",
    date: "Sep 15, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRyYWluJTIwam91cm5leXxlbnwxfHx8fDE3Nzk5MDQwOTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export function BlogPage() {
  return (
    <div className="w-full bg-[#f8fbff] flex flex-col">
      
      {/* Mini Hero */}
      <section className="relative w-full h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#041d3c] pt-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        <div className="relative z-20 text-center px-6 mt-10">
          <h1 className="text-white text-5xl md:text-6xl font-bold uppercase tracking-wide mb-4">Our Journal</h1>
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Stories, guides, and inspiration for the modern traveler.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 py-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-[16px] shadow-[0_12px_40px_rgba(4,29,60,0.08)] overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-2 transition-transform duration-300 ease-out"
            >
              {/* Image Container */}
              <div className="relative w-full h-[260px] overflow-hidden">
                <ImageWithFallback 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1 text-left items-start">
                {/* Meta */}
                <div className="flex items-center justify-start gap-4 mb-5 w-full">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#041d3c] bg-[#f4f7fb] px-3.5 py-1.5 rounded-full transition-colors group-hover:bg-[#041d3c] group-hover:text-white">
                    {post.category}
                  </span>
                  <span className="text-[#041d3c]/60 text-[13px] flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                </div>

                {/* Title & Excerpt */}
                <h3 className="text-[#041d3c] text-[20px] lg:text-[22px] font-bold leading-snug mb-3 group-hover:text-blue-900 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[#041d3c]/70 text-[15px] leading-relaxed line-clamp-2 mb-8 font-medium">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5 w-full">
                  <span className="text-[#041d3c]/60 text-[13px] flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                  <span className="text-[#041d3c] font-bold text-[14px] flex items-center gap-1.5 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}