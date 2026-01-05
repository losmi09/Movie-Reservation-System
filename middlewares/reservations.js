import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as crudRepository from '../repositories/crudRepository.js';

export const getUserReservations = catchAsync(async (req, res, next) => {
  req.query.userId = req.user.id;

  next();
});

export const checkIfReservationBelongsToUser = catchAsync(
  async (req, res, next) => {
    const reservation = await crudRepository.getOne(
      'reservation',
      Number(req.params.id)
    );

    if (reservation?.userId !== req.user.id)
      return next(new AppError('No reservation found with this ID', 404));

    next();
  }
);
