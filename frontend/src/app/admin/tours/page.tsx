'use client';

import { useState, useEffect } from "react";
import { Plus, X, Search, MapPin, Calendar, Trash2, Filter, Map, Edit, Image, Check, AlertCircle, ChevronRight, ChevronLeft, Percent, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { tourApi } from "../../../lib/tourApi";
import { ImageUpload } from "../../../components/admin/ImageUpload";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "Adventure & Nature Based Tours": { bg: "bg-emerald-50", text: "text-emerald-700" },
  "Culture & Heritage Tour":        { bg: "bg-amber-50",   text: "text-amber-700"   },
  "Family Tours":                   { bg: "bg-blue-50",    text: "text-blue-700"    },
  "Wild Life Tours":                { bg: "bg-orange-50",  text: "text-orange-700"  },
  "Romantic Tours":                 { bg: "bg-pink-50",    text: "text-pink-700"    },
  "Sustainable Tours":              { bg: "bg-teal-50",    text: "text-teal-700"    },
  "Sports & Adventure Tours":       { bg: "bg-violet-50",  text: "text-violet-700"  },
  "Wellness & Ayurveda Tours":      { bg: "bg-lime-50",    text: "text-lime-700"    },
};

const SRI_LANKA_DESTINATIONS = [
  "Colombo", "Negombo", "Kandy", "Nuwara Eliya", "Ella", "Galle", "Mirissa",
  "Yala", "Udawalawe", "Sigiriya", "Dambulla", "Polonnaruwa", "Anuradhapura",
  "Trincomalee", "Arugam Bay", "Jaffna", "Bentota", "Hikkaduwa", "Airport"
];

const inputCls = "w-full px-4 py-3 bg-[#f4f7fb] border border-[#e2e8f0] rounded-[12px] text-[13px] font-medium text-[#041d3c] placeholder:text-gray-300 focus:outline-none focus:border-[#1a84ff]/60 focus:ring-2 focus:ring-[#1a84ff]/10 transition-all";


