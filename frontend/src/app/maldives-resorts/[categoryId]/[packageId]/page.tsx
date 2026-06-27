import { ResortPackageClient } from './ResortPackageClient';
import { resortApi } from '../../../../lib/resortApi';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ packageId: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { packageId } = await params;
  try {
    const res = await resortApi.getResortBySlug(packageId);
    if (!res) return { title: 'Resort Not Found | Simplifly Finland' };

    const previousImages = (await parent).openGraph?.images || [];
    const image = res.heroImage || res.packageImage;

    return {
      title: `${res.name} | Maldives Resorts | Simplifly Finland`,
      description: res.summary || res.name,
      openGraph: {
        title: res.name,
        description: res.summary || res.name,
        images: image ? [image, ...previousImages] : previousImages,
        type: 'website',
      },
    };
  } catch (e) {
    return { title: 'Maldives Resorts | Simplifly Finland' };
  }
}

export default async function ResortPackagePage({ params }: { params: Promise<{ categoryId: string; packageId: string }> }) {
  const { categoryId, packageId } = await params;
  
  try {
    // packageId is now the slug
    const resortData = await resortApi.getResortBySlug(packageId);
    if (!resortData) return notFound();
    
    return (
      <ResortPackageClient resort={resortData} categoryId={categoryId} />
    );
  } catch (error) {
    console.error("Failed to fetch resort details:", error);
    return notFound();
  }
}
