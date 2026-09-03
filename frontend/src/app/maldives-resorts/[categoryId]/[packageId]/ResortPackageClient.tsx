"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Loader2,
  Users,
  BedDouble,
  Maximize,
  Compass,
  ArrowLeft,
  Wifi,
  Dumbbell,
  Waves,
  UtensilsCrossed,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Images,
  Moon,
  Plane,
  XCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImageWithFallback } from "../../../../components/shared/ImageWithFallback";
import { ReviewsSection } from "../../../../components/sections/ReviewsSection";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { COUNTRIES } from "@/lib/countries";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackLeadGeneration, trackWhatsAppClick } from "@/lib/tracking";

const TABS = [
  { id: "deals", label: "Deals & Offers" },
  { id: "villas", label: "Villas" },
  { id: "restaurants", label: "Restaurants" },
  { id: "facilities", label: "Facilities" },
  { id: "fact-sheet", label: "FACT Sheet" },
];

// ── WhatsApp button helper ────────────────────────────────────────────────────
const WaIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const VillaImageSlider = ({
  images,
  fallbackImage,
  alt,
}: {
  images: any[];
  fallbackImage: string;
  alt: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayImages =
    images && images.length > 0 ? images : [{ url: fallbackImage }];

  useEffect(() => {
    if (displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 4000); // Auto rotate every 4 seconds
    return () => clearInterval(interval);
  }, [displayImages.length]);

  return (
    <div className="relative w-full aspect-[4/3] group overflow-hidden rounded-[20px] shadow-[0_4px_16px_rgba(4,29,60,0.08)] self-start bg-[#f4f7fb]">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={
            displayImages[currentIndex]?.url ||
            displayImages[currentIndex]?.src ||
            fallbackImage
          }
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
      </AnimatePresence>
      {displayImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {displayImages.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-white w-3"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function ResortPackageClient({
  resort,
  categoryId,
  offerIndex = 0,
}: {
  resort: any;
  categoryId: string;
  offerIndex?: number;
}) {
  const pathname = usePathname();
  const isSpecialOffer = pathname.includes("/special-offers");
  const hasOffers =
    (resort.offers && resort.offers.length > 0) ||
    (resort.customOffers && resort.customOffers.length > 0);
  
  // ── Sidebar Carousel State ────────────────────────────────────────────────
  const [sidebarOfferIndex, setSidebarOfferIndex] = useState(offerIndex);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  useEffect(() => {
    if (!resort.customOffers || resort.customOffers.length <= 1) return;
    if (isCarouselHovered) return;

    const interval = setInterval(() => {
      setSidebarOfferIndex((prev) => (prev + 1) % resort.customOffers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [resort.customOffers, isCarouselHovered]);

  const [activeTab, setActiveTab] = useState(hasOffers ? "deals" : TABS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      surname: "",
      email: "",
      country: "",
      phone: "",
      checkIn: "",
      nights: "1",
      adults: "2",
      children: "0",
      infants: "0",
      resort: resort.title,
      roomType: "",
      details: "",
      selectedOffer: "",
    },
  });

  const watchedCountry = watch("country");
  const watchedCheckIn = watch("checkIn");
  const watchedNights = watch("nights");

  // ── Offer locking state ───────────────────────────────────────────────────
  // Tracks which customOffer index is currently "locked" into the form.
  // null = no offer locked (free-form mode)
  const [lockedOfferIndex, setLockedOfferIndex] = useState<number | null>(null);
  const isCustomOfferSelected = lockedOfferIndex !== null;
  const lockedOffer =
    lockedOfferIndex !== null
      ? resort.customOffers?.[lockedOfferIndex] ?? null
      : null;

  /** Lock a specific offer into the form and auto-fill all its fields. */
  const lockOffer = useCallback(
    (idx: number) => {
      const co = resort.customOffers?.[idx];
      if (!co) return;
      setLockedOfferIndex(idx);
      setValue("nights", String(co.nights));
      setValue("adults", String(co.adults ?? 2));
      setValue("children", String(co.children ?? 0));
      if (co.villas && co.villas.length > 0) {
        setValue("roomType", co.villas.join(" or "));
      }
      // Also store in selectedOffer field so it appears in the submission payload
      const adults = co.adults ?? 2;
      const children = co.children ?? 0;
      const valString = `${co.nights} Nights \u00b7 ${adults} Adults${children > 0 ? ` \u00b7 ${children} Children` : ""}${co.villas?.length > 0 ? ` \u00b7 ${co.villas.join(" or ")}` : ""} \u00b7 \u20ac${co.offerPrice}`;
      setValue("selectedOffer", valString);
    },
    [resort.customOffers, setValue],
  );

  /** Clear the locked offer and restore free-form mode. */
  const clearLockedOffer = useCallback(() => {
    setLockedOfferIndex(null);
    setValue("selectedOffer", "");
  }, [setValue]);

  /**
   * Scrolls to the inquiry form with a precise pixel offset so the form
   * is never hidden behind the sticky navbar (clears ~100px).
   * More reliable than scrollIntoView across all browsers and screen sizes.
   */
  const scrollToForm = useCallback((delay = 120) => {
    setTimeout(() => {
      const el = document.getElementById("inquire-form");
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }, delay);
  }, []);

  // Auto-fill phone code when country changes
  useEffect(() => {
    if (!watchedCountry) return;
    const found = COUNTRIES.find((c) => c.code === watchedCountry);
    if (found) {
      setPhoneCode(found.dial);
      setPhoneNumber((prev) => {
        // strip old code prefix if present and re-prefix with new code
        const stripped = prev.replace(/^\+\d+\s*/, "");
        return stripped;
      });
    }
  }, [watchedCountry]);

  // Auto-scroll when navigating from special offers
  useEffect(() => {
    if (isSpecialOffer) {
      const timer = setTimeout(() => {
        if (window.innerWidth < 1024) {
          // Mobile: scroll to special package box
          const el = document.getElementById("special-package");
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: "smooth" });
          }
        } else {
          // Desktop: scroll to deals tab section
          const el = document.getElementById("resort-details-tabs");
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: "smooth" });
            setActiveTab("deals");
          }
        }
      }, 500); // 500ms delay to allow images and layout to settle
      return () => clearTimeout(timer);
    }
  }, [isSpecialOffer]);

  // Compute check-out date for display
  const checkOutDate = (() => {
    if (!watchedCheckIn || !watchedNights) return "";
    const d = new Date(watchedCheckIn);
    d.setDate(d.getDate() + parseInt(watchedNights || "1", 10));
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  })();

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = useCallback(() => {
    setLightboxIndex((i) =>
      i === null
        ? null
        : (i - 1 + resort.gallery.length) % resort.gallery.length,
    );
  }, [resort.gallery.length]);
  const nextImage = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % resort.gallery.length,
    );
  }, [resort.gallery.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prevImage, nextImage]);

  const onSubmit = async (formData: any) => {
    if (!phoneNumber || phoneNumber.replace(/\\D/g, "").length < 7) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (watchedCheckIn) {
      const selected = new Date(watchedCheckIn);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        toast.error("Check-in date cannot be in the past");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
      };

      const payload = {
        ...formData,
        phone: `${phoneCode} ${phoneNumber}`,
        packageTitle: resort.title,
        fbp: typeof document !== 'undefined' ? getCookie('_fbp') : undefined,
        fbc: typeof document !== 'undefined' ? getCookie('_fbc') : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      };

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit");

      trackLeadGeneration("Maldives Resort", resort.title);

      toast.success(
        "Inquiry sent successfully! Please check your email for confirmation.",
        {
          duration: 6000,
          icon: "✉️",
        },
      );
      // @ts-ignore
      if (typeof window !== 'undefined' && window.fbq) {
        // @ts-ignore
        window.fbq('track', 'Lead');
      }
      reset();
      setPhoneCode("");
      setPhoneNumber("");
    } catch {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const overviewHeader = (
    <>
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
        <span>✦ RESORT OVERVIEW</span>
      </div>
      <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
        About This Resort
      </h2>
      <div className="w-16 h-1.5 bg-[#1a84ff] rounded-full mb-7" />
      <p className="text-gray-600 text-[15px] lg:text-[16px] leading-[1.85] font-normal mb-10 whitespace-pre-wrap break-words">
        {resort.summary}
      </p>
    </>
  );

  const featuresAndReviews = (
    <>
      {/* Info chips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { icon: MapPin, label: "Location", value: resort.location },
          { icon: Compass, label: "Transfer", value: resort.transfer },
          {
            icon: Clock,
            label: "Duration",
            value: resort.duration || "Customizable",
          },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white rounded-[20px] p-5 shadow-[0_4px_16px_rgba(4,29,60,0.05)] hover:shadow-[0_12px_32px_rgba(4,29,60,0.08)] border border-[#041d3c]/5 hover:border-[#1a84ff]/20 transition-all flex flex-col gap-2"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-[#1a84ff]/8 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#1a84ff]" />
              </div>
              <p className="text-gray-400 text-[11px] font-extrabold uppercase tracking-widest m-0">
                {label}
              </p>
            </div>
            <p className="text-[#041d3c] text-[14px] font-bold leading-snug">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Ratings row — TripAdvisor + Booking.com */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
        {/* TripAdvisor */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(4,29,60,0.05)] hover:shadow-[0_12px_32px_rgba(0,175,135,0.08)] border border-[#041d3c]/5 hover:border-[#00af87]/20 transition-all">
          <div className="flex items-center gap-2.5 mb-4 h-[24px]">
            <ImageWithFallback
              src="/images/tripadvisor-logo.png"
              alt="TripAdvisor"
              className="h-[28px] w-auto object-contain object-left"
            />
          </div>
          <div className="flex gap-[3px] mb-2 mt-1">
            {[...Array(5)].map((_, i) => {
              const rating = Number(resort.tripAdvisorRating || 5);
              const isFull = i < Math.floor(rating);
              const isHalf = i === Math.floor(rating) && rating % 1 !== 0;

              return (
                <div
                  key={i}
                  className={`w-[16px] h-[16px] rounded-full border-[1.5px] border-[#00af87] ${isFull ? "bg-[#00af87]" : "bg-transparent"}`}
                  style={
                    isHalf
                      ? {
                          background:
                            "linear-gradient(to right, #00af87 50%, transparent 50%)",
                        }
                      : {}
                  }
                />
              );
            })}
          </div>
          <p className="text-[#041d3c] font-black text-[22px] leading-none mb-1">
            {resort.tripAdvisorRating || "5.0"}{" "}
            <span className="text-gray-400 font-medium text-[13px]">/ 5.0</span>
          </p>
          <p className="text-gray-400 text-[11.5px] font-semibold">
            Based on {resort.tripAdvisorReviews || 0} traveler reviews
          </p>
        </div>

        {/* Booking.com */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(4,29,60,0.05)] hover:shadow-[0_12px_32px_rgba(0,53,128,0.08)] border border-[#041d3c]/5 hover:border-[#003580]/20 transition-all">
          <div className="flex items-center gap-2.5 mb-4 h-[24px]">
            <ImageWithFallback
              src="/images/booking-logo.png"
              alt="Booking.com"
              className="h-[20px] w-auto object-contain object-left"
            />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#003580] text-white font-black text-[15px] px-2.5 py-1 rounded-[8px]">
              {resort.bookingScore}
            </span>
            <span className="text-[#003580] font-extrabold text-[13px]">
              Superb
            </span>
          </div>
          <p className="text-[#041d3c] font-black text-[22px] leading-none mb-1">
            {resort.bookingReviews}{" "}
            <span className="text-gray-400 font-medium text-[13px]">
              Reviews
            </span>
          </p>
          <p className="text-gray-400 text-[11.5px] font-semibold">
            Top-rated Partner Resort
          </p>
        </div>
      </div>
    </>
  );

  const packageBox = (
    <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-28 space-y-5">
      {/* Price + CTA card */}
      <div className="bg-white rounded-[24px] shadow-[0_16px_48px_rgba(4,29,60,0.10)] overflow-hidden">
        <div className="relative h-[200px] overflow-hidden">
          <img
            src={resort.packageImage || resort.heroImage}
            alt="Resort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/60 to-transparent" />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-[12px] flex items-center gap-2 shadow-sm">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-[#041d3c] font-black text-[10px] uppercase tracking-wider">
              5-Star Resort
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-gray-400 text-[10.5px] font-extrabold uppercase tracking-widest mb-0.5">
                Starting From
              </p>
              <div className="flex items-baseline gap-1.5">
                {resort.discount > 0 ? (
                  <>
                    <span className="text-gray-400 font-bold text-[18px] line-through decoration-rose-500/50">
                      €{resort.price?.toString().replace(/€/g, "").trim()}
                    </span>
                    <span className="text-[#041d3c] font-extrabold text-[28px] leading-none">
                      €
                      {Math.round(
                        Number(
                          resort.price?.toString().replace(/€/g, "").trim(),
                        ) *
                          (1 - resort.discount / 100),
                      )}
                    </span>
                  </>
                ) : (
                  <span className="text-[#041d3c] font-extrabold text-[28px] leading-none">
                    €{resort.price?.toString().replace(/€/g, "").trim()}
                  </span>
                )}
                <span className="text-gray-400 text-[14px] font-semibold">
                  / night
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-[10.5px] font-extrabold uppercase tracking-widest mb-0.5">
                Transfer
              </p>
              <div className="flex items-center gap-1 text-[#041d3c] font-bold text-[13px]">
                <Clock className="w-4 h-4" />
                {resort.transfer}
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#041d3c]/6 mb-5" />

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/358408192758?text=Hi! I'm interested in the ${encodeURIComponent(resort.title)} resort. Can you help me check availability?`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("Resort Package Sidebar", resort.title)}
            className="w-full bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white rounded-[14px] py-3.5 font-extrabold text-[14px] flex items-center justify-center gap-2.5 hover:shadow-[0_12px_28px_rgba(7,94,84,0.30)] hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700" />
            <WaIcon />
            <span className="relative z-10">WhatsApp Us</span>
          </a>

          <button
            onClick={() => scrollToForm()}
            className="w-full mt-3 bg-[#041d3c] hover:bg-[#1a84ff] text-white rounded-[14px] py-3.5 font-extrabold text-[14px] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(26,132,255,0.25)] hover:-translate-y-0.5"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">
      {/* ── HERO ── */}
      <section className="relative w-full h-[70vh] min-h-[540px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={resort.heroImage}
            alt={resort.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/95 via-[#041d3c]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/30 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 pb-12 lg:pb-16 flex flex-col items-start">
          {/* Breadcrumb */}
          <Link
            href={
              isSpecialOffer
                ? "/special-offers"
                : `/maldives-resorts/${categoryId}`
            }
            className="flex items-center gap-1.5 text-white/45 hover:text-white text-[11.5px] font-semibold uppercase tracking-wider mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {isSpecialOffer ? "Back to Special Offers" : "Back to Category"}
          </Link>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <Star className="w-3 h-3 text-[#D4AF37]" />
            <span>{resort.starRating || 5}-Star Resort</span>
          </div>

          <h1 className="text-white font-bold text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight drop-shadow-lg mb-4 max-w-3xl">
            {resort.title}
          </h1>
          <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-5" />

          {/* Inline stats strip */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Location chip */}
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-[10px] px-3.5 py-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-white/80 font-semibold text-[12px]">
                {resort.location}
              </span>
            </div>
            {/* Transfer */}
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-[10px] px-3.5 py-2">
              <Compass className="w-3.5 h-3.5 text-[#1a84ff]" />
              <span className="text-white/80 font-semibold text-[12px]">
                {resort.transfer}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW + STICKY BOOKING CARD ── */}
      <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-[80px] lg:py-[100px]">
        {resort.customOffers && resort.customOffers.length > 0 ? (
          <div className="flex flex-col gap-12 lg:gap-16">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 lg:items-start">
              <div className="flex-1 min-w-0">{overviewHeader}</div>
              <div id="special-package" className="w-full lg:w-[420px] shrink-0 scroll-mt-32">
                <div
                  className="w-full rounded-[24px] bg-white shadow-[0_16px_48px_rgba(4,29,60,0.06)] border border-[#041d3c]/5 p-8 flex flex-col items-center text-center relative group"
                  onMouseEnter={() => setIsCarouselHovered(true)}
                  onMouseLeave={() => setIsCarouselHovered(false)}
                >
                  <span className="bg-[#ff245b] text-white text-[11px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-5 relative z-10">
                    Special Package
                  </span>
                  
                  {resort.customOffers.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSidebarOfferIndex((prev) => (prev - 1 + resort.customOffers.length) % resort.customOffers.length);
                        }}
                        className="absolute left-4 top-[250px] -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-100 text-gray-400 hover:text-[#1a84ff] hover:border-[#1a84ff]/20 hover:scale-110 transition-all duration-300 z-20 opacity-100 lg:opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-5 h-5 ml-[-1px]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSidebarOfferIndex((prev) => (prev + 1) % resort.customOffers.length);
                        }}
                        className="absolute right-4 top-[250px] -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-100 text-gray-400 hover:text-[#1a84ff] hover:border-[#1a84ff]/20 hover:scale-110 transition-all duration-300 z-20 opacity-100 lg:opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5 mr-[-1px]" />
                      </button>
                    </>
                  )}

                  <div className="w-full relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={sidebarOfferIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <div className="flex flex-col gap-3 w-full bg-[#f8fafc] border border-[#e4eaf2] p-4 rounded-[16px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Moon className="w-4 h-4 text-[#1a84ff]" />
                        <span className="text-[13px] font-medium uppercase tracking-wider">Duration</span>
                      </div>
                      <span className="text-[#041d3c] font-bold text-[14px]">
                        {resort.customOffers[sidebarOfferIndex].nights} Nights
                      </span>
                    </div>
                    <div className="h-[1px] w-full bg-[#e4eaf2]" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Users className="w-4 h-4 text-[#1a84ff]" />
                        <span className="text-[13px] font-medium uppercase tracking-wider">Guests</span>
                      </div>
                      <span className="text-[#041d3c] font-bold text-[14px]">
                        {resort.customOffers[sidebarOfferIndex].adults ?? 2} Adults
                        {resort.customOffers[sidebarOfferIndex].children
                          ? `, ${resort.customOffers[sidebarOfferIndex].children} Children`
                          : ""}
                      </span>
                    </div>
                    {resort.customOffers[sidebarOfferIndex].villas &&
                      resort.customOffers[sidebarOfferIndex].villas.length > 0 && (
                        <>
                          <div className="h-[1px] w-full bg-[#e4eaf2]" />
                          <div className="flex items-center justify-between text-left gap-4">
                            <div className="flex items-center gap-2 text-gray-500 shrink-0">
                              <BedDouble className="w-4 h-4 text-[#1a84ff]" />
                              <span className="text-[13px] font-medium uppercase tracking-wider">
                                Room/Villa
                              </span>
                            </div>
                            <span className="text-[#041d3c] font-bold text-[13px] leading-tight text-right line-clamp-2">
                              {resort.customOffers[sidebarOfferIndex].villas.join(
                                ", ",
                              )}
                            </span>
                          </div>
                        </>
                      )}
                    {resort.customOffers[sidebarOfferIndex].flightIncluded && (
                      <>
                        <div className="h-[1px] w-full bg-[#e4eaf2]" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Plane className="w-4 h-4 text-[#1a84ff]" />
                            <span className="text-[13px] font-medium uppercase tracking-wider">
                              Flight
                            </span>
                          </div>
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[13px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Included
                          </span>
                        </div>
                      </>
                    )}
                    {resort.customOffers[sidebarOfferIndex].mealPlan && (
                      <>
                        <div className="h-[1px] w-full bg-[#e4eaf2]" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-500">
                            <UtensilsCrossed className="w-4 h-4 text-[#1a84ff]" />
                            <span className="text-[13px] font-medium uppercase tracking-wider">
                              Meal Plan
                            </span>
                          </div>
                          <span className="text-[#041d3c] font-bold text-[14px]">
                            {resort.customOffers[sidebarOfferIndex].mealPlan === "BB"
                              ? "Bed and Breakfast"
                              : resort.customOffers[sidebarOfferIndex].mealPlan ===
                                  "HB"
                                ? "Half Board"
                                : resort.customOffers[sidebarOfferIndex].mealPlan ===
                                    "FB"
                                  ? "Full Board"
                                  : resort.customOffers[sidebarOfferIndex].mealPlan ===
                                      "AI"
                                    ? "All Inclusive"
                                    : resort.customOffers[sidebarOfferIndex].mealPlan}
                          </span>
                        </div>
                      </>
                    )}
                    {resort.customOffers[sidebarOfferIndex].transfer && (
                      <>
                        <div className="h-[1px] w-full bg-[#e4eaf2]" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Plane className="w-4 h-4 text-[#1a84ff]" />
                            <span className="text-[13px] font-medium uppercase tracking-wider">
                              Transfer
                            </span>
                          </div>
                          <span className="text-[#041d3c] font-bold text-[14px]">
                            {resort.customOffers[sidebarOfferIndex].transfer}
                          </span>
                        </div>
                      </>
                    )}
                    {resort.customOffers[sidebarOfferIndex].validFrom &&
                      resort.customOffers[sidebarOfferIndex].validTo && (
                        <>
                          <div className="h-[1px] w-full bg-[#e4eaf2]" />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="w-4 h-4 text-[#1a84ff]" />
                              <span className="text-[13px] font-medium uppercase tracking-wider">
                                Travel Period
                              </span>
                            </div>
                            <span className="text-[#041d3c] font-bold text-[13px]">
                              {new Date(
                                resort.customOffers[sidebarOfferIndex].validFrom +
                                  "T00:00:00Z",
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                timeZone: "UTC",
                              })}{" "}
                              -{" "}
                              {new Date(
                                resort.customOffers[sidebarOfferIndex].validTo +
                                  "T00:00:00Z",
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                timeZone: "UTC",
                              })}
                            </span>
                          </div>
                        </>
                      )}
                    {resort.customOffers[sidebarOfferIndex].bookBefore && (
                      <>
                        <div className="h-[1px] w-full bg-[#e4eaf2]" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4 text-[#1a84ff]" />
                            <span className="text-[13px] font-medium uppercase tracking-wider text-gray-500">
                              Book Before
                            </span>
                          </div>
                          <span className="text-rose-500 font-bold text-[13px]">
                            {new Date(
                              resort.customOffers[sidebarOfferIndex].bookBefore +
                                "T00:00:00Z",
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              timeZone: "UTC",
                            })}
                          </span>
                        </div>
                      </>
                    )}
                    
                    <div className="h-[1px] w-full bg-[#e4eaf2] my-2" />

                    <div className="flex flex-col items-center justify-center w-full mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mt-0.5">
                          {resort.customOffers[sidebarOfferIndex].offerType === 'fixed' ? 'Package Price' : 'Starting From'}
                        </span>
                        {(resort.customOffers[sidebarOfferIndex].offerType === 'starting'
                          ? (resort.customOffers[sidebarOfferIndex].discountPercentage || 0) > 0
                          : ((Number(resort.price) || 0) * (Number(resort.customOffers[sidebarOfferIndex].nights) || 0)) > resort.customOffers[sidebarOfferIndex].offerPrice
                        ) && (
                          <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-1.5 py-0.5 rounded-[4px]">
                            {resort.customOffers[sidebarOfferIndex].offerType === 'starting'
                              ? resort.customOffers[sidebarOfferIndex].discountPercentage
                              : Math.round(((((Number(resort.price) || 0) * (Number(resort.customOffers[sidebarOfferIndex].nights) || 0)) - resort.customOffers[sidebarOfferIndex].offerPrice) / ((Number(resort.price) || 0) * (Number(resort.customOffers[sidebarOfferIndex].nights) || 0))) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      <div className="flex items-end gap-2">
                        {((Number(resort.price) || 0) * (Number(resort.customOffers[sidebarOfferIndex].nights) || 0)) > resort.customOffers[sidebarOfferIndex].offerPrice && (
                          <span className="text-gray-400 text-[16px] font-bold line-through mb-0.5">
                            €{(Number(resort.price) || 0) * (Number(resort.customOffers[sidebarOfferIndex].nights) || 0)}
                          </span>
                        )}
                        <span className="text-[#041d3c] text-[36px] font-black leading-none">
                          €{resort.customOffers[sidebarOfferIndex].offerPrice}
                        </span>
                      </div>
                    </div>

                    {(() => {
                      const co = resort.customOffers[sidebarOfferIndex];
                      const adults = co.adults ?? 2;
                      const children = co.children ?? 0;
                      const waText = `Hi! I'm interested in the ${co.offerName || `${co.nights} Nights offer`} for ${adults} Adults${children > 0 ? ` and ${children} Children` : ""}${co.villas?.length > 0 ? ` staying in a ${co.villas.join(" or ")}` : ""} at ${resort.title} for €${co.offerPrice}. Can you check availability?`;
                      return (
                        <div className="flex flex-col gap-2 w-full mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              lockOffer(sidebarOfferIndex);
                              scrollToForm();
                            }}
                            className="w-full py-3.5 bg-[#041d3c] text-white rounded-[12px] font-extrabold text-[14px] hover:bg-[#1a84ff] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_24px_rgba(4,29,60,0.12)]"
                          >
                            Book Now
                          </button>
                          <a
                            href={`https://wa.me/358408192758?text=${encodeURIComponent(waText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackWhatsAppClick("Resort Offer List", resort.title)}
                            className="w-full bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white rounded-[12px] py-3.5 font-extrabold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_8px_24px_rgba(7,94,84,0.25)] hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                            <WaIcon />
                            <span className="relative z-10">WhatsApp Us</span>
                          </a>
                        </div>
                      );
                    })()}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Carousel Indicators */}
                    {resort.customOffers.length > 1 && (
                      <div className="flex justify-center gap-1.5 mt-5">
                        {resort.customOffers.map((_: any, i: number) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSidebarOfferIndex(i);
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              i === sidebarOfferIndex
                                ? "bg-[#1a84ff] w-3"
                                : "bg-[#041d3c]/20 hover:bg-[#041d3c]/40"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 lg:items-start">
              <div className="flex-1 min-w-0">{featuresAndReviews}</div>
              {packageBox}
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 lg:items-start">
            <div className="flex-1 min-w-0">
              {overviewHeader}
              {featuresAndReviews}
            </div>
            {packageBox}
          </div>
        )}
      </section>

      {/* ── GALLERY + INQUIRY FORM ── */}
      <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 pb-[100px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
          {/* ── GALLERY ── */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10 w-fit">
              <Images className="w-3.5 h-3.5" />
              <span>✦ RESORT GALLERY</span>
            </div>
            <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-2">
              Visual Experience
            </h2>
            <p className="text-gray-400 text-[13px] font-medium mb-6">
              {resort.gallery.length} photos · Click any image to preview
            </p>

            {/* Hero image */}
            <div
              className="relative rounded-[20px] overflow-hidden shadow-[0_8px_32px_rgba(4,29,60,0.10)] mb-3 h-[280px] lg:h-[320px] cursor-pointer group"
              onClick={() => openLightbox(0)}
            >
              <ImageWithFallback
                src={resort.gallery[0]?.url || resort.heroImage}
                alt={resort.gallery[0]?.caption || resort.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#041d3c]/0 group-hover:bg-[#041d3c]/25 transition-all duration-400 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-[#041d3c]/60 backdrop-blur-sm text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-[6px]">
                {resort.gallery[0]?.caption || "Resort View"}
              </div>
            </div>

            {/* Thumbnail grid — 2x2 layout */}
            <div className="grid grid-cols-2 gap-3">
              {resort.gallery.slice(1, 5).map((img: any, i: number) => {
                const actualIdx = i + 1;
                const isLast = i === 3 && resort.gallery.length > 5;
                const remaining = resort.gallery.length - 5;
                return (
                  <div
                    key={actualIdx}
                    className="relative rounded-[16px] overflow-hidden shadow-[0_4px_16px_rgba(4,29,60,0.08)] h-[130px] lg:h-[160px] cursor-pointer group"
                    onClick={() => openLightbox(actualIdx)}
                  >
                    <ImageWithFallback
                      src={img.url}
                      alt={img.caption || "Resort View"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {isLast ? (
                      <div className="absolute inset-0 bg-[#041d3c]/70 backdrop-blur-sm flex flex-col items-center justify-center">
                        <span className="text-white font-black text-[24px] lg:text-[28px] leading-none">
                          +{remaining}
                        </span>
                        <span className="text-white/70 text-[11px] lg:text-[12px] font-semibold uppercase tracking-wider mt-1">
                          more
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-[#041d3c]/0 group-hover:bg-[#041d3c]/30 transition-all duration-300 flex items-center justify-center">
                        <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inquiry form */}
          <div
            id="inquire-form"
            className="w-full lg:w-[480px] shrink-0 scroll-mt-32"
          >
            <div className="bg-white rounded-[24px] shadow-[0_16px_48px_rgba(4,29,60,0.08)] p-8 border border-[#041d3c]/5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10 w-fit">
                <span>✦ QUICK INQUIRY</span>
              </div>
              <h3 className="text-[#041d3c] font-black text-[26px] leading-tight mb-1">
                Inquire Now
              </h3>
              <p className="text-gray-400 text-[13px] font-medium mb-6">
                Fill in the form and we'll get back to you within 24 hours.
              </p>

              <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
                {/* Row 1 — Names */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name *"
                      {...register("firstName", {
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters",
                        },
                        pattern: {
                          value: /^[A-Za-z\\s]+$/,
                          message: "Letters only",
                        },
                      })}
                      className={`w-full bg-[#f8fafc] border ${errors.firstName ? "border-red-400" : "border-[#e4eaf2]"} rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors placeholder:text-gray-400`}
                    />
                    {errors.firstName && (
                      <span className="text-red-500 text-[10px] font-bold mt-1 block px-1">
                        {errors.firstName.message as string}
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Surname *"
                      {...register("surname", {
                        required: "Surname is required",
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters",
                        },
                        pattern: {
                          value: /^[A-Za-z\\s]+$/,
                          message: "Letters only",
                        },
                      })}
                      className={`w-full bg-[#f8fafc] border ${errors.surname ? "border-red-400" : "border-[#e4eaf2]"} rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors placeholder:text-gray-400`}
                    />
                    {errors.surname && (
                      <span className="text-red-500 text-[10px] font-bold mt-1 block px-1">
                        {errors.surname.message as string}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email format",
                      },
                    })}
                    className={`w-full bg-[#f8fafc] border ${errors.email ? "border-red-400" : "border-[#e4eaf2]"} rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors placeholder:text-gray-400`}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-[10px] font-bold mt-1 block px-1">
                      {errors.email.message as string}
                    </span>
                  )}
                </div>

                {/* Country + Phone with auto-code */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative z-20">
                    <CountrySelect
                      value={watchedCountry}
                      onChange={(val) => {
                        setValue("country", val, { shouldValidate: true });
                      }}
                      error={errors.country?.message as string}
                    />
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
                        placeholder={phoneCode ? "" : "Phone (+code)"}
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors placeholder:text-gray-400"
                        style={{
                          paddingLeft: phoneCode
                            ? `${phoneCode.length * 8 + 18}px`
                            : "16px",
                          paddingRight: "12px",
                        }}
                      />
                    </div>
                    {(!phoneNumber ||
                      phoneNumber.replace(/\D/g, "").length < 7) &&
                      phoneNumber.length > 0 && (
                        <span className="text-red-500 text-[10px] font-bold mt-1 block px-1">
                          Valid phone required
                        </span>
                      )}
                  </div>
                </div>

                {/* Check-In + Number of Nights */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    {!watchedCheckIn && (
                      <div
                        className={`absolute inset-0 w-full bg-[#f8fafc] border ${errors.checkIn ? "border-red-400" : "border-[#e4eaf2]"} rounded-[12px] px-4 py-3 text-gray-400 font-medium text-[13px] pointer-events-none flex items-center`}
                      >
                        Check-In *
                      </div>
                    )}
                    <input
                      type="date"
                      {...register("checkIn", {
                        required: "Check-in date is required",
                      })}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full bg-[#f8fafc] border ${errors.checkIn ? "border-red-400" : "border-[#e4eaf2]"} rounded-[12px] px-4 py-3 font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer relative z-10 ${watchedCheckIn ? "text-[#041d3c]" : "opacity-0"}`}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    {errors.checkIn && (
                      <span className="text-red-500 text-[10px] font-bold mt-1 block px-1">
                        {errors.checkIn.message as string}
                      </span>
                    )}
                  </div>

                  {/* Number of Nights */}
                  <div className="relative">
                    <select
                      {...register("nights")}
                      className={`w-full appearance-none bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer ${isCustomOfferSelected ? "pointer-events-none bg-gray-100 opacity-80" : ""}`}
                    >
                      {[
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 21, 28,
                      ].map((n) => (
                        <option key={n} value={String(n)}>
                          {n} {n === 1 ? "Night" : "Nights"}
                        </option>
                      ))}
                    </select>
                    <Moon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                {/* Check-out display pill */}
                {checkOutDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 bg-[#eef6ff] border border-[#1a84ff]/20 rounded-[10px] px-4 py-2.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#1a84ff] shrink-0" />
                    <span className="text-[#1a84ff] font-semibold text-[12px]">
                      Check-out:
                    </span>
                    <span className="text-[#041d3c] font-black text-[13px] ml-auto">
                      {checkOutDate}
                    </span>
                  </motion.div>
                )}

                {/* Optional Selected Offer Dropdown */}
                {((resort.customOffers && resort.customOffers.length > 0) ||
                  (resort.offers && resort.offers.length > 0)) && (
                  <div>
                    <select
                      value={isCustomOfferSelected ? (lockedOffer ? `${lockedOffer.nights} Nights · ${lockedOffer.adults ?? 2} Adults${(lockedOffer.children ?? 0) > 0 ? ` · ${lockedOffer.children} Children` : ""}${lockedOffer.villas?.length > 0 ? ` · ${lockedOffer.villas.join(" or ")}` : ""} · €${lockedOffer.offerPrice}` : "") : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) { clearLockedOffer(); return; }
                        const idx = resort.customOffers?.findIndex((co: any) => {
                          const adults = co.adults ?? 2;
                          const children = co.children ?? 0;
                          const v = `${co.nights} Nights · ${adults} Adults${children > 0 ? ` · ${children} Children` : ""}${co.villas?.length > 0 ? ` · ${co.villas.join(" or ")}` : ""} · €${co.offerPrice}`;
                          return v === val;
                        });
                        if (idx !== undefined && idx >= 0) lockOffer(idx);
                        else clearLockedOffer();
                      }}
                      className="w-full appearance-none bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer"
                    >
                      <option value="">Select Package Offer (Optional)</option>
                      {resort.customOffers?.map((co: any, i: number) => {
                        const adults = co.adults ?? 2;
                        const children = co.children ?? 0;
                        const valString = `${co.nights} Nights · ${adults} Adults${children > 0 ? ` · ${children} Children` : ""}${co.villas?.length > 0 ? ` · ${co.villas.join(" or ")}` : ""} · €${co.offerPrice}`;
                        return (
                          <option key={`co-${i}`} value={valString}>
                            {valString}
                          </option>
                        );
                      })}
                      {resort.offers?.map((offer: string, i: number) => (
                        <option key={`o-${i}`} value={offer}>
                          {offer}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Locked Offer Banner — shows when an offer is selected via Book Now or dropdown */}
                {isCustomOfferSelected && lockedOffer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-rose-50 border border-rose-200 rounded-[14px] px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-rose-600 font-black text-[10px] uppercase tracking-widest">
                        Selected Offer — Fields Locked
                      </span>
                      <span className="text-[#041d3c] font-bold text-[13px] truncate">
                        {lockedOffer.nights} Nights &middot; {lockedOffer.adults ?? 2} Adults
                        {(lockedOffer.children ?? 0) > 0 && ` · ${lockedOffer.children} Children`}
                        {lockedOffer.villas?.length > 0 && ` · ${lockedOffer.villas.join(" or ")}`}
                        &nbsp;&mdash;&nbsp;
                        <span className="text-rose-500 font-black">€{lockedOffer.offerPrice}</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={clearLockedOffer}
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-rose-200 text-rose-400 hover:text-rose-600 hover:border-rose-400 transition-colors"
                      title="Clear offer selection"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}

                {/* Number of Guests */}
                <div>
                  <p className="text-[#041d3c] font-extrabold text-[12px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#1a84ff]" />
                    Number of Guests
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Adults */}
                    <div className="relative">
                      <select
                        {...register("adults")}
                        className={`w-full appearance-none bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-3 py-3 text-[#041d3c] font-medium text-[12px] focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer ${isCustomOfferSelected ? "pointer-events-none bg-gray-100 opacity-80" : ""}`}
                      >
                        {Array.from({ length: 50 }, (_, i) => i + 1).map(
                          (n) => (
                            <option key={n} value={String(n)}>
                              {n} Adult{n > 1 ? "s" : ""}
                            </option>
                          ),
                        )}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                        Adults
                      </span>
                    </div>

                    {/* Children */}
                    <div className="relative">
                      <select
                        {...register("children")}
                        className={`w-full appearance-none bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-3 py-3 text-[#041d3c] font-medium text-[12px] focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer ${isCustomOfferSelected ? "pointer-events-none bg-gray-100 opacity-80" : ""}`}
                      >
                        {Array.from({ length: 51 }, (_, i) => i).map((n) => (
                          <option key={n} value={String(n)}>
                            {n} Child{n !== 1 ? "ren" : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                        2–12y
                      </span>
                    </div>

                    {/* Infants */}
                    <div className="relative">
                      <select
                        {...register("infants")}
                        className="w-full appearance-none bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-3 py-3 text-[#041d3c] font-medium text-[12px] focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer"
                      >
                        {Array.from({ length: 21 }, (_, i) => i).map((n) => (
                          <option key={n} value={String(n)}>
                            {n} Infant{n !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                        Under 2
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resort (readonly) */}
                <div className="bg-[#f8fafc] rounded-[12px] px-4 py-3 border border-[#e4eaf2] flex items-center">
                  <span className="text-[#041d3c] font-medium text-[13px] truncate">
                    {resort.title}
                  </span>
                  <input
                    type="hidden"
                    value={resort.title}
                    {...register("resort")}
                  />
                </div>

                {/* Room type */}
                <div className="relative">
                  <select
                    defaultValue=""
                    {...register("roomType")}
                    className={`w-full appearance-none bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer ${isCustomOfferSelected ? "pointer-events-none bg-gray-100 opacity-80" : ""}`}
                  >
                    <option value="" disabled className="text-gray-400">
                      Room Type
                    </option>
                    {resort.villas?.length > 0 ? (
                      resort.villas.map((villa: any, idx: number) => (
                        <option key={idx} value={villa.title}>
                          {villa.title}
                        </option>
                      ))
                    ) : (
                      <option value="Standard Room">Standard Room</option>
                    )}
                    {/* Add dynamic option if custom offer has multiple villas that don't match exactly */}
                    {isCustomOfferSelected &&
                      watch("roomType") &&
                      !resort.villas?.some(
                        (v: any) => v.title === watch("roomType"),
                      ) && (
                        <option value={watch("roomType")} hidden>
                          {watch("roomType")}
                        </option>
                      )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Notes */}
                <textarea
                  placeholder="Any special requests or details…"
                  rows={4}
                  {...register("details")}
                  className="w-full bg-[#f8fafc] border border-[#e4eaf2] rounded-[12px] px-4 py-3 text-[#041d3c] font-medium text-[13px] focus:outline-none focus:border-[#1a84ff] transition-colors placeholder:text-gray-400 resize-none"
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#041d3c] hover:bg-[#1a84ff] disabled:bg-[#041d3c]/60 text-white font-extrabold text-[13px] tracking-wider uppercase px-8 py-4 rounded-[14px] transition-all duration-300 shadow-[0_8px_24px_rgba(4,29,60,0.12)] hover:shadow-[0_12px_32px_rgba(26,132,255,0.25)] hover:-translate-y-0.5 mt-1"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Request a Quote"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABS ── */}
      <section id="resort-details-tabs" className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 pb-[100px] scroll-mt-32">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
            <span>✦ RESORT DETAILS</span>
          </div>
          <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
            Explore the Resort
          </h2>
          <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full" />
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-[12px] text-[13px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-[#041d3c] text-white shadow-[0_8px_24px_rgba(4,29,60,0.18)] -translate-y-0.5"
                    : "bg-white text-gray-500 border border-[#041d3c]/8 hover:border-[#041d3c]/20 hover:text-[#041d3c] hover:-translate-y-0.5 shadow-[0_2px_10px_rgba(4,29,60,0.04)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content panel */}
        <div className="bg-white rounded-[28px] shadow-[0_8px_40px_rgba(4,29,60,0.06)] p-8 lg:p-12 min-h-[400px] border border-[#041d3c]/5 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* VILLAS */}
            {activeTab === "villas" && (
              <motion.div
                key="villas"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col space-y-0"
              >
                {resort.villas?.map((villa: any, idx: number) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 border-b border-[#041d3c]/7 first:pt-0 last:border-0 last:pb-0"
                  >
                    <div className="lg:col-span-4">
                      <VillaImageSlider
                        images={villa.images}
                        fallbackImage={resort.heroImage}
                        alt={villa.title}
                      />
                    </div>
                    <div className="lg:col-span-8 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-[#041d3c] text-[22px] font-black mb-3">
                          {villa.title}
                        </h4>
                        <p className="text-gray-500 text-[15px] mb-6 leading-[1.8] whitespace-pre-wrap break-words">
                          {villa.description}
                        </p>

                        {/* Stats strip */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 bg-[#f8fafc] py-3 px-5 rounded-[14px] border border-[#041d3c]/5 w-fit">
                          <div className="flex items-center gap-2 text-[#041d3c] text-[12.5px] font-semibold tracking-wide uppercase">
                            <Maximize className="w-4 h-4 text-[#1a84ff]" />{" "}
                            {villa.size
                              ?.toString()
                              .replace(/sqm/i, "")
                              .trim() || "-"}{" "}
                            sqm
                          </div>
                          <div className="w-1 h-1 rounded-full bg-[#041d3c]/20 hidden sm:block" />
                          <div className="flex items-center gap-2 text-[#041d3c] text-[12.5px] font-semibold tracking-wide uppercase">
                            <Users className="w-4 h-4 text-[#1a84ff]" />{" "}
                            {villa.capacity
                              ? villa.capacity
                                  .split("|")
                                  .map((combo: string) =>
                                    combo
                                      .split(",")
                                      .map((s: string) => s.trim())
                                      .filter(
                                        (s: string) => !s.startsWith("0 "),
                                      )
                                      .join(" and "),
                                  )
                                  .filter(Boolean)
                                  .join(" or ")
                              : "Not specified"}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-[#041d3c]/20 hidden sm:block" />
                          <div className="flex items-center gap-2 text-[#041d3c] text-[12.5px] font-semibold tracking-wide uppercase">
                            <BedDouble className="w-4 h-4 text-[#1a84ff]" />{" "}
                            {villa.bedType
                              ? villa.bedType
                                  .split(",")
                                  .map((s: string) => s.trim())
                                  .join(" or ")
                              : "Not specified"}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 mb-8">
                          {villa.features?.map((f: string, fi: number) => (
                            <div key={fi} className="flex items-center gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-[#1a84ff] shrink-0" />
                              <span className="text-gray-600 text-[13.5px] font-medium">
                                {f}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-[#041d3c]/6">
                        <button
                          onClick={() =>
                            document
                              .getElementById("inquire-form")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                          className="flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-[#041d3c] hover:bg-[#1a84ff] text-white rounded-[14px] font-extrabold text-[13px] uppercase tracking-wider transition-all duration-300 hover:shadow-[0_8px_24px_rgba(26,132,255,0.25)] hover:-translate-y-0.5"
                        >
                          Book Now
                        </button>
                        <a
                          href={`https://wa.me/358408192758?text=Hi! I'm interested in the ${encodeURIComponent(resort.title)} resort. Can you help me check availability?`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackWhatsAppClick("Resort Villa View", resort.title)}
                          className="flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white rounded-[14px] font-extrabold text-[13px] uppercase tracking-wider transition-all duration-300 hover:shadow-[0_8px_24px_rgba(7,94,84,0.25)] hover:-translate-y-0.5 group relative overflow-hidden"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                          <WaIcon />
                          <span className="relative z-10">WhatsApp Us</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* RESTAURANTS */}
            {activeTab === "restaurants" && (
              <motion.div
                key="restaurants"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col"
              >
                {resort.restaurants?.map((r: any, idx: number) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 border-b border-[#041d3c]/7 first:pt-0 last:border-0 last:pb-0"
                  >
                    <div className="lg:col-span-4 overflow-hidden rounded-[20px] shadow-[0_4px_16px_rgba(4,29,60,0.08)] self-start">
                      <ImageWithFallback
                        src={
                          r.image ||
                          resort.gallery?.[idx % resort.gallery.length]?.url ||
                          resort.heroImage
                        }
                        alt={r.title}
                        className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="lg:col-span-8 flex flex-col py-1">
                      <h4 className="text-[#041d3c] text-[22px] font-black mb-3">
                        {r.title}
                      </h4>
                      <p className="text-gray-500 text-[15px] mb-6 leading-[1.8] whitespace-pre-wrap break-words">
                        {r.description}
                      </p>
                      <div className="flex flex-col gap-3 max-w-sm">
                        {r.schedules?.map((s: any, si: number) => (
                          <div key={si} className="flex items-center">
                            <span className="text-[#041d3c] text-[12.5px] font-extrabold uppercase tracking-wider w-[110px] shrink-0">
                              {s.meal}
                            </span>
                            <div className="flex-1 border-b-2 border-dotted border-[#041d3c]/15 mx-4" />
                            <span className="text-gray-600 text-[13.5px] font-semibold whitespace-nowrap shrink-0">
                              {s.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* FACILITIES */}
            {activeTab === "facilities" && (
              <motion.div
                key="facilities"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-[#041d3c] font-black text-[26px] mb-8">
                  Resort Facilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resort.facilities?.map((label: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-[#f8fafc] rounded-[16px] px-5 py-4 border border-[#041d3c]/5 hover:border-[#1a84ff]/20 hover:bg-[#eef6ff] transition-all"
                    >
                      <div className="w-10 h-10 rounded-[12px] bg-[#1a84ff]/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-[#1a84ff]" />
                      </div>
                      <p className="text-[#041d3c] font-bold text-[14px]">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FACT SHEET */}
            {activeTab === "fact-sheet" && (
              <motion.div
                key="fact-sheet"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-[#041d3c] font-black text-[26px] mb-4">
                  FACT Sheet
                </h3>
                <p className="text-gray-500 text-[15px] font-medium leading-[1.8] mb-6">
                  Download or view our comprehensive resort fact sheet for
                  detailed information on villa dimensions, dining hours, and
                  the full amenities list.
                </p>
                {resort.factSheets && resort.factSheets.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {resort.factSheets.map((fs: any, i: number) => (
                      <a
                        key={i}
                        href={fs.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-2 bg-[#041d3c] hover:bg-[#1a84ff] text-white font-extrabold text-[13px] uppercase tracking-wider px-7 py-3.5 rounded-[14px] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(26,132,255,0.25)] hover:-translate-y-0.5"
                      >
                        Download {fs.name} (PDF)
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 font-medium">
                    No FACT sheet available at this time.
                  </p>
                )}
              </motion.div>
            )}

            {/* DEALS */}
            {activeTab === "deals" && (
              <motion.div
                key="deals"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-[#041d3c] font-black text-[26px] mb-6">
                  Deals & Offers
                </h3>

                {resort.discount > 0 && resort.offerPoster && (
                  <div className="w-full mb-8 rounded-[24px] overflow-hidden shadow-[0_16px_48px_rgba(4,29,60,0.08)] border border-[#041d3c]/5">
                    <ImageWithFallback
                      src={resort.offerPoster}
                      alt="Resort Offer"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                {resort.customOffers && resort.customOffers.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-8">
                    {resort.customOffers.map((co: any, i: number) => {
                      const actualPrice =
                        (Number(resort.price) || 0) * (Number(co.nights) || 0);
                      const adults = co.adults ?? 2;
                      const children = co.children ?? 0;
                      const hasAnyInclusions =
                        (co.includes && co.includes.length > 0) ||
                        (co.excludes && co.excludes.length > 0);

                      const waText = `Hi! I'm interested in the ${co.nights} Nights offer for ${adults} Adults${children > 0 ? ` and ${children} Children` : ""}${co.villas?.length > 0 ? ` staying in a ${co.villas.join(" or ")}` : ""} at ${resort.title} for €${co.offerPrice}. Can you check availability?`;
                      return (
                        <div
                          key={i}
                          className="bg-white border border-[#e4eaf2] rounded-[24px] overflow-hidden shadow-[0_16px_48px_rgba(4,29,60,0.06)] relative group hover:border-[#1a84ff]/30 hover:shadow-[0_20px_56px_rgba(26,132,255,0.12)] transition-all duration-300 flex flex-col w-full h-full p-6 lg:p-8"
                        >
                          <div className="flex flex-col items-center text-center mb-6">
                            <span className="bg-[#ff245b] text-white text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-4 w-fit mx-auto">
                              Special Package
                            </span>
                            <h4 className="text-[#041d3c] text-[22px] font-black leading-tight">
                              {co.offerName || `${co.nights} Nights Offer`}
                            </h4>
                          </div>

                          <div className="mb-6 flex flex-col w-full flex-1 bg-[#f8fafc] border border-[#e4eaf2] p-4 rounded-[16px] space-y-1 divide-y divide-[#e4eaf2]">
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Moon className="w-4 h-4 text-[#1a84ff]" />
                                <span className="text-[12px] font-medium uppercase tracking-wider">
                                  Duration
                                </span>
                              </div>
                              <span className="text-[#041d3c] font-bold text-[13px] text-right">
                                {co.nights} Nights
                              </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Users className="w-4 h-4 text-[#1a84ff]" />
                                <span className="text-[12px] font-medium uppercase tracking-wider">
                                  Guests
                                </span>
                              </div>
                              <span className="text-[#041d3c] font-bold text-[13px] text-right">
                                {adults} Adults
                                {children > 0
                                  ? `, ${children} Children`
                                  : ""}
                              </span>
                            </div>

                            {co.villas && co.villas.length > 0 && (
                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2 text-gray-500">
                                  <BedDouble className="w-4 h-4 text-[#1a84ff]" />
                                  <span className="text-[12px] font-medium uppercase tracking-wider">
                                    Room/Villa
                                  </span>
                                </div>
                                <span className="text-[#041d3c] font-bold text-[13px] text-right line-clamp-2 max-w-[60%]">
                                  {co.villas.join(", ")}
                                </span>
                              </div>
                            )}

                            {co.flightIncluded && (
                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2 text-gray-500">
                                  <Plane className="w-4 h-4 text-[#1a84ff]" />
                                  <span className="text-[12px] font-medium uppercase tracking-wider">
                                    Flight
                                  </span>
                                </div>
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[4px] text-[11px] font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Included
                                </span>
                              </div>
                            )}

                            {co.mealPlan && (
                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2 text-gray-500">
                                  <UtensilsCrossed className="w-4 h-4 text-[#1a84ff]" />
                                  <span className="text-[12px] font-medium uppercase tracking-wider">
                                    Meal Plan
                                  </span>
                                </div>
                                <span className="text-[#041d3c] font-bold text-[13px] text-right">
                                  {co.mealPlan === "BB"
                                    ? "Bed and Breakfast"
                                    : co.mealPlan === "HB"
                                      ? "Half Board"
                                      : co.mealPlan === "FB"
                                        ? "Full Board"
                                        : co.mealPlan === "AI"
                                          ? "All Inclusive"
                                          : co.mealPlan}
                                </span>
                              </div>
                            )}

                            {co.transfer && (
                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2 text-gray-500">
                                  <Plane className="w-4 h-4 text-[#1a84ff]" />
                                  <span className="text-[12px] font-medium uppercase tracking-wider">
                                    Transfer
                                  </span>
                                </div>
                                <span className="text-[#041d3c] font-bold text-[13px] text-right">
                                  {co.transfer}
                                </span>
                              </div>
                            )}

                            {co.validFrom && co.validTo && (
                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2 text-gray-500">
                                  <Calendar className="w-4 h-4 text-[#1a84ff]" />
                                  <span className="text-[12px] font-medium uppercase tracking-wider">
                                    Travel Period
                                  </span>
                                </div>
                                <span className="text-[#041d3c] font-bold text-[13px] text-right">
                                  {new Date(
                                    co.validFrom + "T00:00:00Z",
                                  ).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    timeZone: "UTC",
                                  })}{" "}
                                  -{" "}
                                  {new Date(
                                    co.validTo + "T00:00:00Z",
                                  ).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    timeZone: "UTC",
                                  })}
                                </span>
                              </div>
                            )}

                            {co.bookBefore && (
                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2 text-gray-500">
                                  <Clock className="w-4 h-4 text-[#1a84ff]" />
                                  <span className="text-[12px] font-medium uppercase tracking-wider">
                                    Book Before
                                  </span>
                                </div>
                                <span className="text-rose-500 font-bold text-[13px] text-right">
                                  {new Date(
                                    co.bookBefore + "T00:00:00Z",
                                  ).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    timeZone: "UTC",
                                  })}
                                </span>
                              </div>
                            )}
                            
                            {hasAnyInclusions && (
                              <div className="pt-4 pb-2 border-t border-[#e4eaf2] flex flex-col gap-3">
                                {co.includes?.length > 0 && (
                                  <div className="flex flex-col gap-1.5">
                                    <span className="text-[12px] font-bold text-[#041d3c] uppercase tracking-wider flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      What's Included
                                    </span>
                                    <ul className="flex flex-col gap-1 pl-5">
                                      {co.includes.map((inc: string, idx: number) => (
                                        <li key={idx} className="list-disc text-[12px] text-gray-600 font-medium">
                                          {inc}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {co.excludes?.length > 0 && (
                                  <div className="flex flex-col gap-1.5">
                                    <span className="text-[12px] font-bold text-[#041d3c] uppercase tracking-wider flex items-center gap-1.5">
                                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                      Not Included
                                    </span>
                                    <ul className="flex flex-col gap-1 pl-5">
                                      {co.excludes.map((exc: string, idx: number) => (
                                        <li key={idx} className="list-disc text-[12px] text-gray-500 font-medium">
                                          {exc}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="mt-auto flex flex-col">
                            <div className="flex flex-col items-center justify-center w-full mb-4">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mt-0.5">
                                  {co.offerType === 'fixed' ? 'Package Price' : 'Starting From'}
                                </span>
                                {(co.offerType === 'starting' ? (co.discountPercentage || 0) > 0 : actualPrice > co.offerPrice) && (
                                  <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-1.5 py-0.5 rounded-[4px]">
                                    {co.offerType === 'starting' ? co.discountPercentage : Math.round(((actualPrice - co.offerPrice) / actualPrice) * 100)}% OFF
                                  </span>
                                )}
                              </div>
                              <div className="flex items-end gap-2">
                                {actualPrice > co.offerPrice && (
                                  <span className="text-gray-400 text-[16px] font-bold line-through mb-0.5">
                                    €{actualPrice}
                                  </span>
                                )}
                                <span className="text-[#041d3c] text-[32px] font-black leading-none">
                                  €{co.offerPrice}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  lockOffer(i);
                                  scrollToForm();
                                }}
                                className="w-full py-3.5 bg-[#041d3c] text-white rounded-[12px] font-extrabold text-[14px] hover:bg-[#1a84ff] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_24px_rgba(4,29,60,0.12)]"
                              >
                                Book Now
                              </button>
                              <a
                                href={`https://wa.me/358408192758?text=${encodeURIComponent(waText)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackWhatsAppClick("Resort Selected Offer CTA", resort.title)}
                                className="w-full bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white rounded-[12px] py-3.5 font-extrabold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_8px_24px_rgba(7,94,84,0.25)] hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
                              >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                                <WaIcon />
                                <span className="relative z-10">WhatsApp Us</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {resort.offers && resort.offers.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
                    {resort.offers.map((offer: string, i: number) => {
                      const waText = `Hi! I'm interested in the special offer: "${offer}" at ${resort.title}. Can you check availability?`;
                      return (
                        <div
                          key={i}
                          className="bg-gradient-to-br from-[#1a84ff]/6 to-[#041d3c]/4 border border-[#1a84ff]/12 p-8 rounded-[20px] flex flex-col h-full"
                        >
                          <div className="inline-flex items-center self-start gap-1.5 bg-[#e11d48] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-[6px] mb-4">
                            <Star className="w-3 h-3 fill-white" /> Featured
                            Offer
                          </div>
                          <h4 className="text-[#041d3c] text-[18px] font-black leading-snug mb-6 flex-1">
                            {offer}
                          </h4>
                          <div className="flex flex-col sm:flex-row gap-2 w-full mt-auto">
                            <button
                              onClick={() => {
                                setValue("selectedOffer", offer);
                                document
                                  .getElementById("inquire-form")
                                  ?.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="flex-1 bg-[#041d3c] text-white rounded-[12px] py-3 font-extrabold text-[13px] uppercase tracking-wider flex items-center justify-center transition-all duration-300 hover:bg-[#1a84ff] hover:-translate-y-0.5"
                            >
                              Book Now
                            </button>
                            <a
                              href={`https://wa.me/358408192758?text=${encodeURIComponent(waText)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => trackWhatsAppClick("Resort Other Offer List", resort.title)}
                              className="flex-1 bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white rounded-[12px] py-3 font-extrabold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_8px_24px_rgba(7,94,84,0.25)] hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
                            >
                              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                              <WaIcon />
                              <span className="relative z-10">WhatsApp Us</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {(!resort.offers || resort.offers.length === 0) &&
                  (!resort.customOffers || resort.customOffers.length === 0) &&
                  !(resort.discount > 0 && resort.offerPoster) && (
                    <p className="text-gray-400 font-medium">
                      No special offers available at this time.
                    </p>
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <div className="bg-white">
        <ReviewsSection />
      </div>

      {/* ── LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Blurred dark backdrop */}
            <div className="absolute inset-0 bg-[#041d3c]/95 backdrop-blur-md" />

            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-sm border border-white/15 text-white text-[12px] font-extrabold uppercase tracking-wider px-4 py-2 rounded-full">
              {lightboxIndex + 1} / {resort.gallery.length}
            </div>

            {/* Prev arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 lg:left-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:-translate-x-0.5"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 lg:right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:translate-x-0.5"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main image container */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative z-10 max-w-[88vw] max-h-[82vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={resort.gallery[lightboxIndex].url}
                alt={resort.gallery[lightboxIndex].caption || "Resort View"}
                className="max-w-full max-h-[75vh] rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.6)] object-contain"
              />
              {/* Caption */}
              <div className="mt-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span className="text-white/70 text-[13px] font-semibold tracking-wide">
                  {resort.gallery[lightboxIndex].caption || "Resort View"}
                </span>
              </div>
            </motion.div>

            {/* Thumbnail strip at bottom */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 max-w-[90vw] overflow-x-auto px-2 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {resort.gallery.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(idx);
                  }}
                  className={`shrink-0 w-12 h-9 rounded-[8px] overflow-hidden border-2 transition-all duration-200 ${
                    idx === lightboxIndex
                      ? "border-[#D4AF37] scale-110 shadow-[0_0_12px_rgba(212,175,55,0.5)]"
                      : "border-white/20 opacity-50 hover:opacity-80 hover:border-white/50"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.caption || "Thumbnail"}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
