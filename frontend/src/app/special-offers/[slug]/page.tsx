import { redirect } from 'next/navigation';
import { resortApi } from '../../../lib/resortApi';
import { tourApi } from '../../../lib/tourApi';
import { generateOfferSlug } from '../../../lib/utils/offerSlug';
import { TourPackageClient } from '../../sri-lanka-tours/[categoryId]/[packageId]/TourPackageClient';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tourRes = await tourApi.getTourBySlug(slug).catch(() => null);
    if (!tourRes) return { title: 'Special Offers | Simplifly Finland' };

    const previousImages = (await parent).openGraph?.images || [];
    const image = tourRes.heroImage || tourRes.packageImage;

    return {
      title: `${tourRes.title} | Special Offers | Simplifly Finland`,
      description: tourRes.summary || tourRes.title,
      openGraph: {
        title: tourRes.title,
        description: tourRes.summary || tourRes.title,
        images: image ? [{ url: image, alt: tourRes.title }, ...previousImages] : previousImages,
        type: 'website',
      },
    };
  } catch (e) {
    return { title: 'Special Offers | Simplifly Finland' };
  }
}

export default async function SpecialOfferFallbackPage({ 
  params,
}: { 
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const [resortRes, tourRes] = await Promise.all([
      resortApi.getResortBySlug(slug).catch(() => null),
      tourApi.getTourBySlug(slug).catch(() => null)
    ]);

    if (resortRes && resortRes.customOffers && resortRes.customOffers.length > 0) {
      redirect(`/special-offers/${slug}/${generateOfferSlug(resortRes.customOffers[0])}`);
    } else if (tourRes) {
      const mappedTourData = {
        title: tourRes.title,
        heroImage: tourRes.heroImage || tourRes.packageImage || 'https://images.unsplash.com/photo-1594805938839-c581da5d8129',
        packageImage: tourRes.packageImage || tourRes.heroImage || 'https://images.unsplash.com/photo-1594805938839-c581da5d8129',
        duration: `${tourRes.nights} Nights / ${tourRes.days} Days`,
        price: tourRes.price,
        discount: tourRes.discount,
        currency: '€',
        summary: tourRes.summary,
        locations: tourRes.destinations,
        gallery: tourRes.gallery?.length ? tourRes.gallery.map((g: any) => g.url) : ['https://images.unsplash.com/photo-1594805938839-c581da5d8129'],
        itinerary: tourRes.itinerary?.map((day: any) => ({
          day: String(day.dayNumber).padStart(2, '0'),
          dayEnd: day.dayNumberEnd ? String(day.dayNumberEnd).padStart(2, '0') : null,
          route: day.route,
          activity: day.title,
          details: day.description,
          stay: day.stay,
          mealPlan: day.mealPlan,
        })) || [],
        included: tourRes.inclusions?.filter((inc: any) => inc.isIncluded).map((inc: any) => inc.text) || [],
        notIncluded: tourRes.inclusions?.filter((inc: any) => !inc.isIncluded).map((inc: any) => inc.text) || [],
      };
      
      return <TourPackageClient data={mappedTourData} />;
    } else if (resortRes) {
      redirect(`/special-offers/${slug}/special-offer`);
    }
  } catch {
    // Redirect target not found — fall through to default redirect below
  }

  // If not found, redirect to main special offers page
  redirect('/special-offers');
}
