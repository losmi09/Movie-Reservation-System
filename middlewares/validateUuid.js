import { validate as uuidValidate } from 'uuid';
import AppError from '../utils/appError.js';

const validateUuid = (req, res, next) => {
  if (!uuidValidate(req.params.id))
    return next(new AppError('Invalid UUID', 400));

  next();
};

export default validateUuid;
