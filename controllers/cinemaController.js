import catchAsync from '../utils/catchAsync.js';
import cinemaSchema from '../schemas/cinemaSchema.js';
import AppError from '../utils/appError.js';
import excludeRequiredErrors from '../utils/excludeRequiredErrors.js';
import * as cinemaService from '../services/cinemaService.js';

export const getAllCinemas = catchAsync(async (req, res, next) => {
  const { cinemas, metaData } = await cinemaService.getAllCinemas(req.query);

  res.status(200).json({ data: cinemas, metaData });
});

export const getCinema = catchAsync(async (req, res, next) => {
  const cinema = await cinemaService.getCinema(req.params.id);

  if (!cinema) return next(new AppError('No cinema found with this ID', 404));

  res.status(200).json({ data: cinema });
});

export const createCinema = catchAsync(async (req, res, next) => {
  const { body: cinemaData } = req;

  const { error } = cinemaSchema.validate(cinemaData, { abortEarly: false });

  if (error) return next(error);

  const newCinema = await cinemaService.createCinema(cinemaData);

  res.status(200).json({ data: newCinema });
});

export const updateCinema = catchAsync(async (req, res, next) => {
  const { body: cinemaData } = req;

  const { error } = cinemaSchema.validate(cinemaData, { abortEarly: false });

  if (error) {
    const details = excludeRequiredErrors(error);

    if (details.length) return next({ details, name: 'ValidationError' });
  }

  const updatedCinema = await cinemaService.updateCinema(
    req.params.id,
    cinemaData
  );

  res.status(200).json({ data: updatedCinema });
});

export const deleteCinema = catchAsync(async (req, res, next) => {
  await cinemaService.deleteCinema(req.params.id);

  res.status(204).end();
});
