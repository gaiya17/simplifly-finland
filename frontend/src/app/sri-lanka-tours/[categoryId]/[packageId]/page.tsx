import Link from 'next/link';
import { tourApi } from '../../../../lib/tourApi';
import { TourPackageClient } from './TourPackageClient';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ packageId: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { packageId } = await params;
  try {
    const res = await tourApi.getTourBySlug(packageId);
    if (!res) return { title: 'Tour Not Found | Simplifly Finland' };

    const previousImages = (await parent).openGraph?.images || [];
    const image = res.heroImage || res.packageImage;

    return {
      title: `${res.title} | Sri Lanka Tours | Simplifly Finland`,
      description: res.summary || res.title,
      openGraph: {
        title: res.title,
        description: res.summary || res.title,
        images: image ? [image, ...previousImages] : previousImages,
        type: 'website',
      },
    };
  } catch (e) {
    return { title: 'Sri Lanka Tours | Simplifly Finland' };
  }
}

export default async function TourPackagePage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;

  let res;
  try {
    // packageId here acts as the slug for tours now
    res = await tourApi.getTourBySlug(packageId);
  } catch (error) {
    res = null;
  }

  if (!res) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <h2 className="text-[24px] font-black text-[#041d3c] mb-2">Tour Not Found</h2>
        <Link href="/sri-lanka-tours" className="px-6 py-2.5 bg-[#1a84ff] text-white rounded-full font-bold">
          View All Tours
        </Link>
      </div>
    );
  }

  const data = {
    title: res.title,
    heroImage: res.heroImage || res.packageImage || 'https://images.unsplash.com/photo-1594805938839-c581da5d8129',
    packageImage: res.packageImage || res.heroImage || 'https://images.unsplash.com/photo-1594805938839-c581da5d8129',
    duration: `${res.nights} Nights / ${res.days} Days`,
    price: res.price,
    discount: res.discount,
    currency: '€',
    summary: res.summary,
    locations: res.destinations,
    gallery: res.gallery?.length ? res.gallery.map((g: any) => g.url) : ['https://images.unsplash.com/photo-1594805938839-c581da5d8129'],
    itinerary: res.itinerary?.map((day: any) => ({
      day: String(day.dayNumber).padStart(2, '0'),
      dayEnd: day.dayNumberEnd ? String(day.dayNumberEnd).padStart(2, '0') : null,
      route: day.route,
      activity: day.title,
      details: day.description,
      stay: day.stay,
    })) || [],
    included: res.inclusions?.filter((inc: any) => inc.isIncluded).map((inc: any) => inc.text) || [],
    notIncluded: res.inclusions?.filter((inc: any) => !inc.isIncluded).map((inc: any) => inc.text) || [],
  };

  return <TourPackageClient data={data} />;
}
