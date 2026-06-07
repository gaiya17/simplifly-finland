import Link from 'next/link';
import { ImageWithFallback } from '../../../components/shared/ImageWithFallback';
import { ServicesSection } from '../../../components/sections/ServicesSection';
import { ReviewsSection } from '../../../components/sections/ReviewsSection';
import { MapPin, Users, ArrowLeft } from 'lucide-react';
const tripAdvisorLogo = '/images/tripadvisor.png';

// ── Booking.com inline SVG (unique IDs per card) ─────────────────────────────
const BookingComLogo = ({ uid }: { uid: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-[24px] w-auto" viewBox="0 0 5.693 2.848">
    <defs>
      <clipPath id={`A-${uid}`}><path d="M589.5 28.972H684V12.937h-94.5z"/></clipPath>
      <clipPath id={`B-${uid}`}><path d="M589.5 12.937H684v16.035h-94.5z"/></clipPath>
      <clipPath id={`C-${uid}`}><path d="M589.5 28.972H684V12.937h-94.5z"/></clipPath>
      <clipPath id={`D-${uid}`}><path d="M589.5 28.656h94.48V12.958H589.5z"/></clipPath>
      <clipPath id={`E-${uid}`}><path d="M589.5 12.937H684v16.035h-94.5z"/></clipPath>
      <clipPath id={`F-${uid}`}><path d="M589.5 28.972H684V12.937h-94.5z"/></clipPath>
      <clipPath id={`G-${uid}`}><path d="M589.5 12.937H684v16.035h-94.5z"/></clipPath>
    </defs>
    <g transform="matrix(.05809 0 0 -.05809 -34.141832 2.632382)">
      <g clipPath={`url(#F-${uid})`}><g clipPath={`url(#G-${uid})`}>
        <path d="M626.558 27.217a1.436 1.436 0 1 0 2.872 0 1.437 1.437 0 0 0-2.872 0" fill="#003580"/>
        <path d="M649.215 17.64c0 .797.642 1.44 1.433 1.44a1.44 1.44 0 1 0-1.433-1.44" fill="#00b4f1"/>
        <path d="M603 18.263c-1.236 0-2.096.982-2.096 2.386s.86 2.384 2.097 2.384c1.243 0 2.112-.98 2.112-2.384 0-1.426-.85-2.386-2.113-2.386zm0 6.867c-2.616 0-4.515-1.885-4.515-4.48s1.9-4.48 4.515-4.48c2.627 0 4.533 1.884 4.533 4.48s-1.906 4.482-4.532 4.482m20.785-4.706a2.136 2.136 0 0 1-.342.483l-.08.083.084.08a3.56 3.56 0 0 1 .36.45l2.3 3.432h-2.804l-1.735-2.685c-.098-.144-.296-.216-.593-.216h-.395v5.076c0 1.015-.633 1.153-1.316 1.153h-1.17l.003-11.98h2.484v3.594h.233c.283 0 .475-.033.564-.187l1.37-2.586c.383-.702.764-.82 1.482-.82h1.903l-1.418 2.344-.94 1.78m12.057 4.726c-1.264 0-2.07-.562-2.522-1.037l-.15-.152-.054.207c-.132.51-.58.788-1.253.788h-1.113l.007-8.653h2.467v3.988c0 .39.05.728.154 1.037.274.935 1.04 1.516 1.997 1.516.77 0 1.07-.407 1.07-1.457v-3.77c0-.896.415-1.315 1.312-1.315h1.174l-.004 5.504c0 2.186-1.067 3.342-3.086 3.342m-7.8-.196h-1.17l.008-8.653h1.247l.044-.002.582.002h.578v.003h.004l.005 7.335c0 .885-.423 1.314-1.298 1.314m-15.345-6.69c-1.236 0-2.097.982-2.097 2.386s.86 2.384 2.098 2.384 2.112-.98 2.112-2.384c0-1.426-.85-2.386-2.112-2.386zm0 6.867c-2.618 0-4.518-1.885-4.518-4.48s1.9-4.48 4.52-4.48 4.533 1.884 4.533 4.48-1.9 4.482-4.533 4.482" fill="#003580"/>
      </g></g>
      <g clipPath={`url(#C-${uid})`}><g clipPath={`url(#D-${uid})`}><g clipPath={`url(#E-${uid})`}>
        <path d="M665.555 18.263c-1.236 0-2.098.982-2.098 2.386s.862 2.384 2.098 2.384c1.242 0 2.113-.98 2.113-2.384 0-1.426-.85-2.386-2.113-2.386zm0 6.867c-2.618 0-4.517-1.885-4.517-4.48s1.9-4.48 4.517-4.48c2.624 0 4.533 1.884 4.533 4.48s-1.9 4.482-4.533 4.482" fill="#00b4f1"/>
        <path d="M644.122 18.644c-1.35 0-1.83 1.176-1.83 2.28 0 .486.123 2.07 1.7 2.07.783 0 1.826-.224 1.826-2.15 0-1.817-.923-2.198-1.697-2.198zm2.978 6.332c-.468 0-.828-.187-1-.528l-.068-.132-.114.1c-.398.344-1.112.753-2.27.753-2.307 0-3.86-1.733-3.86-4.31s1.607-4.376 3.906-4.376c.785 0 1.406.184 1.898.556l.2.143v-.24c0-1.156-.747-1.794-2.102-1.794a4.98 4.98 0 0 0-1.66.306c-.522.158-.83.027-1.04-.498l-.196-.484-.277-.708.17-.09c.868-.46 1.997-.735 3.017-.735 2.1 0 4.554 1.075 4.554 4.1l.01 7.937H647.1" fill="#003580"/>
      </g></g></g>
      <g clipPath={`url(#A-${uid})`}><g clipPath={`url(#B-${uid})`}>
        <path d="M593.805 18.362l-2.008.002v2.4c0 .514.2.78.638.842h1.37c.977 0 1.6-.616 1.6-1.613-.001-1.024-.617-1.63-1.6-1.63zm-2.008 6.476v.632c0 .553.234.816.747.85h1.028c.88 0 1.4-.527 1.4-1.41 0-.672-.362-1.457-1.377-1.457h-1.807zm4.572-2.396l-.363.204.317.27c.37.317.986 1.03.986 2.26 0 1.884-1.46 3.1-3.72 3.1h-2.874a1.26 1.26 0 0 1-1.214-1.244v-10.69h4.14c2.513 0 4.135 1.368 4.135 3.487 0 1.14-.524 2.116-1.405 2.612" fill="#003580"/>
        <path d="M681.107 25.12a3.4 3.4 0 0 1-2.648-1.283l-.178-.226-.14.253c-.458.833-1.244 1.256-2.337 1.256-1.147 0-1.916-.64-2.273-1.02l-.234-.253-.1.333c-.13.48-.557.743-1.203.743h-1.037l-.01-8.62h2.355v3.805a4.26 4.26 0 0 0 .125 1.008c.225.92.843 1.91 1.882 1.81.64-.062.954-.557.954-1.513v-5.11h2.372v3.805a3.45 3.45 0 0 0 .133 1.041c.2.878.836 1.778 1.838 1.778.726 0 .994-.41.994-1.514v-3.85c0-.87.388-1.26 1.26-1.26h1.108l.002 5.503c0 2.2-.968 3.314-2.872 3.314m-21.434-5.824c-.007-.01-1.02-1.077-2.355-1.077-1.216 0-2.444.746-2.444 2.41 0 1.438.952 2.443 2.316 2.443.442 0 .946-.158 1.025-.425l.01-.045a.866.866 0 0 1 .84-.637l1.3-.002v1.128c0 1.488-1.893 2.028-3.166 2.028-2.724 0-4.7-1.896-4.7-4.508s1.954-4.504 4.65-4.504c2.338 0 3.6 1.537 3.622 1.552l.068.084-1.022 1.695-.135-.143" fill="#00b4f1"/>
      </g></g>
    </g>
  </svg>
);

// ── Category database ─────────────────────────────────────────────────────────
const categoryData: Record<string, {
  title: string;
  subtitle: string;
  heroImage: string;
  desc: string;
  longDesc: string;
  packages: {
    id: string;
    title: string;
    location: string;
    price: number;
    bookingRating: number;
    bookingReviews: number;
    tripAdvisorRating: number;
    tripAdvisorReviews: number;
    discount?: string;
    image: string;
  }[];
}> = {
  'overwater-villas': {
    title: 'Overwater Villas',
    subtitle: 'LUXURY WATER RETREATS',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1920',
    desc: 'Wake up to the gentle sound of the Indian Ocean in your private luxury overwater sanctuary. Step directly from your deck into the crystal-clear lagoon below.',
    longDesc: 'There is no experience quite like waking up in an overwater villa, suspended above the clearest water on Earth, with nothing between you and the endless blue horizon. The Maldives\' iconic overwater villas represent the pinnacle of luxury hospitality — private sanctuaries where glass floors reveal colourful marine life below, sundecks lead directly into the warm lagoon, and the only sound is the gentle lap of the Indian Ocean against your stilts. Each villa is a masterpiece of design that seamlessly blends indoor and outdoor living, offering complete privacy, world-class amenities, and the kind of breathtaking natural beauty that cannot be replicated anywhere else on Earth. These are not merely rooms — they are once-in-a-lifetime experiences that redefine what luxury truly means.',
    packages: [
      { id: 'villa-1', title: 'Ocean Pool Retreat', location: 'South Malé Atoll, Maldives', price: 4500, bookingRating: 9.7, bookingReviews: 214, tripAdvisorRating: 5, tripAdvisorReviews: 180, discount: '8% OFF', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1080' },
      { id: 'villa-2', title: 'Sunset Water Pavilion', location: 'Baa Atoll, Maldives', price: 6200, bookingRating: 9.5, bookingReviews: 98, tripAdvisorRating: 4.9, tripAdvisorReviews: 112, discount: '5% OFF', image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&q=80&w=1080' },
      { id: 'villa-3', title: 'Coral Horizon Villa', location: 'Ari Atoll, Maldives', price: 3800, bookingRating: 9.2, bookingReviews: 167, tripAdvisorRating: 4.8, tripAdvisorReviews: 143, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1080' },
    ],
  },
  'romantic-getaways': {
    title: 'Romantic Getaways',
    subtitle: 'HONEYMOON & COUPLES ESCAPES',
    heroImage: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?auto=format&fit=crop&q=80&w=1920',
    desc: 'The ultimate destination for couples and honeymooners. Secluded beaches, private pools, spectacular sunsets, and intimate candlelit dinners set the stage for unforgettable romance.',
    longDesc: 'The Maldives is widely considered the most romantic destination on the planet — and it is easy to understand why. With private beaches stretching to the horizon, overwater bungalows perched above turquoise lagoons, and sunsets that paint the sky in extraordinary shades of rose and gold, this archipelago was made for love. Our Romantic Getaway packages are crafted exclusively for couples who want to celebrate something truly special — a honeymoon, an anniversary, or simply the desire to escape together. Enjoy private candlelit dinners on sandbanks surrounded by nothing but ocean, couples\' spa rituals in open-air pavilions overlooking the reef, and intimate sunset dolphin cruises. Every detail has been thoughtfully arranged so that you can focus entirely on each other.',
    packages: [
      { id: 'rom-1', title: 'Honeymoon Bliss Package', location: 'North Malé Atoll, Maldives', price: 5800, bookingRating: 9.8, bookingReviews: 302, tripAdvisorRating: 5, tripAdvisorReviews: 255, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&q=80&w=1080' },
      { id: 'rom-2', title: 'Secluded Island Escape', location: 'Thaa Atoll, Maldives', price: 7500, bookingRating: 9.6, bookingReviews: 89, tripAdvisorRating: 4.9, tripAdvisorReviews: 76, image: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?auto=format&fit=crop&q=80&w=1080' },
    ],
  },
  'family-resorts': {
    title: 'Family Resorts',
    subtitle: 'FAMILY TROPICAL ADVENTURES',
    heroImage: 'https://images.unsplash.com/photo-1583297084116-e420ca5aba80?auto=format&fit=crop&q=80&w=1920',
    desc: 'Spacious multi-bedroom beach villas, interactive kids\' clubs, and exciting water sports ensure unforgettable family moments in a safe, tropical paradise.',
    longDesc: 'The Maldives is not just for couples — its family resorts offer some of the most enriching and exciting holiday experiences for children and adults alike. Imagine your little ones learning to snorkel above a coral garden teeming with tropical fish, building sandcastles on a private beach of powdery white sand, and attending their own kids\' marine biology sessions led by professional naturalists. Our Family Resort packages carefully select properties known for exceptional children\'s clubs, spacious family villas with private pools, and a full range of water sports and supervised activities suitable for all ages. Parents can relax completely knowing that world-class childcare and entertainment is just steps away, while the whole family shares the magic of one of the most spectacular natural environments on Earth.',
    packages: [
      { id: 'fam-1', title: 'Family Beach Pavilion', location: 'South Malé Atoll, Maldives', price: 6900, bookingRating: 9.3, bookingReviews: 421, tripAdvisorRating: 4.8, tripAdvisorReviews: 367, discount: '7% OFF', image: 'https://images.unsplash.com/photo-1561830016-04cb9459eaa8?auto=format&fit=crop&q=80&w=1080' },
      { id: 'fam-2', title: 'Island Kids & Family Suite', location: 'Ari Atoll, Maldives', price: 5400, bookingRating: 9.1, bookingReviews: 198, tripAdvisorRating: 4.7, tripAdvisorReviews: 212, image: 'https://images.unsplash.com/photo-1583297084116-e420ca5aba80?auto=format&fit=crop&q=80&w=1080' },
    ],
  },
  'diving-snorkeling': {
    title: 'Diving & Snorkeling',
    subtitle: 'UNDERWATER WORLD DISCOVERY',
    heroImage: 'https://images.unsplash.com/photo-1593665840592-8c662655fb65?auto=format&fit=crop&q=80&w=1920',
    desc: 'Explore vibrant coral reefs, swim alongside gentle manta rays and whale sharks, and discover the abundant marine life that makes the Maldives a world-class diving destination.',
    longDesc: 'Beneath the surface of the Maldives\' crystalline waters lies one of the most biodiverse marine ecosystems on the entire planet. The archipelago sits at the confluence of major Indian Ocean currents, creating ideal conditions for an extraordinary abundance of marine life — from gentle whale sharks and majestic manta rays to vibrant coral gardens hosting thousands of species of tropical fish, sea turtles, dolphins, and rare cephalopods. Our Diving & Snorkeling packages cater to everyone from first-time snorkelers to experienced technical divers, with carefully selected resorts featuring world-class PADI-certified dive centres and some of the most spectacular dive sites on Earth. Every descent is a journey into a living, breathing underwater world of incomprehensible beauty and wonder.',
    packages: [
      { id: 'dive-1', title: 'Atoll Diver\'s Paradise', location: 'Ari Atoll, Maldives', price: 4100, bookingRating: 9.4, bookingReviews: 134, tripAdvisorRating: 4.9, tripAdvisorReviews: 118, discount: '5% OFF', image: 'https://images.unsplash.com/photo-1658298208155-ab71765747a1?auto=format&fit=crop&q=80&w=1080' },
      { id: 'dive-2', title: 'Manta Ray Encounter Package', location: 'Baa Atoll, Maldives', price: 3600, bookingRating: 9.2, bookingReviews: 87, tripAdvisorRating: 4.8, tripAdvisorReviews: 73, image: 'https://images.unsplash.com/photo-1593665840592-8c662655fb65?auto=format&fit=crop&q=80&w=1080' },
    ],
  },
};

const fallback = {
  title: 'Luxury Island Resorts',
  subtitle: 'EXCLUSIVE MALDIVES ESCAPES',
  heroImage: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&q=80&w=1920',
  desc: 'Discover a world of crystal-clear lagoons, pristine white sands, and unrivaled luxury tailored precisely to your preferences.',
  longDesc: 'The Maldives is not simply a holiday destination — it is a state of being. Scattered across the equator like a necklace of pearls, its 1,200 coral islands and 26 atolls form one of the most extraordinary natural environments on Earth. Whether you are seeking the seclusion of a private island, the romance of an overwater villa, the thrill of the world\'s finest diving, or the restorative peace of an award-winning wellness retreat, the Maldives delivers every experience at the highest possible level. Our handpicked resort packages are designed for discerning travellers who understand that true luxury lies not in excess, but in the seamless alignment of exceptional hospitality, extraordinary natural beauty, and deeply personal service.',
  packages: [
    { id: 'gen-1', title: 'Signature Island Escape', location: 'Malé Atoll, Maldives', price: 5500, bookingRating: 9.5, bookingReviews: 310, tripAdvisorRating: 4.9, tripAdvisorReviews: 278, discount: '6% OFF', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1080' },
  ],
};

import { resortApi } from '../../../lib/resortApi';

export default async function MaldivesResortsCategory({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  
  let dbCategory = null;
  let liveResorts = [];
  try {
    dbCategory = await resortApi.getCategory(categoryId).catch(() => null);
    liveResorts = await resortApi.getPublicResorts(categoryId);
  } catch (err) {
    console.error("Failed to fetch live resorts:", err);
  }

  const hardcoded = (categoryId && categoryData[categoryId]) ? categoryData[categoryId] : fallback;
  const data = {
    ...hardcoded,
    title: dbCategory?.name || hardcoded.title,
    subtitle: dbCategory?.subtitle || hardcoded.subtitle,
    heroImage: dbCategory?.heroImage || hardcoded.heroImage,
    longDesc: dbCategory?.longDesc || hardcoded.longDesc,
  };

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">

      {/* ── HERO ── */}
      <section className="relative w-full aspect-video min-h-[400px] max-h-[70vh] flex items-end pb-12 md:pb-16 justify-start overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={data.heroImage || 'https://images.unsplash.com/photo-1514282401047-d79b71a640f5'}
            alt={data.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/90 via-[#041d3c]/55 to-[#041d3c]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/80 via-transparent to-[#041d3c]/20" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-start text-left">
          {/* Breadcrumb back */}
          <Link
            href="/maldives-resorts"
            className="flex items-center gap-2 text-white/50 hover:text-white text-[12px] font-semibold uppercase tracking-wider mb-5 transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Maldives Resorts
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            <span>{data.subtitle}</span>
          </div>
          <h1 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  drop-shadow-lg mb-4 break-words hyphens-auto">
            {data.title}
          </h1>
          <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-5" />
        </div>
      </section>

      {/* ── DESCRIPTION ── */}
      {data.longDesc && (
        <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-14 lg:py-16">
          <p className="text-gray-500 text-[15px] lg:text-[16px] leading-[1.9] max-w-4xl mx-auto text-center break-words whitespace-pre-wrap">
            {data.longDesc}
          </p>
        </section>
      )}

      {/* ── SERVICES SECTION ── */}
      <ServicesSection />

      {/* ── PACKAGES GRID ── */}
      <section className="w-full py-[100px] lg:py-[120px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">

          {/* Section header */}
          <div className="flex flex-col items-center text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
              <span>✦ SELECT YOUR SANCTUARY</span>
            </div>
            <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
              Available Resorts
            </h2>
            <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5" />
            <p className="text-gray-500 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed">
              Choose from our handpicked selection of luxury resorts — each one promising a world-class experience.
            </p>
          </div>

          {/* Packages grid — same card layout as homepage */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {liveResorts.length > 0 ? liveResorts.map((pkg: any) => (
              <div
                key={pkg.id}
                className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(4,29,60,0.03)] hover:shadow-[0_24px_60px_rgba(26,132,255,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out h-full group cursor-pointer"
              >
                <div className="relative h-[230px] w-full shrink-0 overflow-hidden bg-[#f4f7fb]">
                  <img
                    src={pkg.packageImage || pkg.heroImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-65 pointer-events-none" />

                  {/* Guests badge */}
                  <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md border border-white/30 rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] z-10">
                    <Users className="w-3.5 h-3.5 text-[#1a84ff]" strokeWidth={2.5} />
                    <span className="text-[#041d3c] font-black text-[10px] uppercase tracking-wider">Resort Package</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow text-left">
                  {/* Title */}
                  <h3 className="text-[#041d3c] font-black text-[19px] sm:text-[21px] leading-[1.25] line-clamp-2 mb-1.5 min-h-[44px]">
                    {pkg.title}
                  </h3>

                  {/* Full location */}
                  <div className="mb-2 mt-0 min-h-[36px]">
                    <span className="text-black font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Location</span>
                    <p className="text-black text-[13px] font-medium leading-relaxed line-clamp-2">{pkg.location}</p>
                  </div>

                  {/* Ratings — Booking.com + TripAdvisor */}
                  <div className="flex items-center gap-4 mb-2.5 pt-0">
                    {/* Booking.com */}
                    <div className="flex flex-col gap-1.5 flex-1 text-left">
                      <div className="h-[24px] flex items-center">
                        <BookingComLogo uid={pkg.id} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="bg-[#003b95] text-white font-extrabold text-[10.5px] px-1.5 py-0.5 rounded-[4px] leading-tight">
                          {Number(pkg.bookingScore || 0).toFixed(1)}
                        </div>
                        <span className="text-gray-400 text-[10.5px] font-extrabold leading-none mt-0.5">({pkg.bookingReviews || 0})</span>
                      </div>
                    </div>

                    <div className="w-[1px] h-8 bg-[#041d3c]/8 rounded-full" />

                    {/* TripAdvisor */}
                    <div className="flex flex-col gap-1.5 flex-1 pl-2 text-left">
                      <ImageWithFallback
                        src={tripAdvisorLogo}
                        alt="TripAdvisor"
                        className="h-[24px] w-auto object-contain object-left"
                      />
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-[3px]">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-[13px] h-[13px] rounded-full border-[1.5px] ${
                                i < Math.round(Number(pkg.tripAdvisorRating || 0))
                                  ? 'bg-[#00aa6c] border-[#00aa6c]'
                                  : 'bg-transparent border-[#00aa6c]'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 text-[10.5px] font-extrabold leading-none mt-0.5">({pkg.tripAdvisorReviews || 0})</span>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="h-[1px] bg-[#041d3c]/5 w-full mb-2.5" />

                  {/* Price + Buttons */}
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex flex-col text-left">
                      <p className="text-gray-400 text-[9.5px] font-extrabold uppercase tracking-widest mb-0">Starting From</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-black font-black text-[25px] leading-none">€{Number(pkg.price || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0 w-[125px]">
                      <Link 
                        href={`/maldives-resorts/${categoryId || 'luxury'}/${pkg.slug}#inquire-form`}
                        className="w-full bg-white hover:bg-[#f4f7fb] text-[#041d3c] border border-[#041d3c]/20 hover:border-[#041d3c]/40 py-2 rounded-[12px] font-extrabold text-[12px] tracking-wider uppercase transition-all duration-300 text-center block"
                      >
                        Get a Quote
                      </Link>
                      <Link
                        href={`/maldives-resorts/${categoryId || 'luxury'}/${pkg.slug}`}
                        className="w-full bg-[#041d3c] hover:bg-[#1a84ff] text-white py-2 rounded-[12px] font-extrabold text-[12px] tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-[0_8px_20px_rgba(26,132,255,0.25)] hover:-translate-y-0.5 text-center block"
                      >
                        Explore More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Resorts Found</h3>
                <p className="text-gray-500">There are currently no active resorts in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <div className="bg-white">
        <ReviewsSection />
      </div>

    </div>
  );
}
