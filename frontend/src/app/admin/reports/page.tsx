'use client';

import { useState, useEffect } from "react";
import { FileDown, Hotel, Map, Search, Loader2, Eye, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { resortApi } from "../../../lib/resortApi";
import { tourApi } from "../../../lib/tourApi";
import { generateResortBrochure, generateTourBrochure } from "../../../lib/pdfGenerator";

type Tab = 'resorts' | 'tours';

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState<Tab>('resorts');
  const [resorts, setResorts] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || '' : '';

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [r, t] = await Promise.all([
          resortApi.getAdminResorts(token),
          tourApi.getAdminTours(token),
        ]);
        setResorts(r);
        setTours(t);
      } catch {
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleGenerateResort = async (resort: any) => {
    setGeneratingId(resort.id);
    toast.info(`Preparing brochure for "${resort.title}"…`);
    try {
      const full = await resortApi.getResort(resort.id);
      await generateResortBrochure(full);
      toast.success(`Brochure downloaded successfully!`);
    } catch (e: any) {
      toast.error('Failed to generate brochure. Please try again.');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleGenerateTour = async (tour: any) => {
    setGeneratingId(tour.id);
    toast.info(`Preparing brochure for "${tour.title}"…`);
    try {
      const full = await tourApi.getTour(tour.id);
      await generateTourBrochure(full);
      toast.success(`Brochure downloaded successfully!`);
    } catch (e: any) {
      toast.error('Failed to generate brochure. Please try again.');
    } finally {
      setGeneratingId(null);
    }
  };

  const filteredResorts = resorts.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTours = tours.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.destinations || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: 'resorts', label: 'Maldives Resorts', icon: Hotel, count: resorts.length },
    { key: 'tours',   label: 'Sri Lanka Tours',  icon: Map,   count: tours.length },
  ];

  return (
    <div className="space-y-6 max-w-[1200px]">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-extrabold text-[#041d3c]">Client Brochures</h2>
          <div className="text-[12px] text-gray-400 font-medium mt-0.5">Generate & download professional PDF brochures to send to clients</div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f4f7fb] border border-[#e8edf4] rounded-[12px] text-[12px] font-semibold text-gray-500">
          <FileDown className="w-4 h-4 text-[#1a84ff]" />
          Powered by jsPDF
        </div>
      </div>

      {/* ── Info Banner ── */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-[14px] px-5 py-4">
        <AlertCircle className="w-4 h-4 text-[#1a84ff] shrink-0 mt-0.5" />
        <div className="text-[12.5px] text-[#1a84ff] font-medium leading-relaxed">
          Click <strong>"Generate PDF"</strong> next to any Resort or Tour to instantly download a professionally branded client brochure. The PDF includes all images, villa details, itinerary, and your Simplifly contact information.
        </div>
      </div>

      {/* ── Tabs + Search ── */}
      <div className="bg-white rounded-[16px] border border-[#e8edf4] px-5 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          {tabs.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[12.5px] font-bold transition-all border ${
                activeTab === key
                  ? 'bg-[#041d3c] text-white border-[#041d3c] shadow-sm'
                  : 'bg-[#f4f7fb] text-gray-500 border-[#e8edf4] hover:border-[#041d3c]/30 hover:text-[#041d3c]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === key ? 'bg-white/20 text-white' : 'bg-white text-gray-400 border border-[#e8edf4]'}`}>{count}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}…`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f4f7fb] border border-[#e8edf4] rounded-[11px] text-[12.5px] font-medium focus:outline-none focus:border-[#1a84ff]/50"
          />
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="py-20 text-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#1a84ff]" />
          <div className="text-[13px] font-semibold">Loading data…</div>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-[#e8edf4] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2.5fr_1.5fr_1fr_120px] gap-4 px-6 py-3.5 bg-[#f8fafc] border-b border-[#e8edf4] text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-gray-400">
            <span>{activeTab === 'resorts' ? 'Resort' : 'Tour Package'}</span>
            <span>{activeTab === 'resorts' ? 'Location' : 'Category'}</span>
            <span>Price</span>
            <span className="text-right">Brochure</span>
          </div>

          <div className="divide-y divide-[#f0f4f9]">
            {activeTab === 'resorts' && filteredResorts.map(resort => (
              <div key={resort.id} className="grid grid-cols-[2.5fr_1.5fr_1fr_120px] gap-4 px-6 py-4 items-center hover:bg-[#fafbfd] transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-[10px] overflow-hidden shrink-0 bg-gray-100">
                    {resort.packageImage && <img src={resort.packageImage} alt={resort.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[#041d3c] truncate">{resort.title}</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${resort.status === 'active' ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                      {resort.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
                <div className="text-[12.5px] font-semibold text-gray-500 truncate">📍 {resort.location}</div>
                <div className="text-[13.5px] font-extrabold text-[#041d3c]">€{Number(resort.price).toLocaleString()}</div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleGenerateResort(resort)}
                    disabled={generatingId === resort.id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#041d3c] hover:bg-[#1a84ff] text-white text-[11.5px] font-bold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {generatingId === resort.id ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Building…</>
                    ) : (
                      <><Download className="w-3.5 h-3.5" /> PDF</>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'tours' && filteredTours.map(tour => (
              <div key={tour.id} className="grid grid-cols-[2.5fr_1.5fr_1fr_120px] gap-4 px-6 py-4 items-center hover:bg-[#fafbfd] transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-[10px] overflow-hidden shrink-0 bg-gray-100">
                    {tour.packageImage && <img src={tour.packageImage} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[#041d3c] truncate">{tour.title}</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">{tour.nights}N / {tour.days}D</div>
                  </div>
                </div>
                <div className="text-[12.5px] font-semibold text-gray-500 truncate">{tour.category?.name || '—'}</div>
                <div className="text-[13.5px] font-extrabold text-[#041d3c]">
                  €{tour.discount ? Math.round(tour.price * (1 - tour.discount / 100)).toLocaleString() : Number(tour.price).toLocaleString()}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleGenerateTour(tour)}
                    disabled={generatingId === tour.id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#041d3c] hover:bg-[#1a84ff] text-white text-[11.5px] font-bold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {generatingId === tour.id ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Building…</>
                    ) : (
                      <><Download className="w-3.5 h-3.5" /> PDF</>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {((activeTab === 'resorts' && filteredResorts.length === 0) ||
              (activeTab === 'tours'   && filteredTours.length   === 0)) && (
              <div className="py-16 text-center">
                <FileDown className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <div className="text-[13px] font-bold text-gray-300">No results found</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
