import { configureCloudinary } from '../config/cloudinary.js';

export function uploadBuffer(buffer, { folder, publicId }) {
  const cloudinary = configureCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, overwrite: true, resource_type: 'image' },
      (error, result) => error ? reject(error) : resolve(result),
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId) {
  if (publicId) await configureCloudinary().uploader.destroy(publicId);
}
