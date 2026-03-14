import { validate as validateUuid } from 'uuid';
import { AppError } from '../utils/appError.js';

export const validateId = (req, res, next) => {
  if (!validateUuid(req.params.id))
    return next(new AppError('Invalid ID', 400));

  next();
};
