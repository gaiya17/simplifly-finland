import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = (req.body.folder as string) || 'simplifly/general';
    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    };
  },
});

export const upload = multer({ storage });
export { cloudinary };

export const extractPublicIdFromUrl = (url: string | null | undefined): string | null => {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const pathParts = parts[1].split('/');
    if (pathParts[0].match(/^v\d+/)) {
      pathParts.shift();
    }
    const publicIdWithExt = pathParts.join('/');
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
    return lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

export const deleteCloudinaryImage = async (identifier: string | null | undefined, isUrl = false): Promise<void> => {
  if (!identifier) return;
  const publicId = isUrl ? extractPublicIdFromUrl(identifier) : identifier;
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error(`Failed to delete image from Cloudinary (${publicId}):`, error);
  }
};
