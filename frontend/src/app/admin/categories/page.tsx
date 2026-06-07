'use client';

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2, X, FolderTree, Image as ImageIcon, Waves, MapPin, Heart, Compass, Users, Leaf, Sparkles, Globe, Binoculars, Star, Anchor, Sun } from "lucide-react";
import { toast } from "sonner";
import { tourApi } from "../../../lib/tourApi";
import { resortApi } from "../../../lib/resortApi";

const AVAILABLE_ICONS = [
  { name: 'Waves', icon: Waves },
  { name: 'MapPin', icon: MapPin },
  { name: 'Heart', icon: Heart },
  { name: 'Compass', icon: Compass },
  { name: 'Users', icon: Users },
  { name: 'Leaf', icon: Leaf },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Globe', icon: Globe },
  { name: 'Binoculars', icon: Binoculars },
  { name: 'Star', icon: Star },
  { name: 'Anchor', icon: Anchor },
  { name: 'Sun', icon: Sun },
];
import { ImageUpload } from "../../../components/admin/ImageUpload";

export default function CategoryManager() {
  const [activeTab, setActiveTab] = useState<'tours' | 'resorts'>('tours');
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");

  // Form State
  const [form, setForm] = useState({
    name: "",
    slug: "",
    subtitle: "",
    icon: "",
    heroImage: "",
    longDesc: "",
  });

  const authToken = typeof window !== 'undefined' ? localStorage.getItem("auth_token") || "" : "";

  useEffect(() => {
    fetchCategories();
  }, [activeTab]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = activeTab === 'tours' 
        ? await tourApi.getCategories() 
        : await resortApi.getCategories();
      setCategories(data);
    } catch (err) {
      toast.error(`Failed to load ${activeTab} categories`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (category?: any) => {
    if (category) {
      setEditMode(true);
      setCurrentId(category.id);
      setForm({
        name: category.name || "",
        slug: category.slug || "",
        subtitle: category.subtitle || "",
        icon: category.icon || "",
        heroImage: category.heroImage || "",
        longDesc: category.longDesc || "",
      });
    } else {
      setEditMode(false);
      setCurrentId("");
      setForm({ name: "", slug: "", subtitle: "", icon: "", heroImage: "", longDesc: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast.error("Name and Slug are required");
      return;
    }

    setIsUploading(true);
    try {
      if (activeTab === 'tours') {
        if (editMode) {
          await tourApi.updateCategory(authToken, currentId, form);
          toast.success("Tour category updated successfully");
        } else {
          await tourApi.createCategory(authToken, form);
          toast.success("Tour category created successfully");
        }
      } else {
        if (editMode) {
          await resortApi.updateCategory(authToken, currentId, form);
          toast.success("Resort category updated successfully");
        } else {
          await resortApi.createCategory(authToken, form);
          toast.success("Resort category created successfully");
        }
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      if (activeTab === 'tours') {
        await tourApi.deleteCategory(authToken, id);
      } else {
        await resortApi.deleteCategory(authToken, id);
      }
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  const generateSlug = () => {
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(prev => ({ ...prev, slug }));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div>
          <h2 className="text-[#041d3c] font-black text-2xl lg:text-3xl  mb-2">
            Category Manager
          </h2>
          <p className="text-gray-500 font-medium text-[13px] lg:text-[14px]">
            Manage categories for Sri Lankan Tours and Maldives Resorts
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-3 rounded-[12px] bg-[#041d3c] text-white font-bold text-[13px] hover:bg-[#1a84ff] hover:-translate-y-0.5 transition-all shadow-[0_8px_24px_rgba(4,29,60,0.15)] whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('tours')}
          className={`px-6 py-2.5 rounded-full text-[13px] font-bold border transition-all flex items-center gap-2 ${
            activeTab === 'tours'
              ? "bg-white text-[#041d3c] shadow-sm border-gray-200"
              : "bg-transparent text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          Sri Lanka Tours
        </button>
        <button
          onClick={() => setActiveTab('resorts')}
          className={`px-6 py-2.5 rounded-full text-[13px] font-bold border transition-all flex items-center gap-2 ${
            activeTab === 'resorts'
              ? "bg-white text-[#041d3c] shadow-sm border-gray-200"
              : "bg-transparent text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          Maldives Resorts
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#1a84ff] animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#e8edf4] p-12 text-center flex flex-col items-center justify-center">
          <FolderTree className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-[#041d3c] font-bold text-[18px] mb-2">No categories found</h3>
          <p className="text-gray-500 text-[13px]">Create a new category to organize your packages.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(4,29,60,0.04)] border border-[#041d3c]/5 flex flex-col">
              {/* Image Header */}
              <div className="relative h-[160px] w-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                {cat.heroImage ? (
                  <img src={cat.heroImage} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <h4 className="text-[#041d3c] font-black text-[16px] mb-1 line-clamp-1">
                  {cat.name}
                </h4>
                <p className="text-gray-400 font-medium text-[12px] mb-4">/{cat.slug}</p>
                
                <div className="h-px bg-[#041d3c]/5 w-full mb-4 mt-auto" />

                {/* Actions */}
                <div className="flex items-center justify-between mt-auto">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors text-[11px] font-extrabold tracking-wide uppercase"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors text-[11px] font-extrabold tracking-wide uppercase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#041d3c]/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-[0_24px_80px_rgba(4,29,60,0.15)] w-full max-w-[600px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-[#f4f7fb] z-10">
              <h3 className="text-[#041d3c] font-black text-[18px]">
                {editMode ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f4f7fb] text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-extrabold text-[#041d3c] uppercase tracking-wider mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    onBlur={!editMode ? generateSlug : undefined}
                    placeholder="e.g. Cultural Heritage"
                    className="w-full px-4 py-3 bg-[#f4f7fb] border border-[#e2e8f0] rounded-[12px] text-[13px] font-medium text-[#041d3c] placeholder:text-gray-300 focus:outline-none focus:border-[#1a84ff]/60 focus:ring-2 focus:ring-[#1a84ff]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-extrabold text-[#041d3c] uppercase tracking-wider mb-2">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. cultural-heritage"
                    className="w-full px-4 py-3 bg-[#f4f7fb] border border-[#e2e8f0] rounded-[12px] text-[13px] font-medium text-[#041d3c] placeholder:text-gray-300 focus:outline-none focus:border-[#1a84ff]/60 focus:ring-2 focus:ring-[#1a84ff]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-extrabold text-[#041d3c] uppercase tracking-wider mb-2">Subtitle (Tag)</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. EXCLUSIVE MALDIVES ESCAPES"
                  className="w-full px-4 py-3 bg-[#f4f7fb] border border-[#e2e8f0] rounded-[12px] text-[13px] font-medium text-[#041d3c] placeholder:text-gray-300 focus:outline-none focus:border-[#1a84ff]/60 focus:ring-2 focus:ring-[#1a84ff]/10 transition-all"
                />
              </div>



              <div>
                <label className="block text-[12px] font-extrabold text-[#041d3c] uppercase tracking-wider mb-2">Long Description</label>
                <textarea
                  value={form.longDesc}
                  onChange={e => setForm({ ...form, longDesc: e.target.value })}
                  placeholder="Detailed explanation of what this category offers"
                  rows={4}
                  className="w-full px-4 py-3 bg-[#f4f7fb] border border-[#e2e8f0] rounded-[12px] text-[13px] font-medium text-[#041d3c] placeholder:text-gray-300 focus:outline-none focus:border-[#1a84ff]/60 focus:ring-2 focus:ring-[#1a84ff]/10 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-extrabold text-[#041d3c] uppercase tracking-wider mb-2">Icon</label>
                <select
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                  className="w-full h-12 px-4 bg-[#f4f7fb] border border-[#e2e8f0] rounded-[12px] text-[13px] font-medium text-[#041d3c] focus:outline-none focus:border-[#1a84ff]/60 focus:ring-2 focus:ring-[#1a84ff]/10 transition-all"
                >
                  <option value="">Select an icon...</option>
                  {AVAILABLE_ICONS.map(i => (
                    <option key={i.name} value={i.name}>{i.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-extrabold text-[#041d3c] uppercase tracking-wider mb-2">Hero Image</label>
                <div className="bg-[#f4f7fb] border border-[#e2e8f0] rounded-[12px] p-4">
                  <ImageUpload
                    value={form.heroImage}
                    onChange={(url, publicId) => setForm({ ...form, heroImage: url })}
                    onRemove={() => setForm({ ...form, heroImage: "" })}
                    folder={`simplifly/categories/${activeTab}`}
                    requireLandscape={true}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3.5 bg-[#041d3c] hover:bg-[#1a84ff] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[12px] font-extrabold text-[13.5px] transition-all shadow-[0_8px_20px_rgba(4,29,60,0.12)] flex items-center justify-center gap-2"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isUploading ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
