export const generateOfferSlug = (offer: any): string => {
  if (!offer) return 'special-offer';
  if (offer.nights) {
    return `${offer.nights}-nights-offer`;
  }
  return 'special-offer';
};
