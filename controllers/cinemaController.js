import catchAsync from '../utils/catchAsync.js';
import cinemaSchema from '../schemas/cinemaSchema.js';
import * as cinemaService from '../services/cinemaService.js';

export const getAllCinemas = catchAsync(async (req, res, next) => {
  const { cinemas, metaData } = await cinemaService.getAllCinemas(req.query);

  res.status(200).json({ data: cinemas, metaData });
});

export const createCinema = catchAsync(async (req, res, next) => {
  const { body: cinemaData } = req;

  const { error } = cinemaSchema.validate(cinemaData, { abortEarly: false });

  if (error) return next(error);

  const newCinema = await cinemaService.createCinema(cinemaData);

  res.status(200).json({ data: newCinema });
});
