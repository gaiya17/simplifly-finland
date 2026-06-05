'use client';

import { useState } from 'react';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '../../components/shared/ImageWithFallback';
import { BlogPostData, Category, categoryColors } from '../../lib/blogApi';

const categories: Category[] = ['All', 'Destinations', 'Travel Tips', 'Guides', 'Food', 'Experiences'];

function BlogCard({ post }: { post: BlogPostData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(4,29,60,0.05)] hover:shadow-[0_16px_48px_rgba(4,29,60,0.10)] hover:-translate-y-1.5 transition-all duration-400 ease-out group cursor-pointer h-full"
    >
      {/* Image */}
      <div className="relative h-[220px] w-full shrink-0 overflow-hidden">
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 pointer-events-none" />

        {/* Date badge */}
        <div className="absolute top-4 right-4 bg-white/85 backdrop-blur-md border border-white/30 rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 shadow-sm z-10">
          <Calendar className="w-3 h-3 text-[#1a84ff]" />
          <span className="text-[#041d3c] font-black text-[10px] uppercase tracking-wider">
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow text-left">
        {/* Category + read time */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className={`text-[10.5px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-[6px] border ${categoryColors[post.category]}`}>
            {post.category}
          </span>
          <span className="w-1 h-1 bg-gray-200 rounded-full" />
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400 text-[11px] font-extrabold uppercase tracking-wide">{post.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[#041d3c] font-black text-[18px] sm:text-[20px] leading-[1.35] line-clamp-2 mb-3">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-500 text-[14px] font-normal leading-[1.75] line-clamp-3 mb-5 flex-1">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="h-[1px] bg-[#041d3c]/5 w-full mb-4" />
        <div className="flex items-center justify-between">
          <span className="text-[#041d3c] font-extrabold text-[12px] uppercase tracking-wider group-hover:text-[#1a84ff] transition-colors duration-300 flex items-center gap-1.5">
            Read Article
            <ArrowRight className="w-3.5 h-3.5 text-[#1a84ff] group-hover:translate-x-1.5 transition-transform duration-300" />
          </span>
          {/* Author avatar */}
          <ImageWithFallback
            src={post.authorAvatar}
            alt={post.author}
            className="w-7 h-7 rounded-full object-cover border border-[#041d3c]/10"
          />
        </div>
      </div>
    </Link>
  );
}

export function BlogPageClient({ initialPosts }: { initialPosts: BlogPostData[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const allBlogPosts = initialPosts;

  const featured = allBlogPosts.find((p) => p.featured);
  const filtered =
    activeCategory === 'All'
      ? allBlogPosts.filter((p) => !p.featured)
      : allBlogPosts.filter((p) => p.category === activeCategory && !p.featured);
  const featuredVisible = featured && (activeCategory === 'All' || activeCategory === featured.category);

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">

      {/* ── HERO ── */}
      <section className="relative w-full h-[60vh] min-h-[480px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/bloghero.webp"
            alt="Blog Hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/92 via-[#041d3c]/60 to-[#041d3c]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/70 via-transparent to-[#041d3c]/20" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 pt-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <BookOpen className="w-3 h-3" />
            <span>INSIGHTS &amp; STORIES</span>
          </div>
          <h1 className="text-white font-black text-2xl sm:text-3xl lg:text-[42px] leading-tight  drop-shadow-lg mb-4">
            Our Journal
          </h1>
          <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-5" />
          <p className="text-white/70 text-[15px] sm:text-[16px] lg:text-lg font-medium max-w-xl leading-relaxed">
            Stories, guides, and inspiration to fuel your next extraordinary journey across Sri Lanka and the Maldives.
          </p>
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      {featuredVisible && (
        <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 pt-[80px] lg:pt-[100px]">
          <div className="flex flex-col items-start mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
              <span>✦ FEATURED POST</span>
            </div>
          </div>

          <Link
            href={`/blog/${featured.slug}`}
            className="group cursor-pointer bg-white rounded-[28px] overflow-hidden shadow-[0_8px_40px_rgba(4,29,60,0.07)] hover:shadow-[0_24px_70px_rgba(4,29,60,0.12)] hover:-translate-y-1 transition-all duration-500 block"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-[300px] lg:h-auto overflow-hidden">
                <ImageWithFallback
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#041d3c]/10" />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <span className={`text-[10.5px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-[6px] border ${categoryColors[featured.category]}`}>
                    {featured.category}
                  </span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-400 text-[12px] font-semibold">
                      {featured.createdAt ? new Date(featured.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <span className="w-1 h-1 bg-gray-200 rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-400 text-[12px] font-semibold">{featured.readTime}</span>
                  </div>
                </div>

                <h2 className="text-[#041d3c] font-black text-[26px] lg:text-[32px] leading-tight  mb-4">
                  {featured.title}
                </h2>
                <p className="text-gray-500 text-[15px] leading-[1.8] font-normal mb-6">
                  {featured.excerpt}
                </p>

                {/* Author row */}
                <div className="flex items-center gap-3 mb-8">
                  <ImageWithFallback
                    src={featured.authorAvatar}
                    alt={featured.author}
                    className="w-9 h-9 rounded-full object-cover border border-[#041d3c]/10"
                  />
                  <div>
                    <p className="text-[#041d3c] font-bold text-[13px]">{featured.author}</p>
                    <p className="text-gray-400 text-[11px] font-semibold">{featured.authorRole}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-[#041d3c] font-extrabold text-[13px] uppercase tracking-wider group-hover:text-[#1a84ff] transition-colors duration-300">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 text-[#1a84ff] group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── FILTER + GRID ── */}
      <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-[80px] lg:py-[100px]">

        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
            <span>✦ ALL ARTICLES</span>
          </div>
          <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
            Browse Our Posts
          </h2>
          <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5" />
          <p className="text-gray-500 text-[16px] lg:text-lg font-medium max-w-xl leading-relaxed">
            Filter by topic and discover the stories that matter to your journey.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-[12px] text-[12.5px] font-extrabold uppercase tracking-wider transition-all duration-300 ${activeCategory === cat
                  ? 'bg-[#041d3c] text-white shadow-[0_8px_24px_rgba(4,29,60,0.18)] -translate-y-0.5'
                  : 'bg-white text-gray-500 border border-[#041d3c]/8 hover:border-[#041d3c]/20 hover:text-[#041d3c] hover:-translate-y-0.5 shadow-[0_2px_10px_rgba(4,29,60,0.04)]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1a84ff]/8 border border-[#1a84ff]/10 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-[#1a84ff]/50" />
            </div>
            <p className="text-gray-400 text-[15px] font-semibold">No posts in this category yet.</p>
          </div>
        )}
      </section>

    </div>
  );
}
