'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  ArrowRight,
  BookOpen,
  Share2,
  Bookmark,
  Check,
  ChevronUp,
  MessageCircle,
} from 'lucide-react';
import { blogApi, BlogPostData, ContentBlock, categoryColors } from '../../../lib/blogApi';
import { ImageWithFallback } from '../../../components/shared/ImageWithFallback';

/* ─────────────────────────────────────────────────────────
   Reading-progress bar (top of viewport)
───────────────────────────────────────────────────────── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[999] h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#1a84ff] to-[#D4AF37] transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Content block renderer
───────────────────────────────────────────────────────── */
function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-[#374151] text-[17px] leading-[1.9] font-normal mb-7">
          {block.text}
        </p>
      );

    case 'heading':
      return (
        <h2 className="text-[#041d3c] font-black text-[22px] sm:text-[26px] leading-tight  mt-12 mb-5 flex items-start gap-3">
          <span className="mt-1 shrink-0 w-[5px] h-[28px] bg-gradient-to-b from-[#1a84ff] to-[#D4AF37] rounded-full" />
          {block.text}
        </h2>
      );

    case 'quote':
      return (
        <blockquote className="my-10 relative pl-8 border-l-[4px] border-[#1a84ff] bg-gradient-to-r from-[#1a84ff]/5 to-transparent rounded-r-[16px] py-6 pr-6">
          <div className="absolute top-4 left-6 text-[#1a84ff]/20 font-serif text-[72px] leading-none select-none">&ldquo;</div>
          <p className="text-[#041d3c] text-[17px] italic font-semibold leading-[1.8] relative z-10">
            {block.text}
          </p>
        </blockquote>
      );

    case 'tip':
      return (
        <div className="my-8 flex gap-4 bg-gradient-to-r from-[#D4AF37]/8 via-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-[16px] p-6">
          <div className="shrink-0 w-9 h-9 rounded-[10px] bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center text-[#b8922a]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-[#7a5f1a] text-[15px] leading-[1.75] font-semibold">{block.text}</p>
        </div>
      );

    case 'list':
      return (
        <ul className="my-6 space-y-3 pl-1">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#374151] text-[16px] leading-[1.75]">
              <span className="mt-[6px] shrink-0 w-2 h-2 rounded-full bg-[#1a84ff]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'image':
      return (
        <div className="my-8 rounded-[16px] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
          <ImageWithFallback src={block.url || block.text || ''} alt={block.caption || 'Blog Image'} className="w-full h-auto object-cover max-h-[600px]" />
          {block.caption && <p className="text-center text-[13px] text-gray-500 my-3 italic px-4">{block.caption}</p>}
        </div>
      );

    default:
      return null;
  }
}

