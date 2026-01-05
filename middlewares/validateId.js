import AppError from '../utils/appError.js';

const validateId = (req, res, next) => {
  if (!Number.isInteger(Number(req.params.id)))
    return next(new AppError('Invalid ID', 400));

  next();
};

export default validateId;
