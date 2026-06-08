'use client';

import { useState, useEffect } from "react";
import { Plus, X, Search, MapPin, Calendar, Trash2, Filter, Edit, Image as ImageIcon, Check, ChevronRight, ChevronLeft, Loader2, Star, Waves, UtensilsCrossed, Dumbbell, FileText, Wifi, Wind, Coffee, Music, Anchor, Users } from "lucide-react";
import { toast } from "sonner";
import { resortApi } from "../../../lib/resortApi";
import { ImageUpload } from "../../../components/admin/ImageUpload";


const inputCls = "w-full px-4 py-3 bg-[#f4f7fb] border border-[#e2e8f0] rounded-[12px] text-[13px] font-medium text-[#041d3c] placeholder:text-gray-300 focus:outline-none focus:border-[#1a84ff]/60 focus:ring-2 focus:ring-[#1a84ff]/10 transition-all";
const labelCls = "block text-[11px] font-extrabold text-[#041d3c]/50 uppercase tracking-wider mb-1.5";



const COMMON_VILLA_FEATURES = ["Direct ocean access", "Private pool", "Glass floor panels", "Outdoor shower", "Jacuzzi", "Butler service", "Overwater hammock", "Sunset view", "Sunrise view"];
const COMMON_BED_TYPES = ["1 King Bed", "2 King Beds", "2 Twin Beds", "1 Queen Bed", "1 Sofa Bed"];

