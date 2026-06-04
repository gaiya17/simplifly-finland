'use client';

import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { galleryApi } from "../../../lib/galleryApi";
import { ImageUpload } from "../../../components/admin/ImageUpload";

export default function AdminGallery() {
  const [assets, setAssets] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    title: "",
    category: "Sri Lanka",
    url: "",
    publicId: "",
  });

  const categories = ["All", "Sri Lanka", "Maldives"];

  useEffect(() => {
    fetchAssets();
  }, [filter]);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const data = await galleryApi.getAssets(filter);
      setAssets(data);
    } catch (err) {
      toast.error("Failed to load gallery assets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url || !form.publicId) {
      toast.error("Please upload an image first");
      return;
    }
    
    setIsUploading(true);
    try {
      await galleryApi.createAsset({
        title: form.title,
        category: form.category,
        url: form.url,
        publicId: form.publicId,
        size: "N/A", // size can be extracted if we get it from cloudinary
        format: "JPEG File"
      });
      toast.success("Asset uploaded successfully");
      setIsUploadOpen(false);
      setForm({ title: "", category: "Sri Lanka", url: "", publicId: "" });
      fetchAssets();
    } catch (err) {
      toast.error("Failed to upload asset");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    try {
      await galleryApi.deleteAsset(id);
      toast.success("Asset deleted successfully");
      fetchAssets();
    } catch (err) {
      toast.error("Failed to delete asset");
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div>
          <h2 className="text-[#041d3c] font-black text-2xl lg:text-3xl  mb-2">
            Destination Media Gallery
          </h2>
          <p className="text-gray-500 font-medium text-[13px] lg:text-[14px]">
            Upload, delete, or organize high-resolution website banners
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-[12px] bg-[#041d3c] text-white font-bold text-[13px] hover:bg-[#1a84ff] hover:-translate-y-0.5 transition-all shadow-[0_8px_24px_rgba(4,29,60,0.15)] whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Upload Image Asset
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-full text-[13px] font-bold border transition-all ${
              filter === cat
                ? "bg-white text-[#041d3c] shadow-sm border-gray-200"
                : "bg-transparent text-gray-400 border-transparent hover:text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#1a84ff] animate-spin" />
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#e8edf4] p-12 text-center flex flex-col items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-[#041d3c] font-bold text-[18px] mb-2">No assets found</h3>
          <p className="text-gray-500 text-[13px]">Upload a new image asset to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(4,29,60,0.04)] border border-[#041d3c]/5">
              {/* Image Header */}
              <div className="relative h-[220px] w-full bg-gray-100 overflow-hidden">
                <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm ${
                    asset.category === 'Sri Lanka' ? 'bg-[#f59e0b]' :
                    asset.category === 'Maldives' ? 'bg-[#1a84ff]' : 'bg-gray-800'
                  }`}>
                    {asset.category}
                  </span>
                </div>
                {/* Gradient overlay for bottom to blend with white */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col">
                <h4 className="text-[#041d3c] font-black text-[16px] mb-3 line-clamp-1">
                  {asset.title}
                </h4>
                
                {/* File info */}
                <div className="flex items-center justify-between text-gray-400 font-semibold text-[11px] mb-5">
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{asset.format || 'JPEG File'}</span>
                  </div>
                  <span>{asset.size || '1.6 MB'}</span>
                </div>

                <div className="h-px bg-[#041d3c]/5 w-full mb-4" />

                {/* Actions */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors text-[11px] font-extrabold tracking-wide uppercase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Asset
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#041d3c]/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-[0_24px_80px_rgba(4,29,60,0.15)] w-full max-w-[500px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-[#f4f7fb] z-10">
              <h3 className="text-[#041d3c] font-black text-[18px]">Upload Image Asset</h3>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f4f7fb] text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-extrabold text-[#041d3c] uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Sigiriya Rock Fortress Scenic"
                  className="w-full px-4 py-3 bg-[#f4f7fb] border border-[#e2e8f0] rounded-[12px] text-[13px] font-medium text-[#041d3c] placeholder:text-gray-300 focus:outline-none focus:border-[#1a84ff]/60 focus:ring-2 focus:ring-[#1a84ff]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-extrabold text-[#041d3c] uppercase tracking-wider mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f4f7fb] border border-[#e2e8f0] rounded-[12px] text-[13px] font-medium text-[#041d3c] focus:outline-none focus:border-[#1a84ff]/60 transition-all"
                >
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Maldives">Maldives</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-extrabold text-[#041d3c] uppercase tracking-wider mb-2">Upload File</label>
                <div className="bg-[#f4f7fb] border border-[#e2e8f0] rounded-[12px] p-4">
                  <ImageUpload
                    value={form.url}
                    onChange={(url, publicId) => setForm({ ...form, url, publicId })}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploading || !form.url}
                  className="w-full py-3.5 bg-[#041d3c] hover:bg-[#1a84ff] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[12px] font-extrabold text-[13.5px] transition-all shadow-[0_8px_20px_rgba(4,29,60,0.12)] flex items-center justify-center gap-2"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isUploading ? "Uploading..." : "Save Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
