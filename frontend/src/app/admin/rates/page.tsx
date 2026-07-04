'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Tag, ChevronDown, Plus, X, Trash2, Download,
  Loader2, AlertCircle, MoveUp, MoveDown, Save, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { resortApi }   from '../../../lib/resortApi';
import { getRates, saveRates } from '../../../lib/ratesApi';
import {
  generateResortBrochureWithRates,
  RatesPageData,
} from '../../../lib/pdfGenerator';

// ══════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════
type Period = { from: string; to: string };

type SeasonRow = {
  id:     string;
  period: Period;
  prices: string[];
};

type VillaGroup = {
  id:       string;
  villaId:  string;
  villaName: string;
  rows:     SeasonRow[];
};

type TransferRow = { id: string; label: string; value: string };

type RatesForm = {
  resortId:        string;
  resort:          any | null;
  pageTitle:       string;
  bookBefore:      string;
  currency:        string;
  nightColumns:    string[];
  villaGroups:     VillaGroup[];
  transferDetails: TransferRow[];
  mealPlan:        string;
  inclusions:      string[];
  specialBenefits: string[];
};

// ══════════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════════
const MAX_COLUMNS = 6;
const CURRENCIES  = ['$', '€', '£'];
const MEAL_PLANS  = ['Half Board', 'Full Board', 'All Inclusive'];
const DEFAULT_COLS = ['4 Nights', '5 Nights', '6 Nights', '7 Nights', 'Extra Night Rate'];
const DEFAULT_INCL = [
  'Round Trip Speed Boat Transfer from Airport to Resort & Resort to Airport',
  'Half Board Meal Plan',
  'All Taxes',
];

// ── Auto-fill transfer from resort.transfer string ─────────────────
function buildTransferRows(transfer: string): TransferRow[] {
  if (!transfer) return [{ id: uid(), label: 'Transfer Method', value: '' }];
  const rows: TransferRow[] = [{ id: uid(), label: 'Transfer Method', value: transfer }];
  if (/speedboat|speed boat/i.test(transfer)) {
    rows.push({ id: uid(), label: 'Duration', value: '±15 min' });
  } else if (/seaplane/i.test(transfer)) {
    rows.push({ id: uid(), label: 'Duration', value: '±35 min' });
  }
  rows.push({ id: uid(), label: 'Return Transfer', value: 'Included' });
  return rows;
}

// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════
const uid = () => crypto.randomUUID();

const emptyRow = (colCount: number): SeasonRow => ({
  id: uid(), period: { from: '', to: '' }, prices: Array(colCount).fill(''),
});

const emptyGroup = (villaId: string, villaName: string, colCount: number): VillaGroup => ({
  id: uid(), villaId, villaName, rows: [emptyRow(colCount)],
});

const buildEmptyForm = (): RatesForm => ({
  resortId: '', resort: null,
  pageTitle:       'Special Rates for 2 Adults on Single or Double Sharing Basis',
  bookBefore:      '',
  currency:        '$',
  nightColumns:    [...DEFAULT_COLS],
  villaGroups:     [],
  transferDetails: [{ id: uid(), label: 'Transfer Method', value: '' }],
  mealPlan:        'Half Board',
  inclusions:      [...DEFAULT_INCL],
  specialBenefits: [],
});

// Date display helper (ISO → "01 Jun 2026")
const fmtDisplay = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ══════════════════════════════════════════════════════════════════
// STYLE HELPERS
// ══════════════════════════════════════════════════════════════════
const inputCls = [
  'w-full px-3 py-2.5 bg-[#f4f7fb] border border-[#e2e8f0] rounded-[10px]',
  'text-[12px] font-medium text-[#041d3c] placeholder:text-gray-300',
  'focus:outline-none focus:border-[#1a84ff]/60 focus:ring-2 focus:ring-[#1a84ff]/10 transition-all',
].join(' ');

