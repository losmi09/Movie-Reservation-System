import multer from 'multer';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as imageService from '../services/imageService.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload only images', 415), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2 MB
    files: 1,
  },
});

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.fileName = `user-${req.user.id}-${Date.now()}.jpg`;

  await imageService.resizeImage(req.file.buffer, req.file.fileName);

  next();
});
