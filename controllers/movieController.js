import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as crudController from './crudController.js';
import * as movieService from '../services/movieService.js';

export const getAllMovies = crudController.getAll('movie');

export const getMovie = crudController.getOne('movie');

export const createMovie = crudController.createOne('movie');

export const updateMovie = crudController.updateOne('movie');

export const deleteMovie = crudController.deleteOne('movie');

export const saveMoviePoster = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No image provided', 422));

  const movie = await movieService.saveMoviePoster(
    req.params.id,
    req.file.fileName,
  );

  res.status(200).json({ data: movie });
});
