import { catchAsync } from '../utils/catchAsync.js';
import { checkIfRecordExists } from '../repositories/utils/checkIfRecordExists.js';
import { AppError } from '../utils/appError.js';

export const checkIfExists = model =>
  catchAsync(async (req, res, next) => {
    if (!(await checkIfRecordExists(model, req.params.id)))
      return next(new AppError(`No ${model} found with this ID`, 404));

    next();
  });
