"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Users, CheckCircle2, Send, Calendar,
  Loader2, ArrowLeft, ChevronDown, Shield, CreditCard,
  XCircle, Compass, Moon
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ImageWithFallback } from '../../../../components/shared/ImageWithFallback';
import { ReviewsSection } from '../../../../components/sections/ReviewsSection';

// ── Country → Phone code map ───────────────────────────────────────────────────
const COUNTRIES: { name: string; code: string; dial: string; flag: string }[] = [
  { name: 'Afghanistan', code: 'AF', dial: '+93', flag: '🇦🇫' },
  { name: 'Albania', code: 'AL', dial: '+355', flag: '🇦🇱' },
  { name: 'Algeria', code: 'DZ', dial: '+213', flag: '🇩🇿' },
  { name: 'Argentina', code: 'AR', dial: '+54', flag: '🇦🇷' },
  { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', dial: '+43', flag: '🇦🇹' },
  { name: 'Bahrain', code: 'BH', dial: '+973', flag: '🇧🇭' },
  { name: 'Bangladesh', code: 'BD', dial: '+880', flag: '🇧🇩' },
  { name: 'Belgium', code: 'BE', dial: '+32', flag: '🇧🇪' },
  { name: 'Brazil', code: 'BR', dial: '+55', flag: '🇧🇷' },
  { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
  { name: 'Chile', code: 'CL', dial: '+56', flag: '🇨🇱' },
  { name: 'China', code: 'CN', dial: '+86', flag: '🇨🇳' },
  { name: 'Colombia', code: 'CO', dial: '+57', flag: '🇨🇴' },
  { name: 'Croatia', code: 'HR', dial: '+385', flag: '🇭🇷' },
  { name: 'Czech Republic', code: 'CZ', dial: '+420', flag: '🇨🇿' },
  { name: 'Denmark', code: 'DK', dial: '+45', flag: '🇩🇰' },
  { name: 'Egypt', code: 'EG', dial: '+20', flag: '🇪🇬' },
  { name: 'Estonia', code: 'EE', dial: '+372', flag: '🇪🇪' },
  { name: 'Ethiopia', code: 'ET', dial: '+251', flag: '🇪🇹' },
  { name: 'Finland', code: 'FI', dial: '+358', flag: '🇫🇮' },
  { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
  { name: 'Ghana', code: 'GH', dial: '+233', flag: '🇬🇭' },
  { name: 'Greece', code: 'GR', dial: '+30', flag: '🇬🇷' },
  { name: 'Hungary', code: 'HU', dial: '+36', flag: '🇭🇺' },
  { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
  { name: 'Indonesia', code: 'ID', dial: '+62', flag: '🇮🇩' },
  { name: 'Iran', code: 'IR', dial: '+98', flag: '🇮🇷' },
  { name: 'Iraq', code: 'IQ', dial: '+964', flag: '🇮🇶' },
  { name: 'Ireland', code: 'IE', dial: '+353', flag: '🇮🇪' },
  { name: 'Israel', code: 'IL', dial: '+972', flag: '🇮🇱' },
  { name: 'Italy', code: 'IT', dial: '+39', flag: '🇮🇹' },
  { name: 'Japan', code: 'JP', dial: '+81', flag: '🇯🇵' },
  { name: 'Jordan', code: 'JO', dial: '+962', flag: '🇯🇴' },
  { name: 'Kazakhstan', code: 'KZ', dial: '+7', flag: '🇰🇿' },
  { name: 'Kenya', code: 'KE', dial: '+254', flag: '🇰🇪' },
  { name: 'Kuwait', code: 'KW', dial: '+965', flag: '🇰🇼' },
  { name: 'Latvia', code: 'LV', dial: '+371', flag: '🇱🇻' },
  { name: 'Lebanon', code: 'LB', dial: '+961', flag: '🇱🇧' },
  { name: 'Lithuania', code: 'LT', dial: '+370', flag: '🇱🇹' },
  { name: 'Luxembourg', code: 'LU', dial: '+352', flag: '🇱🇺' },
  { name: 'Malaysia', code: 'MY', dial: '+60', flag: '🇲🇾' },
  { name: 'Maldives', code: 'MV', dial: '+960', flag: '🇲🇻' },
  { name: 'Malta', code: 'MT', dial: '+356', flag: '🇲🇹' },
  { name: 'Mexico', code: 'MX', dial: '+52', flag: '🇲🇽' },
  { name: 'Morocco', code: 'MA', dial: '+212', flag: '🇲🇦' },
  { name: 'Netherlands', code: 'NL', dial: '+31', flag: '🇳🇱' },
  { name: 'New Zealand', code: 'NZ', dial: '+64', flag: '🇳🇿' },
  { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
  { name: 'Norway', code: 'NO', dial: '+47', flag: '🇳🇴' },
  { name: 'Oman', code: 'OM', dial: '+968', flag: '🇴🇲' },
  { name: 'Pakistan', code: 'PK', dial: '+92', flag: '🇵🇰' },
  { name: 'Philippines', code: 'PH', dial: '+63', flag: '🇵🇭' },
  { name: 'Poland', code: 'PL', dial: '+48', flag: '🇵🇱' },
  { name: 'Portugal', code: 'PT', dial: '+351', flag: '🇵🇹' },
  { name: 'Qatar', code: 'QA', dial: '+974', flag: '🇶🇦' },
  { name: 'Romania', code: 'RO', dial: '+40', flag: '🇷🇴' },
  { name: 'Russia', code: 'RU', dial: '+7', flag: '🇷🇺' },
  { name: 'Saudi Arabia', code: 'SA', dial: '+966', flag: '🇸🇦' },
  { name: 'Singapore', code: 'SG', dial: '+65', flag: '🇸🇬' },
  { name: 'Slovakia', code: 'SK', dial: '+421', flag: '🇸🇰' },
  { name: 'South Africa', code: 'ZA', dial: '+27', flag: '🇿🇦' },
  { name: 'South Korea', code: 'KR', dial: '+82', flag: '🇰🇷' },
  { name: 'Spain', code: 'ES', dial: '+34', flag: '🇪🇸' },
  { name: 'Sri Lanka', code: 'LK', dial: '+94', flag: '🇱🇰' },
  { name: 'Sweden', code: 'SE', dial: '+46', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', dial: '+41', flag: '🇨🇭' },
  { name: 'Thailand', code: 'TH', dial: '+66', flag: '🇹🇭' },
  { name: 'Turkey', code: 'TR', dial: '+90', flag: '🇹🇷' },
  { name: 'UAE', code: 'AE', dial: '+971', flag: '🇦🇪' },
  { name: 'Ukraine', code: 'UA', dial: '+380', flag: '🇺🇦' },
  { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
  { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
  { name: 'Vietnam', code: 'VN', dial: '+84', flag: '🇻🇳' },
].sort((a, b) => a.name.localeCompare(b.name));

const TABS = [
  { id: 'itinerary', label: 'Itinerary', icon: Compass },
  { id: 'included', label: "What's Included", icon: CheckCircle2 },
  { id: 'terms', label: 'Terms & Conditions', icon: Shield },
  { id: 'cancellation', label: 'Payment & Cancellation', icon: CreditCard },
];

export function TourPackageClient({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '', surname: '', email: '',
      country: '', travelDate: '', nights: '1',
      adults: '2', children: '0', infants: '0',
      message: '',
    }
  });

  const watchedCountry = watch('country');
  const watchedDate = watch('travelDate');
  const watchedNights = watch('nights');

  useEffect(() => {
    if (!watchedCountry) return;
    const found = COUNTRIES.find(c => c.code === watchedCountry);
    if (found) {
      setPhoneCode(found.dial);
      setPhoneNumber(prev => prev.replace(/^\+\d+\s*/, ''));
    }
  }, [watchedCountry]);

  const checkOutDate = (() => {
    if (!watchedDate || !watchedNights) return '';
    const d = new Date(watchedDate);
    d.setDate(d.getDate() + parseInt(watchedNights || '1', 10));
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  })();

  const onSubmit = async (formData: any) => {
    if (!phoneNumber || phoneNumber.replace(/\\D/g, '').length < 7) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (watchedDate) {
      const selected = new Date(watchedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        toast.error('Travel date cannot be in the past');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        phone: `${phoneCode} ${phoneNumber}`,
        packageTitle: data.title,
      };

      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to submit');

      toast.success('Inquiry sent successfully! Please check your email for confirmation.', {
        duration: 6000,
        icon: '✉️'
      });
      reset();
      setPhoneCode('');
      setPhoneNumber('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const included = data.included;
  const notIncluded = data.notIncluded;

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">

      {/* ── HERO ── */}
      <section className="relative w-full h-[62vh] min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={data.heroImage}
            alt={data.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/90 via-[#041d3c]/60 to-[#041d3c]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/85 via-transparent to-[#041d3c]/25" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 pb-12 lg:pb-16">
          {/* Breadcrumb */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-white/45 hover:text-white text-[11.5px] font-semibold uppercase tracking-wider mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          {/* Category badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            <span>Sri Lanka Multiday Tour</span>
          </div>

          <h1 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  drop-shadow-lg mb-4">
            {data.title}
          </h1>
          <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-5" />

          {/* Quick stats row */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2 text-white/75 text-[13px] font-semibold">
              <Clock className="w-4 h-4 text-[#1a84ff]" />
              {data.duration}
            </div>
            <div className="flex items-center gap-2 text-white/75 text-[13px] font-semibold">
              <MapPin className="w-4 h-4 text-[#1a84ff]" />
              {data.locations}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-16 lg:py-20">
        {/* Banner between Hero and Package */}
        {data.offerPoster && (
          <div className="w-full mb-16 rounded-[24px] overflow-hidden shadow-[0_16px_48px_rgba(4,29,60,0.08)] border border-[#041d3c]/5">
            <ImageWithFallback src={data.offerPoster} alt="Tour Offer" className="w-full h-auto object-cover" />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 space-y-14">

            {/* Tour Summary */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
                <span>✦ TOUR OVERVIEW</span>
              </div>
              <h2 className="text-[#041d3c] font-black text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
                Tour Summary
              </h2>
              <div className="w-14 h-1.5 bg-[#1a84ff] rounded-full mb-6" />
              <p className="text-gray-500 text-[15px] lg:text-[16px] leading-[1.9]">
                {data.summary}
              </p>
            </div>

            {/* Gallery */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
                <span>✦ PHOTO GALLERY</span>
              </div>
              <h2 className="text-[#041d3c] font-black text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
                Tour Gallery
              </h2>
              <div className="w-14 h-1.5 bg-[#1a84ff] rounded-full mb-6" />

              <div className="grid grid-cols-3 gap-3">
                {/* Large first image */}
                <div
                  className="col-span-3 md:col-span-2 rounded-[20px] overflow-hidden h-[280px] cursor-pointer group relative"
                  onClick={() => setLightboxIndex(0)}
                >
                  <ImageWithFallback
                    src={data.gallery[0]}
                    alt="Gallery 1"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#041d3c]/0 group-hover:bg-[#041d3c]/20 transition-all duration-300 rounded-[20px]" />
                </div>
                {/* Second image stacked right */}
                <div
                  className="col-span-3 md:col-span-1 rounded-[20px] overflow-hidden h-[280px] cursor-pointer group relative"
                  onClick={() => setLightboxIndex(1)}
                >
                  <ImageWithFallback
                    src={data.gallery[1]}
                    alt="Gallery 2"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#041d3c]/0 group-hover:bg-[#041d3c]/20 transition-all duration-300 rounded-[20px]" />
                </div>
                {/* Bottom row — 3 equal */}
                {data.gallery.slice(2, 5).map((img: string, i: number) => (
                  <div
                    key={i}
                    className="col-span-1 rounded-[20px] overflow-hidden h-[150px] cursor-pointer group relative"
                    onClick={() => setLightboxIndex(i + 2)}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Gallery ${i + 3}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-[#041d3c]/0 group-hover:bg-[#041d3c]/20 transition-all duration-300 rounded-[20px]" />
                    {/* "+more" badge on last visible */}
                    {i === 2 && data.gallery.length > 5 && (
                      <div className="absolute inset-0 bg-[#041d3c]/55 flex items-center justify-center rounded-[20px]">
                        <span className="text-white font-black text-[20px]">+{data.gallery.length - 5}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div>
              {/* Tab Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[13px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                        isActive
                          ? 'bg-[#041d3c] text-white shadow-[0_8px_20px_rgba(4,29,60,0.15)]'
                          : 'bg-white text-[#041d3c]/60 border border-[#041d3c]/10 hover:border-[#1a84ff]/30 hover:text-[#041d3c]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">

                {activeTab === 'itinerary' && (
                  <motion.div
                    key="itinerary"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-3"
                  >
                    {data.itinerary.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white rounded-[16px] overflow-hidden border border-[#041d3c]/7 shadow-[0_4px_20px_rgba(4,29,60,0.04)] hover:shadow-[0_8px_32px_rgba(4,29,60,0.08)] transition-all duration-300"
                      >
                        <button
                          className="w-full flex items-center gap-4 p-5 text-left"
                          onClick={() => setOpenDay(openDay === idx ? null : idx)}
                        >
                          {/* Day badge */}
                          <div className="w-12 h-12 rounded-[12px] bg-[#1a84ff] text-white font-black text-[14px] flex items-center justify-center shrink-0">
                            {item.day}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#041d3c] font-black text-[16px] leading-tight">{item.activity}</p>
                            <p className="text-gray-400 text-[12px] font-semibold mt-0.5 truncate">{item.route}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="hidden sm:block bg-[#f1f5f9] text-[#041d3c] text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full">
                              {item.stay}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-[#041d3c]/40 transition-transform duration-300 ${openDay === idx ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </button>
                        <AnimatePresence>
                          {openDay === idx && (
                            <motion.div
                              key="detail"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 pt-1 border-t border-[#041d3c]/5">
                                <p className="text-gray-500 text-[14px] leading-[1.8] font-medium">{item.details}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'included' && (
                  <motion.div
                    key="included"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="bg-white rounded-[20px] p-8 lg:p-10 border border-[#041d3c]/7 shadow-[0_4px_20px_rgba(4,29,60,0.04)]">
                      <h3 className="text-[#041d3c] font-black text-2xl lg:text-[28px] mb-6">What's Included</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {included.map((item: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-[#1a84ff] shrink-0 mt-0.5" />
                            <p className="text-gray-500 font-medium text-[14px] lg:text-[15px] leading-[1.7]">{item}</p>
                          </div>
                        ))}
                      </div>
                      <div className="h-[1px] bg-[#041d3c]/5 mb-8" />
                      <h3 className="text-[#041d3c] font-black text-xl mb-5">Not Included</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {notIncluded.map((item: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-gray-500 font-medium text-[14px] leading-[1.7]">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'terms' && (
                  <motion.div
                    key="terms"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="bg-white rounded-[20px] p-8 lg:p-10 border border-[#041d3c]/7 shadow-[0_4px_20px_rgba(4,29,60,0.04)] space-y-6">
                      <h3 className="text-[#041d3c] font-black text-2xl lg:text-[28px]">Terms & Conditions</h3>
                      {[
                        { title: '1. Booking & Confirmation', body: 'All bookings are subject to availability. A booking is confirmed only upon receipt of the specified deposit. We reserve the right to decline any booking at our discretion.' },
                        { title: '2. Passport & Visas', body: "It is the traveler's responsibility to ensure that their passport is valid for at least 6 months from the date of entry into Sri Lanka. Appropriate tourist visas must be obtained prior to arrival or via ETA." },
                        { title: '3. Insurance', body: 'We strongly recommend that all travelers purchase comprehensive travel insurance covering trip cancellation, medical emergencies, and baggage loss.' },
                        { title: '4. Alterations to Itinerary', body: 'While every effort is made to adhere to the planned itinerary, we reserve the right to modify routes, accommodations, or activities due to unforeseen circumstances, ensuring the alternative is of a similar standard.' },
                      ].map((clause, i) => (
                        <div key={i} className="border-b border-[#041d3c]/5 pb-6 last:border-0 last:pb-0">
                          <h4 className="text-[#041d3c] font-extrabold text-[15px] mb-2">{clause.title}</h4>
                          <p className="text-gray-500 text-[14px] leading-[1.8] font-medium">{clause.body}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'cancellation' && (
                  <motion.div
                    key="cancellation"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="bg-white rounded-[20px] p-8 lg:p-10 border border-[#041d3c]/7 shadow-[0_4px_20px_rgba(4,29,60,0.04)] space-y-8">
                      <h3 className="text-[#041d3c] font-black text-2xl lg:text-[28px]">Payment & Cancellation</h3>

                      {/* Payment schedule */}
                      <div className="bg-[#f1f8ff] rounded-[16px] p-6 border border-[#1a84ff]/10">
                        <h4 className="text-[#041d3c] font-extrabold text-[16px] mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-[#1a84ff]" />
                          Payment Schedule
                        </h4>
                        <ul className="space-y-3">
                          {[
                            '30% deposit required at the time of booking to secure your reservation.',
                            'Remaining 70% balance must be paid at least 30 days prior to your arrival.',
                            'For bookings made within 30 days of arrival, full payment is required immediately.',
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 text-[#1a84ff] shrink-0 mt-0.5" />
                              <p className="text-gray-500 text-[14px] font-medium leading-[1.7]">{item}</p>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cancellation table */}
                      <div>
                        <h4 className="text-[#041d3c] font-extrabold text-[16px] mb-4">Cancellation Terms</h4>
                        <div className="border border-[#041d3c]/8 rounded-[16px] overflow-hidden">
                          {[
                            { period: '31+ days before arrival', charge: 'Full Refund (minus processing fees)', color: 'text-green-600' },
                            { period: '15 – 30 days before arrival', charge: '50% Cancellation Fee', color: 'text-amber-600' },
                            { period: '14 days or less / No Shows', charge: '100% No Refund', color: 'text-red-500' },
                          ].map((row, i, arr) => (
                            <div
                              key={i}
                              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 gap-2 ${i < arr.length - 1 ? 'border-b border-[#041d3c]/7' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}`}
                            >
                              <span className="text-[#041d3c] font-semibold text-[14px]">{row.period}</span>
                              <span className={`font-extrabold text-[14px] ${row.color}`}>{row.charge}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-28 space-y-6">

              {/* Booking card */}
              <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(4,29,60,0.1)] border border-[#041d3c]/7 overflow-hidden">
                {/* Thumbnail */}
                <div className="relative h-[220px]">
                  <ImageWithFallback
                    src={data.packageImage}
                    alt="Tour"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#041d3c]/20" />
                  {data.discount && (
                    <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-md z-10">
                      <span className="text-[#f43f5e] font-black text-[13px] uppercase tracking-wider">{data.discount}% OFF</span>
                    </div>
                  )}
                </div>

                <div className="p-7 space-y-5">
                  {/* Price */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-gray-400 text-[11px] font-extrabold uppercase tracking-widest mb-1.5">STARTING FROM</p>
                      {data.discount && (
                        <p className="text-[13px] text-gray-400 line-through mb-0.5">
                          {data.currency}{data.price.toLocaleString()}
                        </p>
                      )}
                      <div className="flex items-end gap-2">
                        <span className="text-[#041d3c] font-black text-[38px] leading-none ">
                          {data.currency}{data.discount ? Math.round(data.price * (1 - data.discount / 100)).toLocaleString() : data.price.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-[14px] font-medium leading-[1.2] pb-1">/ person</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end pb-1">
                      <p className="text-gray-400 text-[11px] font-extrabold uppercase tracking-widest mb-2">DURATION</p>
                      <div className="flex items-center justify-end gap-1.5 text-[#041d3c] font-extrabold text-[14px] whitespace-nowrap">
                        <Clock className="w-[16px] h-[16px] text-[#1a84ff] shrink-0" />
                        <span>{data.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-[#041d3c]/6" />

                  {/* CTA button */}
                  <a
                    href={`https://wa.me/94715233845?text=Hi! I'm interested in the ${encodeURIComponent(data.title)} tour package.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 bg-[#128c7e] hover:bg-[#075e54] text-white rounded-[14px] py-4 font-extrabold text-[13px] tracking-wider uppercase transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Book on WhatsApp
                  </a>
                </div>
              </div>

              {/* Inquiry form card */}
              <div className="bg-white rounded-[24px] shadow-[0_16px_48px_rgba(4,29,60,0.08)] border border-[#041d3c]/5 p-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
                  <span>✦ CUSTOM ENQUIRY</span>
                </div>
                <h3 className="text-[#041d3c] font-black text-[26px] leading-tight mb-1">Inquire Now</h3>
                <p className="text-gray-400 text-[13px] font-medium mb-6">Customize this tour to fit your exact needs.</p>

                <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>

                  {/* Row 1 — Names */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="First Name *"
                        {...register('firstName', { 
                          required: 'First name is required', 
                          minLength: { value: 2, message: 'Minimum 2 characters' },
                          pattern: { value: /^[A-Za-z\s]+$/, message: 'Letters only' }
                        })}
                        className={`w-full bg-[#f8fafc] border ${errors.firstName ? 'border-red-400' : 'border-[#e4eaf2]'} rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors placeholder:text-gray-400`}
                      />
                      {errors.firstName && <span className="text-red-500 text-[10px] font-bold mt-1 block px-1">{errors.firstName.message as string}</span>}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Surname *"
                        {...register('surname', { 
                          required: 'Surname is required',
                          minLength: { value: 2, message: 'Minimum 2 characters' },
                          pattern: { value: /^[A-Za-z\s]+$/, message: 'Letters only' }
                        })}
                        className={`w-full bg-[#f8fafc] border ${errors.surname ? 'border-red-400' : 'border-[#e4eaf2]'} rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors placeholder:text-gray-400`}
                      />
                      {errors.surname && <span className="text-red-500 text-[10px] font-bold mt-1 block px-1">{errors.surname.message as string}</span>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      {...register('email', { 
                        required: 'Email is required', 
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email format' }
                      })}
                      className={`w-full bg-[#f8fafc] border ${errors.email ? 'border-red-400' : 'border-[#e4eaf2]'} rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors placeholder:text-gray-400`}
                    />
                    {errors.email && <span className="text-red-500 text-[10px] font-bold mt-1 block px-1">{errors.email.message as string}</span>}
                  </div>

                  {/* Country + Phone with auto-code */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <select
                        {...register('country', { required: 'Country is required' })}
                        className={`w-full appearance-none bg-[#f8fafc] border ${
                          errors.country ? 'border-red-400' : 'border-[#e4eaf2]'
                        } rounded-[12px] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer`}
                        style={{ color: watchedCountry ? '#041d3c' : '#9ca3af' }}
                      >
                        <option value="" disabled>Country *</option>
                        {COUNTRIES.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-[22px] -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      {errors.country && <span className="text-red-500 text-[10px] font-bold mt-1 block px-1">{errors.country.message as string}</span>}
                    </div>

                    {/* Phone with animated dial-code badge */}
                    <div className="relative">
                      <div className="relative flex items-center">
                        {phoneCode && (
                          <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute left-3 text-[#1a84ff] font-bold text-[12px] select-none pointer-events-none whitespace-nowrap z-10"
                          >
                            {phoneCode}
                          </motion.span>
                        )}
                        <input
                          type="tel"
                          placeholder={phoneCode ? '' : 'Phone (+code)'}
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          className="w-full bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors placeholder:text-gray-400"
                          style={{ paddingLeft: phoneCode ? `${phoneCode.length * 8 + 18}px` : '16px', paddingRight: '12px' }}
                        />
                      </div>
                      {(!phoneNumber || phoneNumber.replace(/\\D/g, '').length < 7) && phoneNumber.length > 0 && (
                        <span className="text-red-500 text-[10px] font-bold mt-1 block px-1">Valid phone required</span>
                      )}
                    </div>
                  </div>

                  {/* Travel Date + Number of Nights */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Travel Date"
                        {...register('travelDate')}
                        min={new Date().toISOString().split('T')[0]}
                        onFocus={(e) => { e.target.type = 'date'; try { (e.target as any).showPicker(); } catch(err){} }}
                        onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                        className="w-full bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors placeholder:text-gray-400 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                      <select
                        {...register('nights')}
                        className="w-full appearance-none bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer"
                      >
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,21,28].map(n => (
                          <option key={n} value={String(n)}>{n} {n === 1 ? 'Night' : 'Nights'}</option>
                        ))}
                      </select>
                      <Moon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Return date display pill */}
                  {checkOutDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-2 bg-[#eef6ff] border border-[#1a84ff]/20 rounded-[10px] px-4 py-2.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#1a84ff] shrink-0" />
                      <span className="text-[#1a84ff] font-semibold text-[12px]">Return date:</span>
                      <span className="text-[#041d3c] font-bold text-[12px]">{checkOutDate}</span>
                    </motion.div>
                  )}

                  {/* Number of Guests */}
                  <div>
                    <p className="text-[#041d3c] font-extrabold text-[12px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#1a84ff]" />
                      Number of Guests
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="relative">
                        <select
                          {...register('adults')}
                          className="w-full appearance-none bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-3 py-3 text-[#041d3c] font-medium text-[12px] focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer"
                        >
                          {[1,2,3,4,5,6].map(n => (
                            <option key={n} value={String(n)}>{n} Adult{n > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Adults</span>
                      </div>

                      <div className="relative">
                        <select
                          {...register('children')}
                          className="w-full appearance-none bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-3 py-3 text-[#041d3c] font-medium text-[12px] focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer"
                        >
                          {[0,1,2,3,4].map(n => (
                            <option key={n} value={String(n)}>{n} Child{n !== 1 ? 'ren' : ''}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">2–12y</span>
                      </div>

                      <div className="relative">
                        <select
                          {...register('infants')}
                          className="w-full appearance-none bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-3 py-3 text-[#041d3c] font-medium text-[12px] focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer"
                        >
                          {[0,1,2,3].map(n => (
                            <option key={n} value={String(n)}>{n} Infant{n !== 1 ? 's' : ''}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Under 2</span>
                      </div>
                    </div>
                  </div>

                  {/* Special requests */}
                  <textarea
                    placeholder="Any special requests or details…"
                    rows={4}
                    {...register('message')}
                    className="w-full bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors placeholder:text-gray-400 resize-none"
                  />

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#041d3c] hover:bg-[#1a84ff] disabled:bg-[#041d3c]/60 text-white font-extrabold text-[13px] tracking-wider uppercase px-8 py-4 rounded-[14px] transition-all duration-300 shadow-[0_8px_24px_rgba(4,29,60,0.12)] hover:shadow-[0_12px_32px_rgba(26,132,255,0.25)] hover:-translate-y-0.5 mt-1"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5" /> Request a Quote</>}
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/92 flex items-center justify-center px-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"
              onClick={() => setLightboxIndex(null)}
            >
              <XCircle className="w-8 h-8" />
            </button>
            <button
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors text-4xl font-thin"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + data.gallery.length) % data.gallery.length); }}
            >‹</button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={data.gallery[lightboxIndex]}
              alt={`Gallery ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] rounded-[16px] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors text-4xl font-thin"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % data.gallery.length); }}
            >›</button>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-[13px] font-semibold">
              {lightboxIndex + 1} / {data.gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── REVIEWS ── */}
      <div className="bg-white">
        <ReviewsSection />
      </div>

    </div>
  );
}
