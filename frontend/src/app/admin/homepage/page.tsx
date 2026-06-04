'use client';

import { useState, useEffect } from "react";
import { LayoutTemplate, Loader2, Save, MapPin, Building, Image as ImageIcon, BookOpen, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { homepageApi, HomepageConfig } from "../../../lib/homepageApi";
import { tourApi } from "../../../lib/tourApi";
import { resortApi } from "../../../lib/resortApi";
import { blogApi } from "../../../lib/blogApi";
import { galleryApi } from "../../../lib/galleryApi";
import { ImageWithFallback } from "../../../components/shared/ImageWithFallback";

export default function AdminHomepageManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Available Items
  const [availableTours, setAvailableTours] = useState<any[]>([]);
  const [availableResorts, setAvailableResorts] = useState<any[]>([]);
  const [availableBlogs, setAvailableBlogs] = useState<any[]>([]);
  const [availableGallery, setAvailableGallery] = useState<any[]>([]);

  // Selected IDs
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [selectedResorts, setSelectedResorts] = useState<string[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<string[]>([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") || "" : "";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tours, resorts, blogs, gallery, config] = await Promise.all([
        tourApi.getAdminTours(token),
        resortApi.getAdminResorts(token),
        blogApi.getPosts(),
        galleryApi.getAssets(),
        homepageApi.getSettings(token)
      ]);

      setAvailableTours(tours);
      setAvailableResorts(resorts);
      setAvailableBlogs(blogs);
      setAvailableGallery(gallery);

      setSelectedTours(config.featuredTours || []);
      setSelectedResorts(config.featuredResorts || []);
      setSelectedBlogs(config.featuredBlogs || []);
      setSelectedGallery(config.galleryImages || []);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to load homepage settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (selectedTours.length > 8) return toast.error("Maximum 8 Tours allowed");
    if (selectedResorts.length > 5) return toast.error("Maximum 5 Resorts allowed");
    if (selectedBlogs.length > 3) return toast.error("Maximum 3 Blogs allowed");
    if (selectedGallery.length > 5) return toast.error("Maximum 5 Gallery images allowed");

    setIsSaving(true);
    try {
      await homepageApi.updateSettings(token, {
        featuredTours: selectedTours,
        featuredResorts: selectedResorts,
        featuredBlogs: selectedBlogs,
        galleryImages: selectedGallery
      });
      toast.success("Homepage layout updated successfully");
    } catch (error) {
      toast.error("Failed to update homepage");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSelection = (id: string, selectedList: string[], setSelectedList: any, maxLimit: number) => {
    if (selectedList.includes(id)) {
      setSelectedList(selectedList.filter(item => item !== id));
    } else {
      if (selectedList.length >= maxLimit) {
        toast.error(`Maximum ${maxLimit} items allowed for this section`);
        return;
      }
      setSelectedList([...selectedList, id]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a84ff] mb-4" />
        <p className="text-gray-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  const renderSection = (
    title: string, 
    icon: any, 
    items: any[], 
    selectedIds: string[], 
    setSelectedIds: any, 
    maxLimit: number,
    getImage: (item: any) => string,
    getTitle: (item: any) => string
  ) => (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#e2e8f0] mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#1a84ff]/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h2 className="text-[#041d3c] font-black text-[18px]">{title}</h2>
            <p className="text-gray-500 text-[13px] font-medium">
              Select up to {maxLimit} items to feature on the homepage
            </p>
          </div>
        </div>
        <div className="bg-[#f4f7fb] px-4 py-2 rounded-full border border-[#e2e8f0]">
          <span className={`font-bold text-[14px] ${selectedIds.length === maxLimit ? 'text-emerald-600' : 'text-[#041d3c]'}`}>
            {selectedIds.length} / {maxLimit} Selected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map(item => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div 
              key={item.id}
              onClick={() => toggleSelection(item.id, selectedIds, setSelectedIds, maxLimit)}
              className={`relative rounded-[16px] overflow-hidden cursor-pointer border-2 transition-all duration-200 group h-[140px] ${
                isSelected ? 'border-[#1a84ff] shadow-md' : 'border-transparent hover:border-[#e2e8f0]'
              }`}
            >
              <ImageWithFallback 
                src={getImage(item)} 
                alt={getTitle(item)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-[12px] font-bold line-clamp-2 leading-tight">
                  {getTitle(item)}
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#1a84ff] rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-30">
        <div className="px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] bg-[#1a84ff]/10 flex items-center justify-center">
              <LayoutTemplate className="w-6 h-6 text-[#1a84ff]" />
            </div>
            <div>
              <h1 className="text-[#041d3c] font-black text-[24px]">Homepage Manager</h1>
              <p className="text-gray-500 text-[14px] font-medium">Control what visitors see on the main page</p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#041d3c] text-white px-6 py-2.5 rounded-[12px] font-bold text-[14px] hover:bg-[#1a84ff] transition-all disabled:opacity-70 shadow-sm hover:shadow-md"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        
        {renderSection(
          "Featured Tours", 
          <MapPin className="w-5 h-5 text-[#1a84ff]" />, 
          availableTours, 
          selectedTours, 
          setSelectedTours, 
          8,
          (item) => item.heroImage || item.packageImage,
          (item) => item.title
        )}

        {renderSection(
          "Featured Resorts", 
          <Building className="w-5 h-5 text-[#1a84ff]" />, 
          availableResorts, 
          selectedResorts, 
          setSelectedResorts, 
          5,
          (item) => item.heroImage || item.packageImage,
          (item) => item.title
        )}

        {renderSection(
          "Experience Gallery", 
          <ImageIcon className="w-5 h-5 text-[#1a84ff]" />, 
          availableGallery, 
          selectedGallery, 
          setSelectedGallery, 
          5,
          (item) => item.url,
          (item) => item.title || item.category
        )}

        {renderSection(
          "Latest Blogs", 
          <BookOpen className="w-5 h-5 text-[#1a84ff]" />, 
          availableBlogs, 
          selectedBlogs, 
          setSelectedBlogs, 
          3,
          (item) => item.image,
          (item) => item.title
        )}

      </main>
    </div>
  );
}
