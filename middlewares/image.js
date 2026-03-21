import { catchAsync } from '../utils/catchAsync.js';
import { upload } from '../utils/multer.js';
import * as imageService from '../services/imageService.js';

export const uploadUserPhoto = upload.single('photo');

export const uploadMoviePoster = upload.single('posterImage');

export const resizeImage = type =>
  catchAsync(async (req, res, next) => {
    const { file, user, params } = req;

    if (!file) return next();

    const config = {
      photo: { identifier: user.id, field: 'user' },
      posterImage: { identifier: params.id, field: 'movie' },
    };

    const { identifier, field } = config[type];

    req.file.fileName = `${field}-${identifier}-${Date.now()}.jpg`;

    await imageService.resizeImage(`${field}s`, file.buffer, req.file.fileName);

    next();
  });
