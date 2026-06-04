import { ResortPackageClient } from './ResortPackageClient';
import { resortApi } from '../../../../lib/resortApi';
import { notFound } from 'next/navigation';

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
