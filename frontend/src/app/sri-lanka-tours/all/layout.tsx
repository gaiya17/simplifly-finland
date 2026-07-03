import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Sri Lanka Tours',
  description: 'Browse all our premium luxury tour packages across Sri Lanka. Find the perfect itinerary for your unforgettable adventure.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