export default function AdminResorts() {
  const [resorts, setResorts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const [transferOptions, setTransferOptions] = useState<any[]>([]);
  const [facilityOptions, setFacilityOptions] = useState<any[]>([]);
  const [offerOptions, setOfferOptions] = useState<any[]>([]);

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [discountModalId, setDiscountModalId] = useState<string | null>(null);
  const [discountForm, setDiscountForm] = useState({ discount: '', offerPoster: '', offerPosterPublicId: '' });

  // Form State
  const [step, setStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({
    id: "", title: "", categoryIds: [], summary: "", location: "", transfer: "Seaplane Transfer", price: "", status: "active",
    tripAdvisorRating: "", tripAdvisorReviews: "", bookingScore: "", bookingReviews: "",
    heroImage: "", heroImagePublicId: "", packageImage: "", packageImagePublicId: "",
    facilities: [], offers: [], gallery: [], villas: [], restaurants: [], factSheets: []
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") || "" : "";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedResorts, fetchedCategories, fetchedTransfers, fetchedFacilities, fetchedOffers] = await Promise.all([
        resortApi.getAdminResorts(token),
        resortApi.getCategories(),
        resortApi.getTransferOptions(),
        resortApi.getFacilityOptions(),
        resortApi.getOfferOptions()
      ]);
      setResorts(fetchedResorts);
      setCategories(fetchedCategories);
      setTransferOptions(fetchedTransfers);
      setFacilityOptions(fetchedFacilities);
      setOfferOptions(fetchedOffers);
    } catch (err) {
      toast.error("Failed to load resort data");
    } finally {
      setIsLoading(false);
    }
  };

  const openWizard = async (resort: any = null) => {
    if (resort) {
      // Need to fetch full resort data for nested relations
      setIsLoading(true);
      try {
        const fullResort = await resortApi.getResort(resort.id);
        setIsEditing(true);
        setForm({
          ...fullResort,
          categoryIds: fullResort.categories?.map((c:any) => c.id) || [],
          price: fullResort.price.toString(),
          tripAdvisorRating: fullResort.tripAdvisorRating?.toString() || "",
          tripAdvisorReviews: fullResort.tripAdvisorReviews?.toString() || "",
          bookingScore: fullResort.bookingScore?.toString() || "",
          bookingReviews: fullResort.bookingReviews?.toString() || "",
          villas: fullResort.villas.map((v: any) => {
            const matchAdults = v.capacity?.match(/(\d+)\s+Adult/);
            const matchChildren = v.capacity?.match(/(\d+)\s+Child/);
            const matchInfants = v.capacity?.match(/(\d+)\s+Infant/);
            return {
              ...v,
              capacityAdults: matchAdults ? matchAdults[1] : "2",
              capacityChildren: matchChildren ? matchChildren[1] : "0",
              capacityInfants: matchInfants ? matchInfants[1] : "0",
              features: v.features.join(", ")
            };
          }),
          restaurants: fullResort.restaurants.map((r: any) => ({
            ...r,
            schedules: r.schedules.map((s: any) => {
              const [from, to] = (s.time || "").split(" - ");
              return { ...s, timeFrom: from || "07:00", timeTo: to || "10:30" };
            })
          }))
        });
      } catch (err) {
        toast.error("Failed to fetch resort details");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
      setForm({
        id: "", title: "", categoryId: categories[0]?.id || "", summary: "", location: "", transfer: "Seaplane Transfer", price: "", status: "active",
        tripAdvisorRating: "", tripAdvisorReviews: "", bookingScore: "", bookingReviews: "",
        heroImage: "", heroImagePublicId: "", packageImage: "", packageImagePublicId: "",
        facilities: [], offers: [], gallery: [], villas: [], restaurants: [], factSheets: []
      });
    }
    setStep(1);
    setIsWizardOpen(true);
  };

  const saveResort = async () => {
    try {
      const payload = {
        ...form,
        villas: form.villas.map((v: any) => ({
          ...v,
          capacity: `${v.capacityAdults || "2"} Adults, ${v.capacityChildren || "0"} Children, ${v.capacityInfants || "0"} Infants`,
          features: Array.isArray(v.features) ? v.features : v.features.split(",").map((s: string) => s.trim()).filter(Boolean)
        })),
        restaurants: form.restaurants.map((r: any) => ({
          ...r,
          schedules: r.schedules.map((s: any) => ({
            meal: s.meal,
            time: `${s.timeFrom || "07:00"} - ${s.timeTo || "10:30"}`
          }))
        }))
      };

      if (isEditing) {
        await resortApi.updateResort(token, form.id, payload);
        toast.success("Resort updated successfully");
      } else {
        await resortApi.createResort(token, payload);
        toast.success("Resort created successfully");
      }
      setIsWizardOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to save resort");
    }
  };

  const deleteResort = async (id: string) => {
    try {
      await resortApi.deleteResort(token, id);
      toast.success("Resort deleted");
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to delete resort");
    }
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "active" ? "inactive" : "active";
    try {
      await resortApi.toggleStatus(token, id, next);
      toast.success(`Status changed to ${next}`);
      setResorts(prev => prev.map(r => r.id === id ? { ...r, status: next } : r));
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const openDiscountModal = (resort: any) => {
    setDiscountForm({
      discount: resort.discount || '',
      offerPoster: resort.offerPoster || '',
      offerPosterPublicId: resort.offerPosterPublicId || ''
    });
    setDiscountModalId(resort.id);
  };

  const applyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountModalId) return;
    try {
      await resortApi.updateDiscount(
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

  const filtered = resorts.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "All" || r.category?.name === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-extrabold text-[#041d3c] ">Maldives Resorts</h2>
          <p className="text-[12px] text-gray-400 font-medium mt-0.5">Manage luxury resorts and villas</p>
        </div>
        <button
          onClick={() => openWizard()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#041d3c] hover:bg-[#1a84ff] text-white text-[12.5px] font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Resort
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-[16px] border border-[#e8edf4] px-5 py-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text" placeholder="Search resorts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f4f7fb] border border-[#e8edf4] rounded-[11px] text-[12.5px] font-medium"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 flex-1">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-2" />
          {["All", ...categories.map(c => c.name)].map(cat => (
            <button
              key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? "bg-[#041d3c] text-white border-[#041d3c]"
                  : "bg-white text-gray-500 border-[#e8edf4] hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#1a84ff] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(resort => (
            <div key={resort.id} className="bg-white rounded-[16px] border border-[#e8edf4] overflow-hidden group hover:border-[#1a84ff]/30 hover:shadow-[0_12px_32px_rgba(26,132,255,0.08)] transition-all">
              <div className="relative h-44 overflow-hidden">
                <img src={resort.packageImage || resort.heroImage || '/placeholder.jpg'} alt={resort.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-[6px] text-[#041d3c] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                  {resort.categories?.[0]?.name || 'Uncategorized'}
                </div>
                {resort.status === "inactive" && (
                  <div className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px]">Hidden</div>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="flex items-center gap-1.5 text-white/90 text-[11.5px] font-semibold">
                    <MapPin className="w-3 h-3 text-[#1a84ff]" /> {resort.location}
                  </div>
                  <div className="text-right text-white">
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-0.5">Price</p>
                    <p className="text-[15px] font-black leading-none">${resort.discount ? Math.round(resort.price * (1 - resort.discount / 100)) : resort.price}</p>
                    {resort.discount && <p className="text-[10px] line-through text-white/50">${resort.price}</p>}
                  </div>
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between h-[120px]">
                <div>
                  <h3 className="text-[#041d3c] font-bold text-[14.5px] leading-snug line-clamp-2">{resort.title}</h3>
                </div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#e8edf4]">
                  <button onClick={() => toggleStatus(resort.id, resort.status)} className={`text-[11px] font-bold px-3 py-1.5 rounded-[6px] transition-colors ${resort.status === 'active' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {resort.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openDiscountModal(resort)} className="w-8 h-8 rounded-[8px] bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-all" title="Manage Discount">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
                    </button>
                    <button onClick={() => openWizard(resort)} className="w-8 h-8 rounded-[8px] bg-[#f4f7fb] text-gray-500 flex items-center justify-center hover:bg-[#1a84ff] hover:text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(resort.id)} className="w-8 h-8 rounded-[8px] bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Wizard Modal ── */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-[#041d3c]/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-[800px] h-full shadow-[-10px_0_40px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#f0f4f9] flex items-center justify-between bg-white">
              <div>
                <h3 className="text-[20px] font-extrabold text-[#041d3c]">{isEditing ? 'Edit Resort' : 'Build Resort Package'}</h3>
                <p className="text-[13px] text-gray-500 font-medium mt-0.5">Step {step} of 6</p>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Stepper */}
            <div className="px-8 pt-5 pb-2">
              <div className="flex gap-2">
                {[1,2,3,4,5,6].map(s => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-[#1a84ff]' : 'bg-[#e8edf4]'}`} />
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                <span className={step >= 1 ? 'text-[#1a84ff]' : ''}>Basic</span>
                <span className={step >= 2 ? 'text-[#1a84ff]' : ''}>Ratings</span>
                <span className={step >= 3 ? 'text-[#1a84ff]' : ''}>Media</span>
                <span className={step >= 4 ? 'text-[#1a84ff]' : ''}>Villas</span>
                <span className={step >= 5 ? 'text-[#1a84ff]' : ''}>Restaurants</span>
                <span className={step >= 6 ? 'text-[#1a84ff]' : ''}>Extras</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-gray-200">
              
              {step === 1 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Categories</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#f8fafc] border border-[#e8edf4] p-4 rounded-[12px]">
                        {categories.map(c => (
                          <label key={c.id} className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.categoryIds?.includes(c.id)}
                              onChange={(e) => {
                                const newCatIds = e.target.checked 
                                  ? [...(form.categoryIds || []), c.id]
                                  : (form.categoryIds || []).filter((id: string) => id !== c.id);
                                setForm({...form, categoryIds: newCatIds});
                              }}
                              className="w-4 h-4 rounded-[4px] border-gray-300 text-[#1a84ff]"
                            />
                            <span className="text-[13px] font-semibold text-[#041d3c]">{c.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Resort Title</label>
                      <input type="text" placeholder="e.g. Soneva Jani" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>About This Resort</label>
                    <textarea rows={4} placeholder="Describe the resort experience..." value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} className={`${inputCls} resize-none`} />
                  </div>
                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <label className={labelCls}>Location</label>
                      <input type="text" placeholder="e.g. Noonu Atoll" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Transfer Method</label>
                      <div className="flex gap-2">
                        <select value={form.transfer} onChange={e => setForm({...form, transfer: e.target.value})} className={inputCls}>
                          <option value="">Select Transfer...</option>
                          {transferOptions.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                        <button type="button" onClick={() => {
                          const name = prompt("Enter new transfer method:");
                          if (name) {
                            resortApi.createTransferOption(token, { name }).then(opt => {
                              setTransferOptions([...transferOptions, opt]);
                              setForm({...form, transfer: opt.name});
                            }).catch(e => toast.error(e.message));
                          }
                        }} className="px-3 bg-gray-100 rounded-[12px] text-gray-500 hover:text-black font-bold transition-colors border border-[#e2e8f0]">+</button>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Starting Price ($)</label>
                      <input type="number" placeholder="e.g. 1500" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-extrabold text-[#041d3c]/50 uppercase tracking-wider">Deals & Offers</label>
                      <button type="button" onClick={() => {
                        const name = prompt("Enter new offer:");
                        if (name) {
                          resortApi.createOfferOption(token, { name }).then(opt => {
                            setOfferOptions([...offerOptions, opt]);
                            setForm({...form, offers: [...(form.offers || []), opt.name]});
                          }).catch(e => toast.error(e.message));
                        }
                      }} className="text-[#1a84ff] text-[11px] font-bold hover:underline">+ Add New Offer</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 bg-[#f8fafc] border border-[#e8edf4] p-4 rounded-[12px]">
                      {offerOptions.map(offer => (
                        <label key={offer.id} className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.offers?.includes(offer.name)}
                            onChange={(e) => {
                              const newOffers = e.target.checked 
                                ? [...(form.offers || []), offer.name]
                                : form.offers.filter((o: string) => o !== offer.name);
                              setForm({...form, offers: newOffers});
                            }}
                            className="w-4 h-4 rounded-[4px] border-gray-300 text-[#1a84ff] focus:ring-[#1a84ff]"
                          />
                          <span className="text-[13px] font-semibold text-[#041d3c]">{offer.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="p-6 bg-emerald-50 rounded-[16px] border border-emerald-100">
                    <div className="mb-5">
                      <img src="/images/tripadvisor.png" alt="TripAdvisor Ratings" className="h-8 w-auto object-contain" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>Rating Score (e.g. 5.0)</label>
                        <input type="number" step="0.1" value={form.tripAdvisorRating} onChange={e => setForm({...form, tripAdvisorRating: e.target.value})} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Review Count (e.g. 1200)</label>
                        <input type="number" value={form.tripAdvisorReviews} onChange={e => setForm({...form, tripAdvisorReviews: e.target.value})} className={inputCls} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-[16px] border border-blue-100">
                    <div className="mb-5">
                      <img src="/images/booking.com.png" alt="Booking.com Ratings" className="h-8 w-auto object-contain" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>Rating Score (e.g. 9.8)</label>
                        <input type="number" step="0.1" value={form.bookingScore} onChange={e => setForm({...form, bookingScore: e.target.value})} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Review Count (e.g. 850)</label>
                        <input type="number" value={form.bookingReviews} onChange={e => setForm({...form, bookingReviews: e.target.value})} className={inputCls} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls}>Hero Image (Wide Header)</label>
                      <ImageUpload
                        value={form.heroImage}
                        onChange={(url, publicId) => setForm({...form, heroImage: url, heroImagePublicId: publicId})}
                        onRemove={() => setForm({...form, heroImage: "", heroImagePublicId: ""})}
                        folder="simplifly/resorts/hero"
                        requireLandscape={true}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Package Card Image</label>
                      <ImageUpload
                        value={form.packageImage}
                        onChange={(url, publicId) => setForm({...form, packageImage: url, packageImagePublicId: publicId})}
                        onRemove={() => setForm({...form, packageImage: "", packageImagePublicId: ""})}
                        folder="simplifly/resorts/cards"
                        requireLandscape={true}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Gallery Images</label>
                    <div className="bg-[#f8fafc] border border-[#e8edf4] rounded-[16px] p-5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {form.gallery?.map((img: any, i: number) => (
                          <div key={i} className="relative aspect-square rounded-[12px] overflow-hidden group">
                            <img src={img.url || img.src} className="w-full h-full object-cover" />
                            <button onClick={() => {
                              const newG = [...form.gallery];
                              newG.splice(i, 1);
                              setForm({...form, gallery: newG});
                            }} className="absolute top-2 right-2 bg-rose-500 text-white rounded-[6px] p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        ))}
                        <div className="aspect-square">
                          <ImageUpload
                            value=""
                            onChange={(url, publicId) => {
                              setForm({...form, gallery: [...(form.gallery||[]), { url, publicId }]});
                            }}
                            onRemove={() => {}}
                            folder="simplifly/resorts/gallery"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] text-gray-500 font-medium">Add all available villas and their specifications.</p>
                    <button onClick={() => setForm({...form, villas: [...(form.villas||[]), { title: "", description: "", size: "", capacity: "", bedType: "", features: "", images: [] }]})} className="px-3 py-1.5 bg-[#f4f7fb] text-[#1a84ff] text-[11px] font-bold uppercase tracking-wider rounded-[8px] hover:bg-[#1a84ff] hover:text-white transition-colors">
                      + Add Villa
                    </button>
                  </div>
                  
                  {(!form.villas || form.villas.length === 0) ? (
                    <div className="text-center py-10 bg-[#f8fafc] border border-dashed border-[#e8edf4] rounded-[16px]">
                      <span className="text-gray-400 text-[13px] font-semibold">No villas added yet</span>
                    </div>
                  ) : (
                    form.villas.map((villa: any, idx: number) => (
                      <div key={idx} className="bg-white border border-[#e8edf4] rounded-[16px] p-5 relative shadow-sm">
                        <button onClick={() => {
                          const newV = [...form.villas];
                          newV.splice(idx, 1);
                          setForm({...form, villas: newV});
                        }} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <h4 className="text-[14px] font-bold text-[#041d3c] mb-4">Villa {idx + 1}</h4>
                          <div className="grid grid-cols-2 gap-4 mb-4 items-start">
                          <div>
                            <label className={labelCls}>Villa Title</label>
                            <input type="text" placeholder="e.g. Overwater Pool Villa" value={villa.title} onChange={e => {
                              const newV = [...form.villas]; newV[idx].title = e.target.value; setForm({...form, villas: newV});
                            }} className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Bed Type</label>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {COMMON_BED_TYPES.map(bed => {
                                const isChecked = typeof villa.bedType === 'string' 
                                  ? villa.bedType.includes(bed) 
                                  : Array.isArray(villa.bedType) ? villa.bedType.includes(bed) : false;
                                return (
                                  <label key={bed} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={isChecked} onChange={e => {
                                      let currentBeds = typeof villa.bedType === 'string' ? villa.bedType.split(',').map((s:string)=>s.trim()).filter(Boolean) : (villa.bedType || []);
                                      if (e.target.checked) currentBeds.push(bed);
                                      else currentBeds = currentBeds.filter((b:string) => b !== bed);
                                      const newV = [...form.villas]; newV[idx].bedType = currentBeds.join(', '); setForm({...form, villas: newV});
                                    }} className="w-3.5 h-3.5 rounded-[4px] border-gray-300 text-[#1a84ff]" />
                                    <span className="text-[12px] font-medium text-[#041d3c]">{bed}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <input type="text" placeholder="Add custom beds (comma separated)..." value={
                              typeof villa.bedType === 'string' 
                                ? villa.bedType.split(',').map((s:string)=>s.trim()).filter((s:string) => !COMMON_BED_TYPES.includes(s)).join(', ')
                                : Array.isArray(villa.bedType) ? villa.bedType.filter((s:string) => !COMMON_BED_TYPES.includes(s)).join(', ') : ''
                            } onChange={e => {
                              const currentBeds = typeof villa.bedType === 'string' ? villa.bedType.split(',').map((s:string)=>s.trim()).filter(Boolean) : (villa.bedType || []);
                              const predefined = currentBeds.filter((b:string) => COMMON_BED_TYPES.includes(b));
                              const custom = e.target.value.split(',').map(s=>s.trim()).filter(Boolean);
                              const newV = [...form.villas]; newV[idx].bedType = [...predefined, ...custom].join(', '); setForm({...form, villas: newV});
                            }} className={inputCls} />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className={labelCls}>Short Description</label>
                          <textarea rows={2} value={villa.description} onChange={e => {
                            const newV = [...form.villas]; newV[idx].description = e.target.value; setForm({...form, villas: newV});
                          }} className={`${inputCls} resize-none`} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className={labelCls}>Room Size (sqm)</label>
                            <input type="text" placeholder="e.g. 150 sqm" value={villa.size} onChange={e => {
                              const newV = [...form.villas]; newV[idx].size = e.target.value; setForm({...form, villas: newV});
                            }} className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Capacity</label>
                            <div className="flex gap-2">
                              <select value={villa.capacityAdults || "2"} onChange={e => {
                                const newV = [...form.villas]; newV[idx].capacityAdults = e.target.value; setForm({...form, villas: newV});
                              }} className={inputCls}>
                                {[1,2,3,4,5,6].map(n => <option key={n} value={String(n)}>{n} Adult{n>1?'s':''}</option>)}
                              </select>
                              <select value={villa.capacityChildren || "0"} onChange={e => {
                                const newV = [...form.villas]; newV[idx].capacityChildren = e.target.value; setForm({...form, villas: newV});
                              }} className={inputCls}>
                                {[0,1,2,3,4].map(n => <option key={n} value={String(n)}>{n} Child{n!==1?'ren':''}</option>)}
                              </select>
                              <select value={villa.capacityInfants || "0"} onChange={e => {
                                const newV = [...form.villas]; newV[idx].capacityInfants = e.target.value; setForm({...form, villas: newV});
                              }} className={inputCls}>
                                {[0,1,2,3,4].map(n => <option key={n} value={String(n)}>{n} Infant{n!==1?'s':''}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className={labelCls}>Features</label>
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {COMMON_VILLA_FEATURES.map(feat => {
                              const isChecked = typeof villa.features === 'string' 
                                ? villa.features.includes(feat) 
                                : Array.isArray(villa.features) ? villa.features.includes(feat) : false;
                              return (
                                <label key={feat} className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={isChecked} onChange={e => {
                                    let currentFeats = typeof villa.features === 'string' ? villa.features.split(',').map((s:string)=>s.trim()).filter(Boolean) : (villa.features || []);
                                    if (e.target.checked) currentFeats.push(feat);
                                    else currentFeats = currentFeats.filter((f:string) => f !== feat);
                                    const newV = [...form.villas]; newV[idx].features = currentFeats.join(', '); setForm({...form, villas: newV});
                                  }} className="w-3.5 h-3.5 rounded-[4px] border-gray-300 text-[#1a84ff]" />
                                  <span className="text-[12px] font-medium text-[#041d3c]">{feat}</span>
                                </label>
                              );
                            })}
                          </div>
                          <input type="text" placeholder="Add custom features (comma separated)..." value={
                            typeof villa.features === 'string' 
                              ? villa.features.split(',').map((s:string)=>s.trim()).filter((s:string) => !COMMON_VILLA_FEATURES.includes(s)).join(', ')
                              : Array.isArray(villa.features) ? villa.features.filter((s:string) => !COMMON_VILLA_FEATURES.includes(s)).join(', ') : ''
                          } onChange={e => {
                            const currentFeats = typeof villa.features === 'string' ? villa.features.split(',').map((s:string)=>s.trim()).filter(Boolean) : (villa.features || []);
                            const predefined = currentFeats.filter((f:string) => COMMON_VILLA_FEATURES.includes(f));
                            const custom = e.target.value.split(',').map(s=>s.trim()).filter(Boolean);
                            const newV = [...form.villas]; newV[idx].features = [...predefined, ...custom].join(', '); setForm({...form, villas: newV});
                          }} className={inputCls} />
                        </div>
                        
                        <div>
                          <label className={labelCls}>Villa Images (Rotating preview)</label>
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {villa.images?.map((img: any, imgIdx: number) => (
                              <div key={imgIdx} className="w-24 h-24 shrink-0 relative rounded-[8px] overflow-hidden group">
                                <img src={img.url || img.src} className="w-full h-full object-cover" />
                                <button onClick={() => {
                                  const newV = [...form.villas]; newV[idx].images.splice(imgIdx, 1); setForm({...form, villas: newV});
                                }} className="absolute top-1 right-1 bg-rose-500 text-white rounded-[4px] p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3"/></button>
                              </div>
                            ))}
                            <div className="w-24 h-24 shrink-0">
                              <ImageUpload
                                value=""
                                onChange={(url, publicId) => {
                                  const newV = [...form.villas];
                                  if(!newV[idx].images) newV[idx].images = [];
                                  newV[idx].images.push({ url, publicId });
                                  setForm({...form, villas: newV});
                                }}
                                onRemove={() => {}}
                                folder="simplifly/resorts/villas"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] text-gray-500 font-medium">Add restaurants and their dining schedules.</p>
                    <button onClick={() => setForm({...form, restaurants: [...(form.restaurants||[]), { title: "", description: "", schedules: [] }]})} className="px-3 py-1.5 bg-[#f4f7fb] text-[#1a84ff] text-[11px] font-bold uppercase tracking-wider rounded-[8px] hover:bg-[#1a84ff] hover:text-white transition-colors">
                      + Add Restaurant
                    </button>
                  </div>

                  {(!form.restaurants || form.restaurants.length === 0) ? (
                    <div className="text-center py-10 bg-[#f8fafc] border border-dashed border-[#e8edf4] rounded-[16px]">
                      <span className="text-gray-400 text-[13px] font-semibold">No restaurants added yet</span>
                    </div>
                  ) : (
                    form.restaurants.map((rest: any, idx: number) => (
                      <div key={idx} className="bg-white border border-[#e8edf4] rounded-[16px] p-5 relative shadow-sm">
                        <button onClick={() => {
                          const newR = [...form.restaurants];
                          newR.splice(idx, 1);
                          setForm({...form, restaurants: newR});
                        }} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <h4 className="text-[14px] font-bold text-[#041d3c] mb-4">Restaurant {idx + 1}</h4>
                        
                        <div className="mb-4">
                          <label className={labelCls}>Restaurant Name</label>
                          <input type="text" value={rest.title} onChange={e => {
                            const newR = [...form.restaurants]; newR[idx].title = e.target.value; setForm({...form, restaurants: newR});
                          }} className={inputCls} />
                        </div>
                        <div className="mb-4">
                          <label className={labelCls}>Description</label>
                          <textarea rows={2} value={rest.description} onChange={e => {
                            const newR = [...form.restaurants]; newR[idx].description = e.target.value; setForm({...form, restaurants: newR});
                          }} className={`${inputCls} resize-none`} />
                        </div>
                        <div className="mb-4">
                          <label className={labelCls}>Restaurant Image</label>
                          <div className="w-full max-w-sm">
                            <ImageUpload
                              value={rest.image || ""}
                              onChange={(url, publicId) => {
                                const newR = [...form.restaurants];
                                newR[idx].image = url;
                                newR[idx].imagePublicId = publicId;
                                setForm({...form, restaurants: newR});
                              }}
                              onRemove={() => {
                                const newR = [...form.restaurants];
                                newR[idx].image = "";
                                newR[idx].imagePublicId = "";
                                setForm({...form, restaurants: newR});
                              }}
                              folder="simplifly/resorts/restaurants"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className={labelCls}>Meal Timings</label>
                            <button onClick={() => {
                                  const newR = [...form.restaurants];
                                  if(!newR[idx].schedules) newR[idx].schedules = [];
                                  newR[idx].schedules.push({ meal: "Breakfast", timeFrom: "07:00", timeTo: "10:30" });
                                  setForm({...form, restaurants: newR});
                                }} className="text-[11px] font-bold text-[#1a84ff]">+ Add Timing</button>
                              </div>
                              
                              <div className="space-y-2">
                                {rest.schedules?.map((sch: any, sIdx: number) => (
                                  <div key={sIdx} className="flex gap-2 items-center">
                                    <select value={sch.meal} onChange={e => {
                                      const newR = [...form.restaurants]; newR[idx].schedules[sIdx].meal = e.target.value; setForm({...form, restaurants: newR});
                                    }} className={`${inputCls} py-2 !w-1/3`}>
                                      <option>Breakfast</option>
                                      <option>Lunch</option>
                                      <option>Dinner</option>
                                      <option>All Day Dining</option>
                                    </select>
                                    <div className="flex items-center gap-1.5 flex-1">
                                      <input type="time" value={sch.timeFrom || "07:00"} onChange={e => {
                                        const newR = [...form.restaurants]; newR[idx].schedules[sIdx].timeFrom = e.target.value; setForm({...form, restaurants: newR});
                                      }} className={`${inputCls} py-2 text-center`} />
                                      <span className="text-gray-400 font-bold text-[11px]">to</span>
                                      <input type="time" value={sch.timeTo || "10:30"} onChange={e => {
                                        const newR = [...form.restaurants]; newR[idx].schedules[sIdx].timeTo = e.target.value; setForm({...form, restaurants: newR});
                                      }} className={`${inputCls} py-2 text-center`} />
                                    </div>
                                    <button onClick={() => {
                                      const newR = [...form.restaurants]; newR[idx].schedules.splice(sIdx, 1); setForm({...form, restaurants: newR});
                                    }} className="text-rose-400 p-2 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                                ))}
                              </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className={labelCls}>Luxury Facilities</label>
                        <p className="text-[12px] text-gray-500 font-medium">Select all facilities available at this resort.</p>
                      </div>
                      <button type="button" onClick={() => {
                        const name = prompt("Enter new facility:");
                        if (name) {
                          resortApi.createFacilityOption(token, { name }).then(opt => {
                            setFacilityOptions([...facilityOptions, opt]);
                            setForm({...form, facilities: [...(form.facilities || []), opt.name]});
                          }).catch(e => toast.error(e.message));
                        }
                      }} className="text-[#1a84ff] text-[11px] font-bold hover:underline">+ Add New Facility</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {facilityOptions.map(fac => (
                        <label key={fac.id} className="flex items-center gap-3 p-3 rounded-[12px] border border-[#e8edf4] cursor-pointer hover:bg-[#f8fafc] transition-colors">
                          <input
                            type="checkbox"
                            checked={form.facilities?.includes(fac.name)}
                            onChange={(e) => {
                              const newF = e.target.checked 
                                ? [...(form.facilities || []), fac.name]
                                : form.facilities.filter((f: string) => f !== fac.name);
                              setForm({...form, facilities: newF});
                            }}
                            className="w-4 h-4 rounded-[4px] border-gray-300 text-[#1a84ff] focus:ring-[#1a84ff]"
                          />
                          <span className="text-[12.5px] font-bold text-[#041d3c]">{fac.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#e8edf4]">
                    <label className={labelCls}>Resort Fact Sheet (PDF/Image)</label>
                    <div className="w-full max-w-sm">
                       <ImageUpload
                          value={form.factSheets?.[0]?.url || ""}
                          onChange={(url, publicId) => setForm({...form, factSheets: [{ name: "Fact Sheet", url, publicId }]})}
                          onRemove={() => setForm({...form, factSheets: []})}
                          folder="simplifly/resorts/docs"
                        />
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-[#f0f4f9] flex items-center justify-between bg-white">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-bold text-gray-500 disabled:opacity-30 hover:text-[#041d3c] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              
              <div className="flex gap-2">
                {step < 6 ? (
                  <button onClick={() => setStep(s => s + 1)} className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-[12px] bg-[#041d3c] text-white text-[12.5px] font-bold hover:bg-[#062c5b] transition-all">
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={saveResort} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[12px] bg-emerald-500 text-white text-[12.5px] font-bold hover:bg-emerald-600 transition-all shadow-sm">
                    <Check className="w-4 h-4" /> {isEditing ? 'Save Changes' : 'Publish Resort'}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-[#041d3c]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-md p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-[20px] font-black text-[#041d3c] mb-2">Delete Resort?</h3>
            <p className="text-[13px] text-gray-500 font-medium mb-8">This action cannot be undone. This will permanently remove the resort and all its related content from the system.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 bg-[#f4f7fb] text-gray-600 text-[13px] font-bold rounded-[12px] hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={() => deleteResort(deleteConfirmId)} className="flex-1 py-3 bg-rose-500 text-white text-[13px] font-bold rounded-[12px] hover:bg-rose-600 transition-colors shadow-sm">Delete Forever</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Discount Modal ── */}
      {discountModalId && (
        <div className="fixed inset-0 bg-[#041d3c]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#f0f4f9] flex justify-between items-center bg-[#f8fafc]">
              <div>
                <h3 className="text-[16px] font-extrabold text-[#041d3c]">Manage Offer & Discount</h3>
                <p className="text-[11px] text-gray-500 font-medium">Add a percentage discount and an offer poster.</p>
              </div>
              <button onClick={() => setDiscountModalId(null)} className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-[8px] transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={applyDiscount} className="p-6">
              <div className="mb-5">
                <label className={labelCls}>Discount Percentage (%)</label>
                <div className="relative">
                  <input
                    type="number" min="0" max="100" placeholder="e.g. 15"
                    value={discountForm.discount}
                    onChange={e => setDiscountForm({...discountForm, discount: e.target.value})}
                    className={inputCls}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[13px]">%</div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className={labelCls}>Offer Poster (Optional CTA)</label>
                <p className="text-[10px] text-gray-400 mb-2 leading-relaxed">Upload a 2:1 ratio flyer for this offer to be displayed in the homepage CTA carousel.</p>
                <ImageUpload
                  value={discountForm.offerPoster}
                  onChange={(url, publicId) => setDiscountForm({...discountForm, offerPoster: url, offerPosterPublicId: publicId})}
                  onRemove={() => setDiscountForm({...discountForm, offerPoster: "", offerPosterPublicId: ""})}
                  folder="simplifly/offers"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setDiscountModalId(null)} className="flex-1 py-3 bg-[#f4f7fb] text-gray-600 text-[12.5px] font-bold rounded-[12px] hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#1a84ff] text-white text-[12.5px] font-bold rounded-[12px] hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/25">Apply Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
