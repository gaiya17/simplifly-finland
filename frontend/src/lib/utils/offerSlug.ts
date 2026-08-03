export const generateOfferSlug = (offer: any): string => {
  if (!offer) return 'special-offer';
  const nights = offer.nights || 0;
  const adults = offer.adults || 2;
  const price = offer.offerPrice || 0;
  // Include nights + adults + price to guarantee uniqueness even when nights match
  return `${nights}-nights-${adults}-adults-${price}`;
};
