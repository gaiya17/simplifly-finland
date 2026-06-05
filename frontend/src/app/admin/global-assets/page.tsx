'use client';

import { useState, useEffect } from "react";
import { Settings, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { siteAssetsApi, SiteAsset } from "../../../lib/siteAssetsApi";
import { ImageUpload } from "../../../components/admin/ImageUpload";

const ASSET_DEFINITIONS = [
  { key: "homepage_hero_srilanka", title: "Homepage Hero: Sri Lanka", desc: "Main hero background image for Sri Lanka tab (1920x1080)" },
  { key: "homepage_hero_maldives", title: "Homepage Hero: Maldives", desc: "Main hero background image for Maldives tab (1920x1080)" },
  { key: "homepage_maldives_bg", title: "Homepage Maldives Section BG", desc: "Background image for the Maldives Resorts section on homepage" },
  { key: "brand_1", title: "Brand Logo 1", desc: "Homepage trusted partners logo" },
  { key: "brand_2", title: "Brand Logo 2", desc: "Homepage trusted partners logo" },
  { key: "brand_3", title: "Brand Logo 3", desc: "Homepage trusted partners logo" },
  { key: "brand_4", title: "Brand Logo 4", desc: "Homepage trusted partners logo" },
  { key: "brand_5", title: "Brand Logo 5", desc: "Homepage trusted partners logo" },
  { key: "who_we_are_hero", title: "Who We Are Hero", desc: "Hero background for Who We Are page" },
  { key: "who_we_are_ceo", title: "CEO Image", desc: "Buddhika Gamage main image" },
  { key: "who_we_are_primal", title: "Team: Primal Gamage", desc: "Team member image" },
  { key: "sri_lanka_tours_hero", title: "Sri Lanka Tours Hero", desc: "Main page hero" },
  { key: "sri_lanka_tours_all_hero", title: "All Sri Lanka Tours Hero", desc: "All tours listing page hero" },
  { key: "maldives_resorts_hero", title: "Maldives Resorts Hero", desc: "Main page hero" },
  { key: "maldives_resorts_all_hero", title: "All Maldives Resorts Hero", desc: "All resorts listing page hero" },
  { key: "blog_hero", title: "Blog Hero", desc: "Blog main page hero" },
  { key: "gallery_hero", title: "Gallery Hero", desc: "Gallery main page hero" },
];

export default function GlobalAssetsManager() {
  const [assets, setAssets] = useState<Record<string, { url: string; publicId: string | null }>>({});
  const [isLoading, setIsLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") || "" : "";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await siteAssetsApi.getAssets();
      setAssets(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load global assets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAsset = async (key: string, url: string, publicId: string | null) => {
    try {
      await siteAssetsApi.updateAsset(token, key, url, publicId);
      toast.success("Asset updated successfully");
      
      // Update local state to reflect change instantly
      setAssets((prev) => ({
        ...prev,
        [key]: { url, publicId }
      }));
    } catch (error) {
      toast.error("Failed to update asset");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a84ff] mb-4" />
        <p className="text-gray-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f8fafc] min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-30">
        <div className="px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] bg-[#1a84ff]/10 flex items-center justify-center">
              <Settings className="w-6 h-6 text-[#1a84ff]" />
            </div>
            <div>
              <h1 className="text-[#041d3c] font-black text-[24px]">Global Assets</h1>
              <p className="text-gray-500 text-[14px] font-medium">Manage structural images across the website</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-[#e2e8f0]">
          <div className="mb-8">
            <h2 className="text-[18px] font-bold text-[#041d3c] mb-2">Structural Images</h2>
            <p className="text-[14px] text-gray-500">
              Upload images directly to Cloudinary. These will instantly update across your website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ASSET_DEFINITIONS.map((def) => (
              <div key={def.key} className="flex flex-col border border-[#e2e8f0] rounded-[16px] p-5 bg-[#f8fafc]/50">
                <div className="mb-4">
                  <h3 className="font-bold text-[#041d3c] text-[15px]">{def.title}</h3>
                  <p className="text-[12px] text-gray-500 mt-1 leading-snug">{def.desc}</p>
                </div>
                <div className="h-[180px]">
                  <ImageUpload
                    value={assets[def.key]?.url || ""}
                    publicId={assets[def.key]?.publicId || ""}
                    folder="simplifly/global"
                    onChange={(url, publicId) => handleUpdateAsset(def.key, url, publicId)}
                    onRemove={async () => {
                      // We don't really want them to remove structural images, just replace them.
                      toast.info("Please upload a new image to replace the current one.");
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
