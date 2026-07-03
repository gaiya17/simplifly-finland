import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Maldives Resorts',
  description: 'Browse our complete collection of premium luxury resorts in the Maldives. Filter and find your perfect private island escape.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
