import multer from 'multer';
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, file.mimetype.startsWith('image/')),
});
