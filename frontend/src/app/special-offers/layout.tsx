import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Offers & Deals',
  description: 'Explore exclusive limited-time deals on luxury Sri Lanka and Maldives tour packages. Book now and save on your dream tropical holiday.',
};

export default function SpecialOffersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
