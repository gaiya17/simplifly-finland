import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maldives Resorts & Overwater Villas',
  description: 'Discover premium luxury resorts and private island retreats in the Maldives. Experience the ultimate tropical getaway with Simplifly Finland.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
