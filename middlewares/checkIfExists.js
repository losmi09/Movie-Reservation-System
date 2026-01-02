import catchAsync from '../utils/catchAsync.js';
import * as crudRepository from '../repositories/crudRepository.js';
import AppError from '../utils/appError.js';

const checkIfExists = model =>
  catchAsync(async (req, res, next) => {
    const doc = await crudRepository.getOne(model, Number(req.params.id));

    if (!doc) return next(new AppError(`No ${model} found with this ID`, 404));

    next();
  });

export default checkIfExists;
