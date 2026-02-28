import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as crudRepository from '../repositories/crudRepository.js';

export const checkIfReviewBelongsToUser = change =>
  catchAsync(async (req, res, next) => {
    const review = await crudRepository.getOne('review', req.params.id);

    if (!review) return next(new AppError('No review found with this ID', 404));

    if (review.userId !== req.user.id)
      return next(new AppError(`You can only ${change} your own reviews`, 403));

    next();
  });