export default function AdminTours() {
  const [tours, setTours] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [discountModalId, setDiscountModalId] = useState<string | null>(null);
  const [discountForm, setDiscountForm] = useState({ discount: '', offerPoster: '', offerPosterPublicId: '' });

  // Form State
  const [step, setStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({
    id: "", title: "", categoryId: "", price: "", discount: "", days: 7, nights: 6, status: "active",
    heroImage: "", heroImagePublicId: "", packageImage: "", packageImagePublicId: "",
    summary: "", destinations: [] as string[],
    itinerary: [], inclusions: [], gallery: []
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") || "" : "";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedTours, fetchedCategories] = await Promise.all([
        tourApi.getAdminTours(token),
        tourApi.getCategories()
      ]);
      setTours(fetchedTours);
      setCategories(fetchedCategories);
    } catch (err) {
      toast.error("Failed to load tour data");
    } finally {
      setIsLoading(false);
    }
  };

  const openWizard = (tour: any = null) => {
    if (tour) {
      setIsEditing(true);
      setForm({
        id: tour.id, title: tour.title, categoryId: tour.categoryId, price: tour.price, discount: tour.discount || "",
        days: tour.days, nights: tour.nights, status: tour.status,
        heroImage: tour.heroImage || "", heroImagePublicId: tour.heroImagePublicId || "",
        packageImage: tour.packageImage || "", packageImagePublicId: tour.packageImagePublicId || "",
        summary: tour.summary || "", 
        destinations: tour.destinations ? tour.destinations.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        itinerary: tour.itinerary ? tour.itinerary.map((d: any) => ({
          ...d,
          routeLocations: d.route ? d.route.split(" -> ").map((s: string) => s.trim()).filter(Boolean) : [""]
        })) : [], 
        inclusions: tour.inclusions || [], gallery: tour.gallery || []
      });
    } else {
      setIsEditing(false);
      setForm({
        id: "", title: "", categoryId: categories[0]?.id || "", price: "", discount: "",
        days: 7, nights: 6, status: "active",
        heroImage: "", heroImagePublicId: "", packageImage: "", packageImagePublicId: "",
        summary: "", destinations: [], itinerary: [], inclusions: [], gallery: []
      });
    }
    setStep(1);
    setIsWizardOpen(true);
  };

  const saveTour = async () => {
    try {
      const payload = {
        ...form,
        destinations: form.destinations.join(", "),
        itinerary: form.itinerary.map((d: any) => ({
          ...d,
          route: d.routeLocations ? d.routeLocations.join(" -> ") : ""
        }))
      };

      if (isEditing) {
        await tourApi.updateTour(token, form.id, payload);
        toast.success("Tour updated successfully");
      } else {
        await tourApi.createTour(token, payload);
        toast.success("Tour created successfully");
      }
      setIsWizardOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to save tour");
    }
  };

  const deleteTour = async (id: string) => {
    try {
      await tourApi.deleteTour(token, id);
      toast.success("Tour deleted");
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to delete tour");
    }
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "active" ? "inactive" : "active";
    try {
      await tourApi.toggleStatus(token, id, next);
      toast.success(`Status changed to ${next}`);
      setTours(prev => prev.map(t => t.id === id ? { ...t, status: next } : t));
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const openDiscountModal = (tour: any) => {
    setDiscountForm({
      discount: tour.discount || '',
      offerPoster: tour.offerPoster || '',
      offerPosterPublicId: tour.offerPosterPublicId || ''
    });
    setDiscountModalId(tour.id);
  };

  const applyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountModalId) return;
    try {
      await tourApi.updateDiscount(
        token, 
        discountModalId, 
        discountForm.discount ? Number(discountForm.discount) : null,
        discountForm.offerPoster,
        discountForm.offerPosterPublicId
      );
      toast.success("Discount updated");
      setDiscountModalId(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to update discount");
    }
  };

  const filtered = tours.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || (t.destinations || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "All" || t.category?.name === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-extrabold text-[#041d3c] ">Tour Packages</h2>
          <p className="text-[12px] text-gray-400 font-medium mt-0.5">Manage, publish, and organise your tours</p>
        </div>
        <button
          onClick={() => openWizard()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#041d3c] hover:bg-[#1a84ff] text-white text-[12.5px] font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Tour Package
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-[16px] border border-[#e8edf4] px-5 py-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text" placeholder="Search tours..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f4f7fb] border border-[#e8edf4] rounded-[11px] text-[12.5px] font-medium"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 flex-1">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-2" />
          {["All", ...categories.map(c => c.name)].map(cat => (
            <button
              key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat ? "bg-[#041d3c] text-white border-[#041d3c]" : "bg-[#f4f7fb] border-[#e8edf4] text-gray-500 hover:border-[#041d3c]/30 hover:text-[#041d3c]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tour table ── */}
      {isLoading ? (
        <div className="py-20 text-center text-gray-400"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2"/>Loading tours...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#e8edf4] py-20 flex flex-col items-center gap-3">
          <Map className="w-10 h-10 text-gray-200" />
          <p className="text-[14px] font-bold text-gray-400">No tours match your filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-[#e8edf4] overflow-hidden">
          <div className="grid grid-cols-[2fr_1.4fr_1fr_1fr_100px_130px] gap-4 px-6 py-3.5 bg-[#f8fafc] border-b border-[#e8edf4] text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-gray-400">
            <span>Package</span><span>Category</span><span>Duration</span><span>Price</span><span>Status</span><span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-[#f0f4f9]">
            {filtered.map(tour => {
              const catStyle = CATEGORY_COLORS[tour.category?.name] ?? { bg: "bg-gray-50", text: "text-gray-600" };
              return (
                <div key={tour.id} className="grid grid-cols-[2fr_1.4fr_1fr_1fr_100px_130px] gap-4 px-6 py-4 items-center hover:bg-[#f8fafc] transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-[10px] overflow-hidden shrink-0 bg-gray-100">
                      {tour.packageImage && <img src={tour.packageImage} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#041d3c] truncate">{tour.title}</p>
                      {tour.discount && <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-600">-{tour.discount}% OFF</span>}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold w-fit ${catStyle.bg} ${catStyle.text}`}>
                    {tour.category?.name.length > 22 ? tour.category?.name.slice(0, 22) + "…" : tour.category?.name}
                  </span>
                  <div className="text-[12.5px] font-semibold text-gray-500">
                    {tour.nights}N / {tour.days}D
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-extrabold text-[#041d3c]">
                      €{tour.discount ? Math.round(tour.price * (1 - tour.discount / 100)) : tour.price}
                    </span>
                    {tour.discount && (
                      <span className="text-[11px] text-gray-400 line-through">€{tour.price}</span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleStatus(tour.id, tour.status)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                      tour.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${tour.status === "active" ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {tour.status === "active" ? "Active" : "Inactive"}
                  </button>
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openDiscountModal(tour)} className="w-8 h-8 rounded-[8px] bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-all" title="Manage Discount">
                      <Percent className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => openWizard(tour)} className="w-8 h-8 rounded-[8px] bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-all" title="Edit Tour">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(tour.id)} className="w-8 h-8 rounded-[8px] border border-rose-100 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-all" title="Delete Tour">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Multi-Step Wizard Modal ── */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-[700px] h-full shadow-[-10px_0_40px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#f0f4f9]">
              <div>
                <h3 className="text-[20px] font-extrabold text-[#041d3c]">{isEditing ? 'Edit Tour' : 'Create New Tour'}</h3>
                <p className="text-[13px] text-gray-500 font-medium">Step {step} of 6</p>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in">
                  <h4 className="text-[15px] font-bold text-[#041d3c] border-b pb-2">1. Basics</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Category</label>
                    <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className={inputCls}>
                      <option value="">Select a Category...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Tour Title</label>
                    <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputCls} placeholder="e.g. Grand Explorer Tour" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Price (€)</label>
                      <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputCls} placeholder="e.g. 1200" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Nights</label>
                      <input type="number" value={form.nights} onChange={e => setForm({...form, nights: Number(e.target.value), days: Number(e.target.value) + 1})} className={inputCls} min="0" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Days (Auto)</label>
                      <input type="number" value={form.days} disabled className={`${inputCls} bg-gray-100 cursor-not-allowed opacity-70`} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in">
                  <h4 className="text-[15px] font-bold text-[#041d3c] border-b pb-2">2. Media & Images</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Hero Image (Large)</label>
                      <ImageUpload
                        value={form.heroImage} publicId={form.heroImagePublicId} folder="simplifly/tours"
                        onChange={(url, id) => setForm({...form, heroImage: url, heroImagePublicId: id})}
                        onRemove={() => setForm({...form, heroImage: "", heroImagePublicId: ""})}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Card Image (Square)</label>
                      <ImageUpload
                        value={form.packageImage} publicId={form.packageImagePublicId} folder="simplifly/tours"
                        onChange={(url, id) => setForm({...form, packageImage: url, packageImagePublicId: id})}
                        onRemove={() => setForm({...form, packageImage: "", packageImagePublicId: ""})}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase">Gallery Images</label>
                      <span className="text-[11px] text-gray-400">{form.gallery.length} added</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {form.gallery.map((g: any, i: number) => (
                        <ImageUpload
                          key={i} value={g.url} publicId={g.publicId} folder="simplifly/gallery"
                          onChange={(url, id) => {
                            const ng = [...form.gallery]; ng[i] = { url, publicId: id, order: i };
                            setForm({...form, gallery: ng});
                          }}
                          onRemove={() => setForm({...form, gallery: form.gallery.filter((_: any, idx: number) => idx !== i)})}
                        />
                      ))}
                      {form.gallery.length < 9 && (
                        <ImageUpload
                          folder="simplifly/gallery"
                          onChange={(url, id) => setForm({...form, gallery: [...form.gallery, { url, publicId: id, order: form.gallery.length }]})}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  <h4 className="text-[15px] font-bold text-[#041d3c] border-b pb-2">3. Tour Content</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Destinations Overview</label>
                    <div className="flex flex-wrap gap-2">
                      {SRI_LANKA_DESTINATIONS.map(dest => {
                        const isSelected = form.destinations.includes(dest);
                        return (
                          <button
                            key={dest}
                            type="button"
                            onClick={() => {
                              const newDest = isSelected 
                                ? form.destinations.filter((d: string) => d !== dest) 
                                : [...form.destinations, dest];
                              setForm({...form, destinations: newDest});
                            }}
                            className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all ${
                              isSelected ? "bg-[#1a84ff] border-[#1a84ff] text-white" : "bg-white border-gray-200 text-gray-600 hover:border-[#1a84ff]/50"
                            }`}
                          >
                            {isSelected && <Check className="inline-block w-3 h-3 mr-1" />}
                            {dest}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Tour Summary</label>
                    <textarea value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} className={`${inputCls} min-h-[200px] resize-y`} placeholder="Describe the tour experience in detail..." />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-[15px] font-bold text-[#041d3c]">4. Itinerary ({form.days} Days)</h4>
                    <button onClick={() => {
                      const nextDay = form.itinerary.length + 1;
                      setForm({...form, itinerary: [...form.itinerary, { dayNumber: nextDay, title: "", description: "", routeLocations: [""], stay: "", mealPlan: "BB" }]});
                    }} className="text-[12px] text-[#1a84ff] font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5"/> Add Day</button>
                  </div>
                  <div className="space-y-6">
                    {form.itinerary.map((day: any, i: number) => (
                      <div key={i} className="p-5 bg-gray-50 rounded-[16px] border border-gray-100 relative group">
                        <button onClick={() => setForm({...form, itinerary: form.itinerary.filter((_:any, idx:number)=>idx!==i)})} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hidden group-hover:block"><Trash2 className="w-4 h-4"/></button>
                        <div className="font-bold text-[13px] text-[#041d3c] mb-3">Day {day.dayNumber}</div>
                        <div className="mb-4">
                          <input type="text" placeholder="Day Title (e.g. Arrival in Colombo)" value={day.title} onChange={e => { const ni = [...form.itinerary]; ni[i].title = e.target.value; setForm({...form, itinerary: ni}); }} className={inputCls} />
                        </div>
                        <div className="mb-4">
                          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Route Locations</label>
                          <div className="flex flex-wrap items-center gap-2">
                            {day.routeLocations?.map((loc: string, locIdx: number) => (
                              <div key={locIdx} className="flex items-center gap-2">
                                {locIdx > 0 && <span className="text-gray-400 font-bold">-&gt;</span>}
                                <select 
                                  value={loc}
                                  onChange={e => {
                                    const ni = [...form.itinerary];
                                    ni[i].routeLocations[locIdx] = e.target.value;
                                    setForm({...form, itinerary: ni});
                                  }}
                                  className={`${inputCls} w-auto py-2 pr-8`}
                                >
                                  <option value="">Select Location...</option>
                                  {SRI_LANKA_DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <button type="button" onClick={() => {
                                  const ni = [...form.itinerary];
                                  ni[i].routeLocations.splice(locIdx, 1);
                                  setForm({...form, itinerary: ni});
                                }} className="text-gray-400 hover:text-red-500"><X className="w-3.5 h-3.5"/></button>
                              </div>
                            ))}
                            <button type="button" onClick={() => {
                              const ni = [...form.itinerary];
                              if (!ni[i].routeLocations) ni[i].routeLocations = [];
                              ni[i].routeLocations.push("");
                              setForm({...form, itinerary: ni});
                            }} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-[12px] text-[12px] font-bold hover:bg-gray-200 flex items-center gap-1">
                              <Plus className="w-3.5 h-3.5"/> Add Stop
                            </button>
                          </div>
                        </div>
                        <textarea placeholder="Day Description..." value={day.description} onChange={e => { const ni = [...form.itinerary]; ni[i].description = e.target.value; setForm({...form, itinerary: ni}); }} className={`${inputCls} min-h-[80px] mb-4`} />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <select value={day.stay} onChange={e => { const ni = [...form.itinerary]; ni[i].stay = e.target.value; setForm({...form, itinerary: ni}); }} className={inputCls}>
                              <option value="">No Overnight Stay / None</option>
                              {form.destinations.map((d: string) => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>
                          <div>
                            <select value={day.mealPlan} onChange={e => { const ni = [...form.itinerary]; ni[i].mealPlan = e.target.value; setForm({...form, itinerary: ni}); }} className={inputCls}>
                              <option value="BB">Bed & Breakfast (BB)</option>
                              <option value="HB">Half Board (HB)</option>
                              <option value="FB">Full Board (FB)</option>
                              <option value="AI">All Inclusive (AI)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    {form.itinerary.length === 0 && <p className="text-gray-400 text-center py-4 text-[13px]">No itinerary days added yet.</p>}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6 animate-in fade-in">
                  <h4 className="text-[15px] font-bold text-[#041d3c] border-b pb-2">5. Inclusions & Exclusions</h4>
                  <div className="grid grid-cols-2 gap-8">
                    {/* Included */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[12px] font-bold text-emerald-600 uppercase">What's Included</label>
                        <button onClick={() => setForm({...form, inclusions: [...form.inclusions, { text: "", isIncluded: true }]})} className="text-[18px] text-emerald-500 hover:text-emerald-700"><Plus className="w-4 h-4"/></button>
                      </div>
                      <div className="space-y-2">
                        {form.inclusions.filter((inc:any) => inc.isIncluded).map((inc:any, i:number) => {
                          const realIdx = form.inclusions.indexOf(inc);
                          return (
                            <div key={realIdx} className="flex gap-2">
                              <input type="text" value={inc.text} onChange={e => { const ni = [...form.inclusions]; ni[realIdx].text = e.target.value; setForm({...form, inclusions: ni}); }} className={inputCls} placeholder="e.g. Accommodation on BB basis" />
                              <button onClick={() => setForm({...form, inclusions: form.inclusions.filter((_:any, idx:number)=>idx!==realIdx)})} className="p-3 bg-red-50 text-red-500 rounded-[12px]"><X className="w-4 h-4"/></button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    {/* Excluded */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[12px] font-bold text-rose-600 uppercase">What's Not Included</label>
                        <button onClick={() => setForm({...form, inclusions: [...form.inclusions, { text: "", isIncluded: false }]})} className="text-[18px] text-rose-500 hover:text-rose-700"><Plus className="w-4 h-4"/></button>
                      </div>
                      <div className="space-y-2">
                        {form.inclusions.filter((inc:any) => !inc.isIncluded).map((inc:any, i:number) => {
                          const realIdx = form.inclusions.indexOf(inc);
                          return (
                            <div key={realIdx} className="flex gap-2">
                              <input type="text" value={inc.text} onChange={e => { const ni = [...form.inclusions]; ni[realIdx].text = e.target.value; setForm({...form, inclusions: ni}); }} className={inputCls} placeholder="e.g. International Flights" />
                              <button onClick={() => setForm({...form, inclusions: form.inclusions.filter((_:any, idx:number)=>idx!==realIdx)})} className="p-3 bg-red-50 text-red-500 rounded-[12px]"><X className="w-4 h-4"/></button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6 animate-in fade-in">
                  <h4 className="text-[15px] font-bold text-[#041d3c] border-b pb-2">6. Review & Publish</h4>
                  <div className="bg-blue-50 p-6 rounded-[16px] border border-blue-100 flex gap-6">
                    <img src={form.packageImage || 'https://via.placeholder.com/150'} alt="Preview" className="w-[120px] h-[120px] rounded-[12px] object-cover" />
                    <div>
                      <h5 className="text-[18px] font-extrabold text-[#041d3c]">{form.title || 'Untitled Tour'}</h5>
                      <p className="text-gray-500 text-[13px] mt-1">{form.nights} Nights / {form.days} Days</p>
                      <p className="text-[16px] font-bold text-[#1a84ff] mt-3">€{form.price || '0'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-[12px] bg-white">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-[13px] font-bold text-[#041d3c]">Ready to publish?</p>
                      <p className="text-[12px] text-gray-500">Ensure all images are uploaded and itinerary details are correct before saving.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#f0f4f9] flex items-center justify-between bg-gray-50 shrink-0">
              <button
                disabled={step === 1}
                onClick={() => setStep(s => Math.max(1, s - 1))}
                className="px-5 py-2.5 rounded-[12px] border border-[#e2e8f0] bg-white text-[#041d3c] font-bold text-[13px] hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              
              {step < 6 ? (
                <button
                  onClick={() => {
                    if (step === 1 && (!form.title || !form.categoryId || !form.price)) {
                      toast.error("Please fill title, category, and price");
                      return;
                    }
                    setStep(s => s + 1);
                  }}
                  className="px-6 py-2.5 rounded-[12px] bg-[#1a84ff] text-white font-bold text-[13px] hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={saveTour}
                  className="px-6 py-2.5 rounded-[12px] bg-[#10b981] text-white font-bold text-[13px] hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <Check className="w-4 h-4" /> Save & Publish
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Discount Modal ── */}
      {discountModalId !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={applyDiscount} className="bg-white rounded-[20px] p-7 w-full max-w-[420px] shadow-2xl my-auto">
            <h3 className="text-[16px] font-extrabold text-[#041d3c] mb-2">Manage Discount & Offer</h3>
            <p className="text-[12.5px] text-gray-500 mb-5">Set a percentage discount for this package and optionally upload a promotional poster.</p>
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Discount %</label>
              <div className="relative">
                <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="number" min="0" max="100" 
                  value={discountForm.discount} 
                  onChange={e => setDiscountForm({...discountForm, discount: e.target.value})} 
                  className={`${inputCls} pl-10`} placeholder="e.g. 15" 
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Offer Poster (Optional)</label>
              <ImageUpload
                value={discountForm.offerPoster} publicId={discountForm.offerPosterPublicId} folder="simplifly/offers"
                onChange={(url, id) => setDiscountForm({...discountForm, offerPoster: url, offerPosterPublicId: id})}
                onRemove={() => setDiscountForm({...discountForm, offerPoster: "", offerPosterPublicId: ""})}
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDiscountModalId(null)} className="flex-1 py-2.5 rounded-[11px] bg-gray-100 text-gray-600 font-bold text-[12.5px] hover:bg-gray-200">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-[11px] bg-[#1a84ff] text-white font-bold text-[12.5px] hover:bg-blue-600 shadow-md">Apply</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[20px] border border-[#e8edf4] shadow-[0_20px_60px_rgba(4,29,60,0.15)] w-full max-w-[380px] p-7 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-[15px] font-extrabold text-[#041d3c] mb-2">Delete Tour Package?</h3>
            <p className="text-[12.5px] text-gray-400 font-medium mb-6">
              This will permanently remove this tour and delete its images from Cloudinary. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-[11px] border border-[#e8edf4] bg-[#f4f7fb] text-gray-600 text-[12.5px] font-bold hover:bg-[#eaeff6] transition-all">Cancel</button>
              <button onClick={() => deleteTour(deleteConfirmId)} className="flex-1 py-2.5 rounded-[11px] bg-rose-500 hover:bg-rose-600 text-white text-[12.5px] font-bold transition-all shadow-md">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
