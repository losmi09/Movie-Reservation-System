import multer from 'multer';
import AppError from './appError.js';

export const storage = multer.memoryStorage();

export const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload only images', 415), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2 MB
    files: 1,
  },
});
