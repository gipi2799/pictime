import sharp from "sharp";

export interface ProcessedImages {
  originalKey: string;
  thumbKey: string;
  previewKey: string;
  width: number;
  height: number;
}

export async function processBufferToGallery({
  galleryId,
  photoId,
  buffer,
  ext,
}: {
  galleryId: string;
  photoId: string;
  buffer: Buffer;
  ext: string;
}): Promise<ProcessedImages> {
  // Parse image metadata
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 1400;
  const height = metadata.height || 933;

  // Generate keys for storage (in production, these would point to S3 or similar)
  const timestamp = Date.now();
  const originalKey = `${galleryId}/${photoId}/original-${timestamp}${ext}`;
  const thumbKey = `${galleryId}/${photoId}/thumb-${timestamp}${ext}`;
  const previewKey = `${galleryId}/${photoId}/preview-${timestamp}${ext}`;

  // In production, you would:
  // 1. Upload original image to S3 under originalKey
  // 2. Create thumbnail (e.g., 400px) and upload to thumbKey
  // 3. Create preview (e.g., 1000px) and upload to previewKey

  return {
    originalKey,
    thumbKey,
    previewKey,
    width,
    height,
  };
}
