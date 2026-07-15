import { redirect } from 'next/navigation';
import { resortApi } from '../../../lib/resortApi';
import { tourApi } from '../../../lib/tourApi';
import { generateOfferSlug } from '../../../lib/utils/offerSlug';

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
      redirect(`/special-offers/${slug}/special-offer`);
    } else if (resortRes) {
      redirect(`/special-offers/${slug}/special-offer`);
    }
  } catch (error) {
    console.error("Error redirecting special offer:", error);
  }

  // If not found, redirect to main special offers page
  redirect('/special-offers');
}
