import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery — Sri Lanka & Maldives',
  description: 'Browse stunning photos from our luxury tours across Sri Lanka and the Maldives. Get inspired for your next tropical adventure.',
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
