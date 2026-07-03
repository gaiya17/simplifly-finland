import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sri Lanka Tours & Holiday Packages',
  description: 'Explore our curated selection of luxury tour packages and holidays in Sri Lanka. From wildlife safaris to cultural heritage and pristine beaches.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
