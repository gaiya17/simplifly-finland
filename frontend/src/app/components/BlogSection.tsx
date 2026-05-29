import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';

const blogPosts = [
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
  }
];

export function BlogSection() {
  return (
    <section className="bg-transparent py-[100px] w-full overflow-hidden">
      <div className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[48px] leading-tight uppercase tracking-wide mb-5">
            Read our latest blog
          </h2>
          <p className="text-[#041d3c]/80 text-lg max-w-2xl font-normal leading-relaxed">
            Discover our latest stories, tips, and insights to inspire your next extraordinary journey across Sri Lanka and the Maldives.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
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
                <p className="text-[#041d3c]/70 text-[15px] leading-relaxed line-clamp-2 mb-8 font-normal">
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

        {/* View All Button */}
        <div className="flex justify-center mt-16">
          <Link to="/blog" className="px-8 py-3.5 bg-[#041d3c] text-white rounded-[16px] font-medium hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(4,29,60,0.2)] transition-all flex items-center gap-2">
            View all blogs <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}