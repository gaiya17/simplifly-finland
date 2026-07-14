import Link from 'next/link';
import { tourApi } from '../../../lib/tourApi';
import { resortApi } from '../../../lib/resortApi';
import { TourPackageClient } from '../../sri-lanka-tours/[categoryId]/[packageId]/TourPackageClient';
import { ResortPackageClient } from '../../maldives-resorts/[categoryId]/[packageId]/ResortPackageClient';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [resortRes, tourRes] = await Promise.all([
      resortApi.getResortBySlug(slug).catch(() => null),
      tourApi.getTourBySlug(slug).catch(() => null)
    ]);

    const res = resortRes || tourRes;

    if (!res) return { title: 'Offer Not Found | Simplifly Finland' };

    const previousImages = (await parent).openGraph?.images || [];
    const image = res.heroImage || res.packageImage || res.offerPoster;

    return {
      title: `${res.title} | Special Offers | Simplifly Finland`,
      description: res.summary || res.title,
      openGraph: {
        title: res.title,
        description: res.summary || res.title,
        images: image ? [{ url: image, alt: res.title }, ...previousImages] : previousImages,
        type: 'website',
      },
    };
  } catch (e) {
    return { title: 'Special Offers | Simplifly Finland' };
  }
}

export default async function SpecialOfferPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const offerIdxStr = resolvedSearchParams.offerIdx;
  const offerIndex = offerIdxStr ? parseInt(offerIdxStr as string, 10) : 0;

  let resortRes = null;
  let tourRes = null;

  try {
    const [rRes, tRes] = await Promise.all([
      resortApi.getResortBySlug(slug).catch(() => null),
      tourApi.getTourBySlug(slug).catch(() => null)
    ]);
    resortRes = rRes;
    tourRes = tRes;
  } catch (error) {
    console.error("Error fetching special offer details:", error);
  }

  if (!resortRes && !tourRes) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <h2 className="text-[24px] font-black text-[#041d3c] mb-2">Offer Not Found</h2>
        <Link href="/special-offers" className="px-6 py-2.5 bg-[#1a84ff] text-white rounded-[12px] font-bold">
          View All Offers
        </Link>
      </div>
    );
  }

  // Handle Resort Rendering
  if (resortRes) {
    const categorySlug = resortRes.categories?.[0]?.slug || 'all';
    
    const mappedResortData = {
      ...resortRes,
      images: resortRes.gallery ? resortRes.gallery.map((g: any) => g.url) : [],
    };

    return <ResortPackageClient resort={mappedResortData} categoryId={categorySlug} offerIndex={offerIndex} />;
  }

  // Handle Tour Rendering
  if (tourRes) {
    const mappedTourData = {
      title: tourRes.title,
      heroImage: tourRes.heroImage || tourRes.packageImage || 'https://images.unsplash.com/photo-1594805938839-c581da5d8129',
      packageImage: tourRes.packageImage || tourRes.heroImage || 'https://images.unsplash.com/photo-1594805938839-c581da5d8129',
      duration: `${tourRes.nights} Nights / ${tourRes.days} Days`,
      price: tourRes.price,
      discount: tourRes.discount,
      category: tourRes.category?.name || 'Tour Package',
      destinations: tourRes.destinations,
      summary: tourRes.summary,
      inclusions: tourRes.inclusions?.map((inc: any) => inc.text) || [],
      itinerary: tourRes.itinerary?.map((day: any) => ({
        day: day.dayNumber,
        dayEnd: day.dayNumberEnd,
        title: day.title,
        route: day.route,
        details: day.description,
        stay: day.stay,
        mealPlan: day.mealPlan
      })) || [],
      gallery: tourRes.gallery?.map((g: any) => g.url) || [],
    };

    return <TourPackageClient data={mappedTourData} />;
  }

  return null;
}
