"use client";
import { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { blogApi, BlogPostData } from '../../lib/blogApi';
import { useTranslation } from '../../lib/i18n/LanguageContext';

export function BlogSection({ blogs = [] }: { blogs?: any[] }) {
  const { t } = useTranslation();

  return (
    <section className="bg-transparent w-full py-[100px] lg:py-[120px] relative font-poppins overflow-hidden">
      {/* Decorative Brand Ambient Glowing Backgrounds */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(4,29,60,0.02)_0%,_transparent_70%)] pointer-events-none z-0" />
      
      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
        
        {/* Centered Modern Section Header matching global homepage theme */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-3.5 shadow-sm border border-[#1a84ff]/10">
            <span>{t.blog.badge}</span>
          </div>
          <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight mb-4  uppercase">
            {t.blog.title}
          </h2>
          <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5"></div>
          <p className="text-gray-600 text-[15px] lg:text-[16px] font-medium max-w-3xl leading-relaxed">
            {t.blog.subtitle}
          </p>
        </div>

        {/* Blog Grid (Responsive 3-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {blogs.map((post) => (
            <Link
              key={post.id}
             href={`/blog/${post.slug}`}
              className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(4,29,60,0.03)] hover:shadow-[0_24px_60px_rgba(26,132,255,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out h-full group cursor-pointer"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-[#f4f7fb]">
                <ImageWithFallback 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out" 
                />
                
                {/* Glossy Overlay inside Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-65 pointer-events-none" />

                {/* Floating Date Badge */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md border border-white/30 rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] z-10">
                  <Calendar className="w-3.5 h-3.5 text-[#1a84ff]" />
                  <span className="text-[#041d3c] font-black text-[10px] uppercase tracking-wider">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>

              {/* Content Wrapper */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow text-left">
                
                {/* Category & Read Time block */}
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="text-[#1a84ff] font-extrabold text-[10.5px] uppercase tracking-widest block">
                    {post.category}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400 font-extrabold text-[10px] uppercase tracking-wider block mt-0.5">
                      {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[#041d3c] font-extrabold text-[19px] sm:text-[21px] leading-[1.3] line-clamp-2 mb-3 min-h-[54px]">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-500 text-[14px] font-medium leading-relaxed line-clamp-3 mb-6">
                  {post.excerpt}
                </p>

                {/* Elegant Separator Line */}
                <div className="h-[1px] bg-[#041d3c]/5 w-full mb-5 mt-auto" />

                {/* Read More Action */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-[#041d3c] font-extrabold text-[12px] tracking-wider uppercase group-hover:text-[#1a84ff] transition-colors duration-300 flex items-center gap-1.5 shrink-0">
                    <span>{t.blog.readArticle}</span>
                    <ArrowRight className="w-4 h-4 text-[#1a84ff] group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Blogs Link Button */}
        <div className="flex justify-center mt-16">
          <Link 
           href="/blog" 
            className="inline-flex items-center justify-center gap-2 bg-[#041d3c] hover:bg-[#1a84ff] text-white font-extrabold px-10 py-4.5 rounded-[16px] shadow-[0_10px_30px_rgba(4,29,60,0.12)] hover:shadow-[0_16px_36px_rgba(26,132,255,0.25)] hover:-translate-y-1 transition-all duration-300 text-[15px] uppercase tracking-wider group w-full md:w-auto text-center"
          >
            <span>{t.blog.viewAll}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
