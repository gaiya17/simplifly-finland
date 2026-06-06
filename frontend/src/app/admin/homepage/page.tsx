'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { LayoutTemplate, Loader2, Save, MapPin, Building, Image as ImageIcon, BookOpen, Check, AlertCircle, X, GripVertical, Plus } from "lucide-react";
import { toast } from "sonner";
import { homepageApi, HomepageConfig } from "../../../lib/homepageApi";
import { tourApi } from "../../../lib/tourApi";
import { resortApi } from "../../../lib/resortApi";
import { blogApi } from "../../../lib/blogApi";
import { galleryApi } from "../../../lib/galleryApi";
import { ImageWithFallback } from "../../../components/shared/ImageWithFallback";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Draggable Selected Item Component
const DraggableItem = ({ id, index, type, moveItem, removeItem, item, getImage, getTitle }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ handlerId }, drop] = useDrop({
    accept: type,
    collect(monitor) {
      return { handlerId: monitor.getHandlerId() };
    },
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type,
    item: () => { return { id, index }; },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  return (
    <div 
      ref={ref} 
      data-handler-id={handlerId}
      className={`relative rounded-[16px] overflow-hidden border-2 border-[#1a84ff] shadow-md group h-[140px] shrink-0 w-[240px] ${isDragging ? 'opacity-50' : 'opacity-100'} cursor-grab active:cursor-grabbing`}
    >
      <ImageWithFallback 
        src={getImage(item)} 
        alt={getTitle(item)}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      
      {/* Rank Badge */}
      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white font-black text-[12px] px-2 py-1 rounded-[6px] shadow-sm pointer-events-none">
        #{index + 1}
      </div>

      {/* Grip */}
      <div className="absolute top-2 right-10 w-6 h-6 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <GripVertical className="w-3.5 h-3.5 text-white" />
      </div>

      {/* Remove Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); removeItem(id); }}
        className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors z-10"
      >
        <X className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </button>
      
      <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
        <p className="text-white text-[12px] font-bold line-clamp-2 leading-tight">
          {getTitle(item)}
        </p>
      </div>
    </div>
  );
};

function AdminHomepageManagerContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Available Items
  const [availableTours, setAvailableTours] = useState<any[]>([]);
  const [availableResorts, setAvailableResorts] = useState<any[]>([]);
  const [availableBlogs, setAvailableBlogs] = useState<any[]>([]);
  const [availableGallery, setAvailableGallery] = useState<any[]>([]);

  // Selected IDs (Maintains exact order)
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

      // Clean up any invalid IDs that might have been deleted from the database
      const validTours = (config.featuredTours || []).filter((id: string) => tours.some((t: any) => t.id === id));
      const validResorts = (config.featuredResorts || []).filter((id: string) => resorts.some((r: any) => r.id === id));
      const validBlogs = (config.featuredBlogs || []).filter((id: string) => blogs.some((b: any) => b.id === id));
      const validGallery = (config.galleryImages || []).filter((id: string) => gallery.some((g: any) => g.id === id));

      setSelectedTours(validTours);
      setSelectedResorts(validResorts);
      setSelectedBlogs(validBlogs);
      setSelectedGallery(validGallery);
      
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

  const addItem = (id: string, selectedList: string[], setSelectedList: any, maxLimit: number) => {
    if (selectedList.length >= maxLimit) {
      toast.error(`Maximum ${maxLimit} items allowed for this section`);
      return;
    }
    setSelectedList([...selectedList, id]);
  };

  const removeItem = (id: string, selectedList: string[], setSelectedList: any) => {
    setSelectedList(selectedList.filter((itemId: string) => itemId !== id));
  };

  const moveItem = useCallback((dragIndex: number, hoverIndex: number, list: string[], setList: any) => {
    const dragItem = list[dragIndex];
    setList((prev: string[]) => {
      const newList = [...prev];
      newList.splice(dragIndex, 1);
      newList.splice(hoverIndex, 0, dragItem);
      return newList;
    });
  }, []);

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
    type: string,
    icon: any, 
    items: any[], 
    selectedIds: string[], 
    setSelectedIds: any, 
    maxLimit: number,
    getImage: (item: any) => string,
    getTitle: (item: any) => string
  ) => {
    // Map selected IDs to actual items
    const selectedItems = selectedIds.map(id => items.find(i => i.id === id)).filter(Boolean);

    return (
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#e2e8f0] mb-8">
        <div className="flex items-center justify-between mb-6 border-b border-[#e2e8f0] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#1a84ff]/10 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h2 className="text-[#041d3c] font-black text-[18px]">{title}</h2>
              <p className="text-gray-500 text-[13px] font-medium">
                Drag and drop to set the exact display order.
              </p>
            </div>
          </div>
          <div className="bg-[#f4f7fb] px-4 py-2 rounded-full border border-[#e2e8f0]">
            <span className={`font-bold text-[14px] ${selectedIds.length === maxLimit ? 'text-emerald-600' : 'text-[#041d3c]'}`}>
              {selectedIds.length} / {maxLimit} Selected
            </span>
          </div>
        </div>

        {/* Selected Items Strip (Drag & Drop) */}
        <div className="mb-8 bg-[#f8fafc] p-4 rounded-[16px] border border-[#e2e8f0] min-h-[174px]">
          <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4">Selected Items (Drag to reorder)</h3>
          
          {selectedItems.length === 0 ? (
            <div className="w-full h-[140px] border-2 border-dashed border-gray-300 rounded-[16px] flex flex-col items-center justify-center text-gray-400">
              <Plus className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-[13px] font-bold">Select items below to add them</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {selectedItems.map((item, index) => (
                <DraggableItem
                  key={item.id}
                  id={item.id}
                  index={index}
                  type={type}
                  item={item}
                  getImage={getImage}
                  getTitle={getTitle}
                  moveItem={(dIdx: number, hIdx: number) => moveItem(dIdx, hIdx, selectedIds, setSelectedIds)}
                  removeItem={(id: string) => removeItem(id, selectedIds, setSelectedIds)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Available Items Grid */}
        <div>
          <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4">Available To Select</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map(item => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => !isSelected && addItem(item.id, selectedIds, setSelectedIds, maxLimit)}
                  className={`relative rounded-[16px] overflow-hidden border-2 transition-all duration-200 group h-[120px] ${
                    isSelected 
                      ? 'border-transparent opacity-40 grayscale cursor-not-allowed' 
                      : 'border-transparent hover:border-[#1a84ff]/50 cursor-pointer'
                  }`}
                >
                  <ImageWithFallback 
                    src={getImage(item)} 
                    alt={getTitle(item)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-[11px] font-bold line-clamp-2 leading-tight">
                      {getTitle(item)}
                    </p>
                  </div>

                  {!isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-black/60 px-3 py-1.5 rounded-full text-white text-[10px] font-bold flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400" /> Selected
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

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
              <p className="text-gray-500 text-[14px] font-medium">Set exact ordering via Drag and Drop</p>
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
          "TOUR",
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
          "RESORT",
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
          "GALLERY",
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
          "BLOG",
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

export default function AdminHomepageManager() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AdminHomepageManagerContent />
    </DndProvider>
  );
}