/* ─────────────────────────────────────────────────────────
   Table of Contents
───────────────────────────────────────────────────────── */
function TableOfContents({ blocks }: { blocks: ContentBlock[] }) {
  const headings = (Array.isArray(blocks) ? blocks : []).filter((b) => b.type === 'heading');
  if (headings.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-[#f0f6ff] to-[#e8f2ff] border border-[#1a84ff]/12 rounded-[20px] p-6 mb-10">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-[8px] bg-[#1a84ff]/10 border border-[#1a84ff]/15 flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5 text-[#1a84ff]" />
        </div>
        <span className="text-[#041d3c] font-extrabold text-[12px] uppercase tracking-widest">Table of Contents</span>
      </div>
      <ol className="space-y-2">
        {headings.map((h, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="shrink-0 mt-[1px] w-5 h-5 rounded-full bg-[#1a84ff]/12 text-[#1a84ff] text-[10px] font-black flex items-center justify-center">
              {i + 1}
            </span>
            <span className="text-[#1a84ff] text-[14px] font-semibold leading-[1.5] hover:text-[#041d3c] transition-colors cursor-pointer">
              {h.text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main ArticlePage component
───────────────────────────────────────────────────────── */
export function ArticlePageClient({ initialPost, initialRelated }: { initialPost: BlogPostData, initialRelated: BlogPostData[] }) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const post = initialPost;
  const relatedFinal = initialRelated;

  // Scroll-to-top button visibility
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] font-poppins min-h-screen">
      <ReadingProgress />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative w-full h-[70vh] min-h-[480px] max-h-[680px] overflow-hidden">
        {/* Background image */}
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.03] transition-transform duration-[8000ms] ease-out"
          style={{ transformOrigin: 'center top' }}
        />
        {/* Layered gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c] via-[#041d3c]/55 to-[#041d3c]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/70 via-transparent to-transparent" />



        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-12">
          <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24">
            {/* Category + read time */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className={`inline-flex items-center px-3 py-1 rounded-[8px] border text-[11px] font-extrabold uppercase tracking-widest ${categoryColors[post.category]}`}>
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-white/60 text-[13px] font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1.5 text-white/60 text-[13px] font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-white font-black text-[28px] sm:text-[36px] lg:text-[48px] leading-tight  drop-shadow-lg max-w-4xl mb-6">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={post.authorAvatar}
                alt={post.author}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow-lg"
              />
              <div>
                <p className="text-white font-bold text-[14px] leading-tight">{post.author}</p>
                <p className="text-white/55 text-[12px] font-semibold">{post.authorRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-14 items-start">

          {/* ── ARTICLE BODY ── */}
          <article className="flex-1 min-w-0">
            {/* Excerpt lead */}
            <p className="text-[#374151] text-[17px] leading-[1.9] font-normal mb-10 pb-10 border-b border-[#041d3c]/8">
              {post.excerpt}
            </p>

            {/* Table of Contents */}
            <TableOfContents blocks={post.content} />

            {/* Content blocks */}
            <div>
              {(Array.isArray(post.content) ? post.content : []).map((block, i) => (
                <RenderBlock key={i} block={block} />
              ))}
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-[#041d3c]/8">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                {(Array.isArray(post.tags) ? post.tags : []).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white border border-[#041d3c]/10 rounded-[8px] text-[12px] font-bold text-[#041d3c]/70 uppercase tracking-wider hover:border-[#1a84ff]/30 hover:text-[#1a84ff] transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author card */}
            <div className="mt-12 bg-gradient-to-br from-white to-[#f0f6ff] border border-[#1a84ff]/10 rounded-[24px] p-7 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-[0_8px_30px_rgba(4,29,60,0.05)]">
              <ImageWithFallback
                src={post.authorAvatar}
                alt={post.author}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#1a84ff]/20 shadow-md shrink-0"
              />
              <div className="flex-1">
                <p className="text-[11px] font-extrabold text-[#1a84ff] uppercase tracking-widest mb-1">Written by</p>
                <p className="text-[#041d3c] font-black text-[18px] mb-0.5">{post.author}</p>
                <p className="text-gray-500 text-[14px] font-semibold">{post.authorRole} at Simplifly Finland</p>
              </div>
              <Link
                href="/blog"
                className="shrink-0 flex items-center gap-2 bg-[#041d3c] hover:bg-[#1a84ff] text-white font-bold text-[12px] uppercase tracking-wider px-5 py-2.5 rounded-[12px] transition-colors duration-300"
              >
                More Articles
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>

          {/* ── STICKY SIDEBAR ── */}
          <aside className="hidden lg:flex flex-col gap-6 w-[300px] shrink-0 sticky top-28 self-start">

            {/* Action buttons */}
            <div className="bg-white border border-[#041d3c]/8 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(4,29,60,0.04)]">
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Article Actions</p>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-3 px-4 py-3 bg-[#f0f6ff] hover:bg-[#1a84ff]/12 border border-[#1a84ff]/15 text-[#1a84ff] rounded-[12px] text-[13px] font-bold transition-all duration-200 group"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Share Article
                    </>
                  )}
                </button>
                <button
                  onClick={() => setBookmarked((b) => !b)}
                  className={`flex items-center gap-3 px-4 py-3 border rounded-[12px] text-[13px] font-bold transition-all duration-200 group ${
                    bookmarked
                      ? 'bg-[#D4AF37]/10 border-[#D4AF37]/25 text-[#b8922a]'
                      : 'bg-[#f8fafc] border-[#041d3c]/10 text-gray-600 hover:border-[#D4AF37]/30 hover:text-[#b8922a]'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 transition-transform group-hover:scale-110 ${bookmarked ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
                  {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
                <a
                  href="https://wa.me/94715233845"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-[#075e54]/8 hover:bg-[#075e54]/14 border border-[#075e54]/15 text-[#075e54] rounded-[12px] text-[13px] font-bold transition-all duration-200 group"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Plan This Trip
                </a>
              </div>
            </div>

            {/* Article info */}
            <div className="bg-white border border-[#041d3c]/8 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(4,29,60,0.04)] space-y-4">
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Article Info</p>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#1a84ff] shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Read Time</p>
                  <p className="text-[#041d3c] font-bold text-[14px]">{post.readTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#1a84ff] shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Published</p>
                  <p className="text-[#041d3c] font-bold text-[14px]">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 text-[#1a84ff] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(post.tags) ? post.tags : []).slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-[#f0f6ff] border border-[#1a84ff]/12 rounded-[6px] text-[10px] font-bold text-[#1a84ff] uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-br from-[#041d3c] to-[#062c5b] rounded-[20px] p-5 text-white shadow-[0_8px_30px_rgba(4,29,60,0.15)]">
              <div className="w-9 h-9 rounded-[10px] bg-white/10 border border-white/15 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <p className="font-black text-[15px] mb-1.5">Ready to explore?</p>
              <p className="text-white/65 text-[13px] font-medium leading-relaxed mb-4">
                Talk to our travel experts on WhatsApp and plan your dream trip.
              </p>
              <a
                href="https://wa.me/94715233845"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[13px] py-2.5 rounded-[12px] transition-colors duration-200"
              >
                +94 71 523 3845
              </a>
            </div>
          </aside>
        </div>

        {/* ── RELATED ARTICLES ── */}
        {relatedFinal.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#041d3c]/8">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] tracking-wider uppercase mb-3 border border-[#1a84ff]/10">
                ✦ KEEP READING
              </div>
              <h2 className="text-[#041d3c] font-black text-[28px] sm:text-[34px] leading-tight  mb-2">
                Related Articles
              </h2>
              <div className="w-14 h-1 bg-[#1a84ff] rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {relatedFinal.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(4,29,60,0.05)] hover:shadow-[0_16px_48px_rgba(4,29,60,0.10)] hover:-translate-y-1.5 transition-all duration-400 flex flex-col h-full"
                >
                  <div className="relative h-[200px] overflow-hidden bg-slate-50">
                    <ImageWithFallback
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-[6px] border text-[10px] font-extrabold uppercase tracking-widest ${categoryColors[p.category]}`}>
                      {p.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2.5 text-gray-400 text-[11px] font-semibold">
                      <Clock className="w-3 h-3" />
                      {p.readTime}
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <Calendar className="w-3 h-3" />
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}
                    </div>
                    <h3 className="text-[#041d3c] font-black text-[16px] leading-snug line-clamp-2 mb-3 group-hover:text-[#1a84ff] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-2 flex-1">{p.excerpt}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[#1a84ff] font-bold text-[12px] uppercase tracking-wider">
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Back to all articles */}
            <div className="flex justify-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2.5 bg-[#041d3c] hover:bg-[#1a84ff] text-white font-bold text-[14px] uppercase tracking-wider px-8 py-4 rounded-[16px] shadow-[0_8px_24px_rgba(4,29,60,0.12)] hover:shadow-[0_16px_36px_rgba(26,132,255,0.2)] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4" />
                View All Articles
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* ── SCROLL TO TOP ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#041d3c] text-white shadow-[0_8px_24px_rgba(4,29,60,0.25)] hover:bg-[#1a84ff] hover:shadow-[0_12px_30px_rgba(26,132,255,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}
