import AppError from '../utils/appError.js';

const validateId = (req, res, next) => {
  Object.values(req.params).forEach(id => {
    if (!Number.isInteger(Number(id)))
      return next(new AppError('Invalid ID', 400));
  });

  next();
};

export default validateId;
