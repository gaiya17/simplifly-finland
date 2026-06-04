'use client';

import { useState, useEffect } from "react";
import { Plus, X, Search, FileText, ToggleLeft, ToggleRight, Trash2, Calendar, Eye, Loader2, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { blogApi, BlogPostData } from "../../../lib/blogApi";
import { useRouter } from "next/navigation";

export default function AdminBlogs() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [blogTitle, setBlogTitle] = useState("");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("Simplifly Editor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [blogs, setBlogs] = useState<BlogPostData[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await blogApi.getPosts();
      setBlogs(data);
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string, title: string) => {
    try {
      const nextStatus = currentStatus === "Published" ? "Draft" : "Published";
      await blogApi.updatePost(id, { status: nextStatus });
      toast.success(`'${title}' set to ${nextStatus.toUpperCase()}`);
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteBlog = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete '${title}'?`)) return;
    try {
      await blogApi.deletePost(id);
      toast.success(`Removed '${title}'`);
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle) {
      toast.error("Please enter a blog title");
      return;
    }

    setIsSubmitting(true);
    try {
      const newBlog = await blogApi.createPost({
        title: blogTitle,
        author: blogAuthor,
        excerpt: blogSummary,
        category: "Destinations", // Default category
        readTime: "5 min read",
        image: "",
        authorRole: "Simplifly Writer",
        authorAvatar: "",
        tags: [],
        content: [],
        status: "Draft",
        featured: false,
      });

      toast.success(`Created draft for '${blogTitle}'!`);
      setModalOpen(false);
      setBlogTitle("");
      setBlogSummary("");
      
      // Redirect to the edit page for this new blog
      router.push(`/admin/blogs/${newBlog.id}`);
    } catch (error) {
      toast.error("Failed to create blog draft");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#041d3c] ">Travel Blog Manager</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Publish articles, write travel guides, and verify content drafts</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#041d3c] text-white hover:bg-[#062c5b] text-xs font-bold transition-all shadow-[0_4px_12px_rgba(4,29,60,0.15)] hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Blog Draft
        </button>
      </div>

      {/* Filter and Search */}
      <div className="relative max-w-sm bg-white border border-[#eef2f8] rounded-2xl shadow-[0_8px_30px_rgba(4,29,60,0.01)] p-1.5 flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search articles or authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-[#041d3c]"
        />
      </div>

      {/* Blogs List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-semibold">No blogs found.</div>
        ) : (
          filteredBlogs.map((blog) => (
          <div key={blog.id} className="bg-white border border-[#eef2f8] rounded-2xl p-6 shadow-[0_8px_24px_rgba(4,29,60,0.01)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors group">
            
            <div className="space-y-1.5 md:max-w-2xl">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${
                  blog.status === "Published" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>
                  {blog.status}
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              
              <h3 className="font-extrabold text-md text-[#041d3c] group-hover:text-blue-600 transition-colors leading-snug">
                {blog.title}
              </h3>
              
              <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed">
                {blog.excerpt}
              </p>
              
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                <span>By: <strong className="text-slate-600">{blog.author}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t border-slate-100 md:border-t-0">
              <button
                onClick={() => router.push(`/admin/blogs/${blog.id}`)}
                className="p-2.5 rounded-xl border border-blue-100 bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition-all shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleStatus(blog.id!, blog.status, blog.title)}
                className="flex items-center gap-2 text-xs font-bold transition-all text-left"
              >
                {blog.status === "Published" ? (
                  <>
                    <ToggleRight className="w-9 h-9 text-emerald-500 cursor-pointer" />
                    <span className="text-emerald-600 hidden sm:inline">Active Post</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-9 h-9 text-slate-300 cursor-pointer" />
                    <span className="text-slate-400 hidden sm:inline">Draft Mode</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => deleteBlog(blog.id!, blog.title)}
                className="p-2.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-all shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        )))}
      </div>

      {/* Add Blog Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#eef2f8] shadow-[0_20px_50px_rgba(4,29,60,0.15)] max-w-lg w-full p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#041d3c]">Draft Blog Article</h3>
                <p className="text-[10px] font-semibold text-slate-400">Compose a new travel tip or hotel review</p>
              </div>
            </div>

            <form onSubmit={handleAddBlog} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best local food hotspots in Galle Fort"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-[#041d3c]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Author</label>
                <input
                  type="text"
                  required
                  value={blogAuthor}
                  onChange={(e) => setBlogAuthor(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-[#041d3c]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Short Summary / Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide an engaging snippet of the travel guide..."
                  value={blogSummary}
                  onChange={(e) => setBlogSummary(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-[#041d3c] resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-xs text-slate-700 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#041d3c] text-white hover:bg-[#062c5b] font-bold text-xs rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Draft & Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