const labelCls = 'block text-[10px] font-extrabold text-[#041d3c]/50 uppercase tracking-wider mb-1';
const sectionCard = 'bg-white rounded-[16px] border border-[#e2e8f0] p-6';
const sectionTitle = 'text-[12px] font-black text-[#041d3c] uppercase tracking-wider mb-1';

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export default function AdminRatesPage() {
  const [form,              setForm]             = useState<RatesForm>(buildEmptyForm());
  const [allResorts,        setAllResorts]        = useState<any[]>([]);
  const [loadingResorts,    setLoadingResorts]    = useState(true);
  const [loadingResortData, setLoadingResortData] = useState(false);
  const [generating,        setGenerating]        = useState(false);
  const [saving,            setSaving]            = useState(false);
  const [lastSaved,         setLastSaved]         = useState<string | null>(null);
  const [resortSearch,      setResortSearch]      = useState('');
  const [dropdownOpen,      setDropdownOpen]      = useState(false);
  const [editingColIdx,     setEditingColIdx]     = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || '' : '';

  // ── Load resort list ─────────────────────────────────────────────
  useEffect(() => {
    resortApi.getAdminResorts(token)
      .then((data: any[]) =>
        setAllResorts([...data].sort((a, b) => a.title.localeCompare(b.title)))
      )
      .catch(() => toast.error('Failed to load resorts. Please refresh.'))
      .finally(() => setLoadingResorts(false));
  }, [token]);

  // ── Select resort & load saved rates ────────────────────────────
  const handleSelectResort = useCallback(async (basic: any) => {
    if (form.villaGroups.length > 0) {
      if (!confirm('Changing resort will clear unsaved local changes. Continue?')) return;
    }
    setDropdownOpen(false);
    setResortSearch('');
    setLoadingResortData(true);
    setLastSaved(null);
    try {
      // Load full resort details and saved rates in parallel
      const [full, saved] = await Promise.all([
        resortApi.getResort(basic.id),
        getRates(basic.id, token).catch(() => null),
      ]);

      if (saved) {
        // Restore saved rates — map from DB format to local state format
        setLastSaved(saved.updatedAt);
        setForm({
          resortId:   full.id,
          resort:     full,
          pageTitle:  saved.pageTitle,
          bookBefore: saved.bookBefore  || '',
          currency:   saved.currency,
          nightColumns: saved.nightColumns,
          villaGroups: (saved.villaGroups as any[]).map(g => ({
            id:        uid(),
            villaId:   g.villaId,
            villaName: g.villaName,
            rows: (g.rows as any[]).map(r => ({
              id:     uid(),
              period: { from: r.period?.from || '', to: r.period?.to || '' },
              prices: r.prices,
            })),
          })),
          transferDetails: (saved.transferDetails as any[]).map(t => ({
            id: uid(), label: t.label, value: t.value,
          })),
          mealPlan:        saved.mealPlan        || 'Half Board',
          inclusions:      saved.inclusions,
          specialBenefits: saved.specialBenefits,
        });
        toast.success('Saved rates loaded for this resort.');
      } else {
        // No saved data — start fresh with auto-filled transfer
        setForm({
          ...buildEmptyForm(),
          resortId:        full.id,
          resort:          full,
          transferDetails: buildTransferRows(full.transfer || ''),
        });
      }
    } catch {
      toast.error('Failed to load resort data. Please try again.');
    } finally {
      setLoadingResortData(false);
    }
  }, [form.villaGroups.length, token]);

  // ══════════════════════════════════════════════════════════════════
  // FORM BUILDERS — serialise local state → API / PDF shape
  // ══════════════════════════════════════════════════════════════════
  const buildSavePayload = () => ({
    pageTitle:       form.pageTitle.trim(),
    bookBefore:      form.bookBefore || null,
    currency:        form.currency,
    nightColumns:    form.nightColumns,
    villaGroups:     form.villaGroups.map(g => ({
      villaId:   g.villaId,
      villaName: g.villaName,
      rows: g.rows.map(r => ({ period: r.period, prices: r.prices })),
    })),
    transferDetails: form.transferDetails.map(({ label, value }) => ({ label, value })),
    mealPlan:        form.mealPlan || null,
    inclusions:      form.inclusions.filter(s => s.trim()),
    specialBenefits: form.specialBenefits.filter(s => s.trim()),
  });

  const buildPdfPayload = (): RatesPageData => ({
    ...buildSavePayload(),
    bookBefore:   form.bookBefore || null,
    mealPlan:     form.mealPlan || null,
    transferDetails: form.transferDetails.map(({ label, value }) => ({ label, value })),
  });

  // ══════════════════════════════════════════════════════════════════
  // COLUMN MANAGEMENT
  // ══════════════════════════════════════════════════════════════════
  const addColumn = () => {
    if (form.nightColumns.length >= MAX_COLUMNS) {
      toast.error(`Maximum ${MAX_COLUMNS} pricing columns allowed.`);
      return;
    }
    setForm(p => ({
      ...p,
      nightColumns: [...p.nightColumns, 'New Column'],
      villaGroups:  p.villaGroups.map(g => ({
        ...g, rows: g.rows.map(r => ({ ...r, prices: [...r.prices, ''] })),
      })),
    }));
  };

  const removeColumn = (ci: number) => {
    if (form.nightColumns.length <= 1) { toast.error('At least one pricing column required.'); return; }
    const hasData = form.villaGroups.some(g => g.rows.some(r => r.prices[ci]?.trim()));
    if (hasData && !confirm('Deleting this column will remove all prices in it. Continue?')) return;
    setForm(p => ({
      ...p,
      nightColumns: p.nightColumns.filter((_, i) => i !== ci),
      villaGroups:  p.villaGroups.map(g => ({
        ...g, rows: g.rows.map(r => ({ ...r, prices: r.prices.filter((_, i) => i !== ci) })),
      })),
    }));
  };

  const renameColumn = (ci: number, val: string) =>
    setForm(p => ({ ...p, nightColumns: p.nightColumns.map((c, i) => i === ci ? val : c) }));

  // ══════════════════════════════════════════════════════════════════
  // VILLA GROUPS
  // ══════════════════════════════════════════════════════════════════
  const addVillaGroup = (villa: any) => {
    if (form.villaGroups.some(g => g.villaId === villa.id)) {
      toast.warning(`"${villa.title}" is already in the table.`); return;
    }
    setForm(p => ({
      ...p, villaGroups: [...p.villaGroups, emptyGroup(villa.id, villa.title, p.nightColumns.length)],
    }));
  };

  const removeVillaGroup = (gid: string) =>
    setForm(p => ({ ...p, villaGroups: p.villaGroups.filter(g => g.id !== gid) }));

  const moveGroup = (idx: number, dir: -1 | 1) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= form.villaGroups.length) return;
    setForm(p => {
      const g = [...p.villaGroups]; [g[idx], g[ni]] = [g[ni], g[idx]];
      return { ...p, villaGroups: g };
    });
  };

  // ══════════════════════════════════════════════════════════════════
  // SEASON ROWS
  // ══════════════════════════════════════════════════════════════════
  const addRow = (gid: string) =>
    setForm(p => ({
      ...p, villaGroups: p.villaGroups.map(g =>
        g.id === gid ? { ...g, rows: [...g.rows, emptyRow(p.nightColumns.length)] } : g
      ),
    }));

  const removeRow = (gid: string, rid: string) => {
    if ((form.villaGroups.find(g => g.id === gid)?.rows.length ?? 0) <= 1) {
      toast.error('Each villa section needs at least one season row.'); return;
    }
    setForm(p => ({
      ...p, villaGroups: p.villaGroups.map(g =>
        g.id === gid ? { ...g, rows: g.rows.filter(r => r.id !== rid) } : g
      ),
    }));
  };

  const updatePeriod = (gid: string, rid: string, key: 'from' | 'to', val: string) =>
    setForm(p => ({
      ...p, villaGroups: p.villaGroups.map(g => g.id !== gid ? g : {
        ...g, rows: g.rows.map(r => r.id !== rid ? r : { ...r, period: { ...r.period, [key]: val } }),
      }),
    }));

  const updatePrice = (gid: string, rid: string, ci: number, val: string) =>
    setForm(p => ({
      ...p, villaGroups: p.villaGroups.map(g => g.id !== gid ? g : {
        ...g, rows: g.rows.map(r => {
          if (r.id !== rid) return r;
          const prices = [...r.prices]; prices[ci] = val; return { ...r, prices };
        }),
      }),
    }));

  // ══════════════════════════════════════════════════════════════════
  // TRANSFER DETAILS
  // ══════════════════════════════════════════════════════════════════
  const addTransferRow = () => {
    if (form.transferDetails.length >= 4) { toast.error('Maximum 4 transfer rows.'); return; }
    setForm(p => ({ ...p, transferDetails: [...p.transferDetails, { id: uid(), label: '', value: '' }] }));
  };
  const removeTransferRow = (id: string) =>
    setForm(p => ({ ...p, transferDetails: p.transferDetails.filter(r => r.id !== id) }));
  const updateTransferRow = (id: string, key: 'label' | 'value', val: string) =>
    setForm(p => ({
      ...p, transferDetails: p.transferDetails.map(r => r.id === id ? { ...r, [key]: val } : r),
    }));

  // ══════════════════════════════════════════════════════════════════
  // INCLUSIONS & SPECIAL BENEFITS
  // ══════════════════════════════════════════════════════════════════
  const addListItem = (key: 'inclusions' | 'specialBenefits', max = 12) => {
    if (form[key].length >= max) { toast.error(`Maximum ${max} items.`); return; }
    setForm(p => ({ ...p, [key]: [...p[key], ''] }));
  };
  const removeListItem = (key: 'inclusions' | 'specialBenefits', i: number) =>
    setForm(p => ({ ...p, [key]: p[key].filter((_, idx) => idx !== i) }));
  const updateListItem = (key: 'inclusions' | 'specialBenefits', i: number, val: string) =>
    setForm(p => ({ ...p, [key]: p[key].map((v, idx) => idx === i ? val : v) }));

  // ══════════════════════════════════════════════════════════════════
  // VALIDATION
  // ══════════════════════════════════════════════════════════════════
  const validate = (): string | null => {
    if (!form.resortId)                      return 'Please select a resort first.';
    if (!form.pageTitle.trim())              return 'Please enter a page title.';
    if (form.nightColumns.length === 0)      return 'Please add at least one pricing column.';
    const blankCol = form.nightColumns.findIndex(c => !c.trim());
    if (blankCol !== -1)                     return `Column ${blankCol + 1} name cannot be empty.`;
    const dup = form.nightColumns.find((c, i) => form.nightColumns.indexOf(c) !== i);
    if (dup)                                 return `Duplicate column name: "${dup}".`;
    if (form.villaGroups.length === 0)       return 'Please add at least one villa type.';
    for (const g of form.villaGroups) {
      if (g.rows.length === 0)               return `"${g.villaName}" needs at least one season row.`;
      const ep = g.rows.findIndex(r => !r.period.from || !r.period.to);
      if (ep !== -1)                         return `Set both From and To dates on row ${ep + 1} of "${g.villaName}".`;
      const badDate = g.rows.findIndex(r => r.period.from > r.period.to);
      if (badDate !== -1)                    return `"From" date must be before "To" date on row ${badDate + 1} of "${g.villaName}".`;
    }
    return null;
  };

  // ══════════════════════════════════════════════════════════════════
  // SAVE
  // ══════════════════════════════════════════════════════════════════
  const handleSave = async (): Promise<boolean> => {
    const err = validate();
    if (err) { toast.error(err); return false; }
    setSaving(true);
    try {
      const saved = await saveRates(form.resortId, buildSavePayload(), token);
      setLastSaved(saved.updatedAt);
      toast.success('Rates saved successfully!');
      return true;
    } catch (e: any) {
      toast.error(e.message || 'Failed to save rates.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════
  // DOWNLOAD PDF
  // ══════════════════════════════════════════════════════════════════
  const handleDownload = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    // Auto-save before generating
    const ok = await handleSave();
    if (!ok) return;
    setGenerating(true);
    try {
      await generateResortBrochureWithRates(form.resort, buildPdfPayload());
      toast.success('Rates brochure downloaded!');
    } catch (e) {
      console.error(e);
      toast.error('PDF generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleClearAll = () => {
    if (!confirm('Clear all rates data? This cannot be undone.')) return;
    setForm(buildEmptyForm());
    setLastSaved(null);
  };

  // ══════════════════════════════════════════════════════════════════
  // DERIVED STATE
  // ══════════════════════════════════════════════════════════════════
  const hasResort  = !!form.resort;
  const villas     = (form.resort?.villas || []) as any[];
  const filteredR  = allResorts.filter(r =>
    r.title.toLowerCase().includes(resortSearch.toLowerCase()) ||
    r.location?.toLowerCase().includes(resortSearch.toLowerCase())
  );

  // ══════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#f4f7fb]">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-[#e2e8f0] px-6 py-5 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#041d3c] rounded-[12px] flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[18px] font-black text-[#041d3c]">Accommodation Rates</h1>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Build rates, save them, and download the full brochure PDF with rates page
            </p>
          </div>
          {lastSaved && (
            <div className="ml-auto flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <Clock className="w-3.5 h-3.5" />
              Saved {new Date(lastSaved).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-36 pt-6 space-y-5">

        {/* ── STEP 1: Resort Selector ── */}
        <div className={sectionCard}>
          <label className={labelCls}>Step 1 — Select Resort</label>
          <div className="relative">
            <button
              id="resort-selector"
              onClick={() => setDropdownOpen(d => !d)}
              className={`${inputCls} flex items-center justify-between text-left`}
            >
              <span className={form.resort ? 'text-[#041d3c] font-semibold' : 'text-gray-300'}>
                {form.resort ? form.resort.title : 'Choose a Maldives resort…'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-[#e2e8f0] rounded-[12px] shadow-2xl overflow-hidden">
                <div className="p-2.5 border-b border-[#f0f4f8]">
                  <input
                    autoFocus value={resortSearch}
                    onChange={e => setResortSearch(e.target.value)}
                    placeholder="Search by name or location…"
                    className={`${inputCls} text-[12px]`}
                  />
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {loadingResorts ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
                    </div>
                  ) : filteredR.length === 0 ? (
                    <p className="text-[12px] text-gray-400 text-center py-6">No resorts found</p>
                  ) : filteredR.map(r => (
                    <button key={r.id} onClick={() => handleSelectResort(r)}
                      className={`w-full text-left px-4 py-3 border-b border-[#f0f4f8] last:border-0 hover:bg-[#f4f7fb] transition-colors ${form.resortId === r.id ? 'bg-[#f0f7ff]' : ''}`}
                    >
                      <span className={`text-[12px] font-bold ${form.resortId === r.id ? 'text-[#1a84ff]' : 'text-[#041d3c]'}`}>
                        {r.title}
                      </span>
                      {r.location && <span className="text-[11px] text-gray-400 ml-2">{r.location}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {hasResort && villas.length === 0 && !loadingResortData && (
            <div className="mt-3 flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-[10px]">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-amber-700 leading-relaxed">
                This resort has no villa types yet. Please add villas in <strong>Maldives Resorts</strong> first.
              </p>
            </div>
          )}
        </div>

        {loadingResortData && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#1a84ff]" />
            <span className="ml-2 text-[12px] text-gray-400">Loading resort data…</span>
          </div>
        )}

        {hasResort && !loadingResortData && (
          <>
            {/* ── STEP 2: Page Settings ── */}
            <div className={sectionCard}>
              <h2 className={sectionTitle}>Step 2 — Page Settings</h2>
              <p className="text-[11px] text-gray-400 mb-4">Set the main title and optional booking deadline for the rates page.</p>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelCls}>Page Title</label>
                  <input
                    id="rates-page-title"
                    value={form.pageTitle}
                    onChange={e => setForm(p => ({ ...p, pageTitle: e.target.value }))}
                    placeholder="Special Rates for 2 Adults on Single or Double Sharing Basis"
                    className={inputCls}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className={labelCls}>Book Before (optional)</label>
                    <input
                      id="rates-book-before"
                      type="date"
                      value={form.bookBefore}
                      onChange={e => setForm(p => ({ ...p, bookBefore: e.target.value }))}
                      className={inputCls}
                    />
                    {form.bookBefore && (
                      <p className="mt-1 text-[10px] text-[#1a84ff] font-medium">
                        → Shown in PDF as: Book Before: {fmtDisplay(form.bookBefore)}
                      </p>
                    )}
                  </div>
                  <div className="w-28 shrink-0">
                    <label className={labelCls}>Currency</label>
                    <select value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))} className={inputCls}>
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ── STEP 3: Column Manager ── */}
            <div className={sectionCard}>
              <h2 className={sectionTitle}>Step 3 — Pricing Columns</h2>
              <p className="text-[11px] text-gray-400 mb-4">
                "Villa Type" and "Travel Period" are fixed. Add and rename pricing columns below (max {MAX_COLUMNS}).
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                {['Villa Type', 'Travel Period'].map(c => (
                  <span key={c} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#041d3c] text-white rounded-full text-[11px] font-bold select-none">
                    {c} <span className="text-white/30 text-[10px]">fixed</span>
                  </span>
                ))}
                {form.nightColumns.map((col, ci) => (
                  <div key={ci} className="flex items-center gap-1 px-2.5 py-1.5 bg-[#f0f7ff] border border-[#1a84ff]/30 rounded-full">
                    {editingColIdx === ci ? (
                      <input autoFocus value={col}
                        onChange={e => renameColumn(ci, e.target.value)}
                        onBlur={() => setEditingColIdx(null)}
                        onKeyDown={e => e.key === 'Enter' && setEditingColIdx(null)}
                        className="text-[11px] font-bold text-[#1a84ff] bg-transparent border-0 outline-none w-24"
                      />
                    ) : (
                      <button onClick={() => setEditingColIdx(ci)} title="Click to rename"
                        className="text-[11px] font-bold text-[#1a84ff] hover:underline">{col}</button>
                    )}
                    <button onClick={() => removeColumn(ci)} className="ml-1 text-gray-300 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {form.nightColumns.length < MAX_COLUMNS && (
                  <button onClick={addColumn}
                    className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-gray-300 rounded-full text-[11px] text-gray-400 hover:border-[#1a84ff] hover:text-[#1a84ff] transition-colors">
                    <Plus className="w-3 h-3" /> Add Column
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-300 mt-3">
                {form.nightColumns.length}/{MAX_COLUMNS} custom columns · Click a column name to rename
              </p>
            </div>

            {/* ── STEP 4: Rates Table ── */}
            <div className={sectionCard}>
              <h2 className={sectionTitle}>Step 4 — Rates Table</h2>
              <p className="text-[11px] text-gray-400 mb-4">
                Add villa sections and season rows. Use date pickers for travel period and numbers only for prices.
              </p>

              {form.villaGroups.length === 0 && (
                <div className="border-2 border-dashed border-[#e2e8f0] rounded-[12px] p-10 text-center mb-4">
                  <Tag className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-[12px] text-gray-400">No villa sections yet — add one below</p>
                </div>
              )}

              <div className="space-y-4">
                {form.villaGroups.map((group, gi) => (
                  <div key={group.id} className="border border-[#e2e8f0] rounded-[12px] overflow-hidden">
                    {/* Group header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => moveGroup(gi, -1)} disabled={gi === 0}
                            className="text-gray-300 hover:text-[#041d3c] disabled:opacity-20 transition-colors" title="Move up">
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveGroup(gi, 1)} disabled={gi === form.villaGroups.length - 1}
                            className="text-gray-300 hover:text-[#041d3c] disabled:opacity-20 transition-colors" title="Move down">
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[12px] font-black text-[#041d3c]">{group.villaName}</span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {group.rows.length} row{group.rows.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <button onClick={() => removeVillaGroup(group.id)}
                        className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    {/* Column labels */}
                    <div className="px-4 pt-3 pb-1">
                      <div className="grid gap-2 items-center"
                        style={{ gridTemplateColumns: `1fr 1fr ${form.nightColumns.map(() => '1fr').join(' ')} 28px` }}>
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">From</span>
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">To</span>
                        {form.nightColumns.map((col, ci) => (
                          <span key={ci} className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider text-right">{col}</span>
                        ))}
                        <span />
                      </div>
                    </div>

                    {/* Season rows */}
                    <div className="px-4 pb-4 space-y-2">
                      {group.rows.map(row => (
                        <div key={row.id} className="grid gap-2 items-center"
                          style={{ gridTemplateColumns: `1fr 1fr ${form.nightColumns.map(() => '1fr').join(' ')} 28px` }}>
                          {/* From date */}
                          <input type="date" value={row.period.from}
                            onChange={e => updatePeriod(group.id, row.id, 'from', e.target.value)}
                            max={row.period.to || undefined}
                            className={`${inputCls} text-[11px]`}
                          />
                          {/* To date */}
                          <input type="date" value={row.period.to}
                            onChange={e => updatePeriod(group.id, row.id, 'to', e.target.value)}
                            min={row.period.from || undefined}
                            className={`${inputCls} text-[11px]`}
                          />
                          {/* Prices */}
                          {form.nightColumns.map((_col, ci) => (
                            <div key={ci} className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-bold pointer-events-none select-none">
                                {form.currency}
                              </span>
                              <input
                                type="number" min="0" step="0.01"
                                value={row.prices[ci] || ''}
                                onChange={e => updatePrice(group.id, row.id, ci, e.target.value)}
                                onKeyDown={e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                placeholder="0"
                                className={`${inputCls} text-[11px] pl-6 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                              />
                            </div>
                          ))}
                          <button onClick={() => removeRow(group.id, row.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors shrink-0"
                            title="Remove row">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addRow(group.id)}
                        className="mt-1 flex items-center gap-1.5 text-[11px] text-[#1a84ff] hover:text-[#0055cc] font-semibold transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Season Row
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add villa buttons */}
              {villas.length > 0 && (
                <div className="mt-5">
                  <p className={`${labelCls} mb-2`}>Add Villa Section</p>
                  <div className="flex flex-wrap gap-2">
                    {villas.map((v: any) => {
                      const added = form.villaGroups.some(g => g.villaId === v.id);
                      return (
                        <button key={v.id} onClick={() => addVillaGroup(v)} disabled={added}
                          className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
                            added ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                                  : 'border-[#041d3c] text-[#041d3c] hover:bg-[#041d3c] hover:text-white'
                          }`}>
                          {added ? '✓ ' : '+ '}{v.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── STEP 5: Transfer Method ── */}
            <div className={sectionCard}>
              <h2 className={sectionTitle}>Step 5 — Transfer Method</h2>
              <p className="text-[11px] text-gray-400 mb-4">
                Auto-filled from resort data. Edit labels and values, or add/remove rows.
              </p>
              <div className="space-y-2">
                {form.transferDetails.map(row => (
                  <div key={row.id} className="flex items-center gap-3">
                    <input value={row.label} onChange={e => updateTransferRow(row.id, 'label', e.target.value)}
                      placeholder="e.g. Transfer Method"
                      className={`${inputCls} flex-1`} />
                    <span className="text-gray-300 shrink-0">→</span>
                    <input value={row.value} onChange={e => updateTransferRow(row.id, 'value', e.target.value)}
                      placeholder="e.g. Speed Boat Transfer"
                      className={`${inputCls} flex-1`} />
                    <button onClick={() => removeTransferRow(row.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {form.transferDetails.length < 4 && (
                  <button onClick={addTransferRow}
                    className="mt-1 flex items-center gap-1.5 text-[11px] text-[#1a84ff] hover:text-[#0055cc] font-semibold transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                )}
              </div>
            </div>

            {/* ── STEP 6: Meal Plan ── */}
            <div className={sectionCard}>
              <h2 className={sectionTitle}>Step 6 — Meal Plan</h2>
              <p className="text-[11px] text-gray-400 mb-4">Select the meal plan included in the rate.</p>
              <div className="flex gap-3 flex-wrap">
                {MEAL_PLANS.map(plan => (
                  <button key={plan} onClick={() => setForm(p => ({ ...p, mealPlan: plan }))}
                    className={`px-5 py-2.5 rounded-[10px] text-[12px] font-bold transition-all border-2 ${
                      form.mealPlan === plan
                        ? 'border-[#041d3c] bg-[#041d3c] text-white shadow-md'
                        : 'border-[#e2e8f0] bg-white text-[#041d3c] hover:border-[#041d3c]/40'
                    }`}>
                    {plan}
                  </button>
                ))}
              </div>
            </div>

            {/* ── STEP 7: Above Rate Includes ── */}
            <div className={sectionCard}>
              <h2 className={sectionTitle}>Step 7 — Above Rate Includes</h2>
              <p className="text-[11px] text-gray-400 mb-4">Bullet points shown below the rates table in the PDF.</p>
              <div className="space-y-2">
                {form.inclusions.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0" />
                    <input value={item} onChange={e => updateListItem('inclusions', i, e.target.value)}
                      placeholder="e.g. All Taxes Included" className={`${inputCls} flex-1`} />
                    <button onClick={() => removeListItem('inclusions', i)}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {form.inclusions.length < 12 && (
                  <button onClick={() => addListItem('inclusions')}
                    className="mt-1 flex items-center gap-1.5 text-[11px] text-[#1a84ff] hover:text-[#0055cc] font-semibold transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Inclusion
                  </button>
                )}
              </div>
            </div>

            {/* ── STEP 8: Special Benefits ── */}
            <div className={sectionCard}>
              <h2 className={sectionTitle}>Step 8 — Special Benefits</h2>
              <p className="text-[11px] text-gray-400 mb-4">Additional perks shown after the inclusions in the PDF.</p>
              <div className="space-y-2">
                {form.specialBenefits.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0" />
                    <input value={item} onChange={e => updateListItem('specialBenefits', i, e.target.value)}
                      placeholder="e.g. Early Check-in if available" className={`${inputCls} flex-1`} />
                    <button onClick={() => removeListItem('specialBenefits', i)}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {form.specialBenefits.length < 12 && (
                  <button onClick={() => addListItem('specialBenefits')}
                    className="mt-1 flex items-center gap-1.5 text-[11px] text-[#1a84ff] hover:text-[#0055cc] font-semibold transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Benefit
                  </button>
                )}
              </div>
            </div>

            {/* ── Live Preview ── */}
            {form.villaGroups.length > 0 && (
              <div className={sectionCard}>
                <h2 className={sectionTitle}>Live Preview</h2>
                <p className="text-[11px] text-gray-400 mb-4">Approximate preview of the rates table layout.</p>
                {form.pageTitle && <p className="text-[11px] font-bold text-[#041d3c] mb-1 px-1">{form.pageTitle}</p>}
                {form.bookBefore && (
                  <p className="text-[10px] text-gray-400 mb-3 px-1">Book Before: {fmtDisplay(form.bookBefore)}</p>
                )}
                <div className="overflow-x-auto rounded-[10px] border border-[#e2e8f0]">
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr>
                        <th className="bg-[#041d3c] text-white font-bold px-3 py-2.5 text-left border border-[#1a3560] min-w-[120px]">Villa Type</th>
                        <th className="bg-[#041d3c] text-white font-bold px-3 py-2.5 text-left border border-[#1a3560] min-w-[180px]">Travel Period</th>
                        {form.nightColumns.map((col, i) => (
                          <th key={i} className="bg-[#041d3c] text-white font-bold px-3 py-2.5 text-right border border-[#1a3560] whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {form.villaGroups.map(group =>
                        group.rows.map((row, ri) => (
                          <tr key={row.id} className={ri % 2 === 0 ? 'bg-white' : 'bg-[#f8fbff]'}>
                            {ri === 0 && (
                              <td rowSpan={group.rows.length}
                                className="font-bold text-[#041d3c] px-3 py-2 border border-[#e2e8f0] align-middle bg-[#eef4fc]">
                                {group.villaName}
                              </td>
                            )}
                            <td className="text-gray-600 px-3 py-2 border border-[#e2e8f0] whitespace-nowrap">
                              {row.period.from && row.period.to
                                ? `${fmtDisplay(row.period.from)} – ${fmtDisplay(row.period.to)}`
                                : <span className="text-gray-300">—</span>}
                            </td>
                            {form.nightColumns.map((_col, ci) => (
                              <td key={ci} className="text-gray-600 px-3 py-2 border border-[#e2e8f0] text-right">
                                {row.prices[ci] ? `${form.currency}${row.prices[ci]}` : <span className="text-gray-300">—</span>}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Transfer & Meal Plan preview */}
                {(form.transferDetails.some(r => r.label || r.value) || form.mealPlan) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {form.transferDetails.some(r => r.label || r.value) && (
                      <div className="p-3 bg-[#f8fafc] rounded-[10px] border border-[#e2e8f0]">
                        <p className="text-[10px] font-black text-[#041d3c] uppercase tracking-wider mb-2">Transfer Details</p>
                        {form.transferDetails.filter(r => r.label || r.value).map((row, i) => (
                          <div key={i} className="flex gap-2 text-[11px] mb-1">
                            <span className="text-gray-400 w-32 shrink-0">{row.label}</span>
                            <span className="font-semibold text-[#041d3c]">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {form.mealPlan && (
                      <div className="p-3 bg-[#f8fafc] rounded-[10px] border border-[#e2e8f0]">
                        <p className="text-[10px] font-black text-[#041d3c] uppercase tracking-wider mb-2">Meal Plan</p>
                        <p className="text-[12px] font-bold text-[#041d3c]">{form.mealPlan}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Inclusions & Benefits preview */}
                {(form.inclusions.some(s => s.trim()) || form.specialBenefits.some(s => s.trim())) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {form.inclusions.filter(s => s.trim()).length > 0 && (
                      <div className="p-4 bg-[#f8fafc] rounded-[10px] border border-[#e2e8f0]">
                        <p className="text-[10px] font-black text-[#041d3c] uppercase tracking-wider mb-2">Above Rate Includes</p>
                        <ul className="space-y-1.5">
                          {form.inclusions.filter(s => s.trim()).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0 mt-1" />{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {form.specialBenefits.filter(s => s.trim()).length > 0 && (
                      <div className="p-4 bg-[#f8fafc] rounded-[10px] border border-[#e2e8f0]">
                        <p className="text-[10px] font-black text-[#041d3c] uppercase tracking-wider mb-2">Special Benefits</p>
                        <ul className="space-y-1.5">
                          {form.specialBenefits.filter(s => s.trim()).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0 mt-1" />{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!hasResort && !loadingResortData && (
          <div className="bg-white rounded-[16px] border border-[#e2e8f0] p-12 text-center">
            <div className="w-16 h-16 bg-[#f4f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-[13px] text-gray-400 font-medium">Select a resort above to begin</p>
            <p className="text-[11px] text-gray-300 mt-1">Previously saved rates will be automatically loaded</p>
          </div>
        )}
      </div>

      {/* ── Sticky Bottom Action Bar ── */}
      {hasResort && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e2e8f0] px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[10px] transition-all">
              <Trash2 className="w-4 h-4" /> Clear All
            </button>

            <div className="flex items-center gap-3">
              {form.resort && <span className="text-[11px] text-gray-400 font-medium hidden sm:block">{form.resort.title}</span>}

              {/* Save button */}
              <button
                id="save-rates"
                onClick={handleSave}
                disabled={saving || generating}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#041d3c] text-[#041d3c] hover:bg-[#041d3c] hover:text-white rounded-[12px] text-[13px] font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed min-w-[130px] justify-center"
              >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />Save Rates</>}
              </button>

              {/* Download button */}
              <button
                id="download-rates-pdf"
                onClick={handleDownload}
                disabled={generating || saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#041d3c] hover:bg-[#1a84ff] text-white rounded-[12px] text-[13px] font-bold transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed min-w-[200px] justify-center"
              >
                {generating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating PDF…</> : <><Download className="w-4 h-4" />Download Rates PDF</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => { setDropdownOpen(false); setResortSearch(''); }} />
      )}
    </div>
  );
}
