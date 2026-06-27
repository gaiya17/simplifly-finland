const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Build an optimized Cloudinary URL with transformations
 * @param publicId - e.g. "simplifly/resorts/centara-mirage"
 * @param options  - width, height, crop, quality
 */
export function cloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: string;
  } = {}
): string {
  const { width, height, crop = 'fill', quality = 'auto' } = options;

  const transforms = [
    width ? `w_${width}` : '',
    height ? `h_${height}` : '',
    crop ? `c_${crop}` : '',
    `q_${quality}`,
    'f_auto',   // auto format — serves WebP to modern browsers
  ]
    .filter(Boolean)
    .join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}


