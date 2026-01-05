import catchAsync from '../utils/catchAsync.js';
import { upload } from '../utils/multer.js';
import * as imageService from '../services/imageService.js';

export const uploadUserPhoto = upload.single('photo');

export const uploadMoviePoster = upload.single('posterImage');

export const resizeImage = type =>
  catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const identifier = type === 'photo' ? req.user.id : req.params.id;

    const field = type === 'photo' ? 'user' : 'movie';

    req.file.fileName = `${field}-${identifier}-${Date.now()}.jpg`;

    await imageService.resizeImage(
      `${field}s`,
      req.file.buffer,
      req.file.fileName
    );

    next();
  });
