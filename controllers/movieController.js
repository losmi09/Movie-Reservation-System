import catchAsync from '../utils/catchAsync.js';
import movieSchema from '../schemas/movieSchema.js';
import { throwValidationError } from './errorController.js';
import AppError from '../utils/appError.js';
import * as movieService from '../services/movieService.js';

const sendResponse = (statusCode, data, res) =>
  res.status(statusCode).json({ data });

export const getAllMovies = catchAsync(async (req, res, next) => {
  const { movies, metaData } = await movieService.getAllMovies(req.query);

  res.status(200).json({ data: movies, meta: metaData });
});

export const getMovie = catchAsync(async (req, res, next) => {
  const movie = await movieService.getMovie(req.params.id);

  if (!movie) return next(new AppError('No movie found with this ID', 404));

  sendResponse(200, movie, res);
});

export const createMovie = catchAsync(async (req, res, next) => {
  const { body: movieData } = req;

  const { error } = movieSchema.validate(movieData, { abortEarly: false });

  if (error) return throwValidationError(error.details, res, req.originalUrl);

  const movie = await movieService.createMovie(movieData);

  sendResponse(201, movie, res);
});

export const updateMovie = catchAsync(async (req, res, next) => {
  const { id: movieId } = req.params;

  const movie = await movieService.getMovie(movieId);

  if (!movie) return next(new AppError('No movie found with this ID', 404));

  const { body: movieData } = req;

  const { error } = movieSchema.validate(movieData, { abortEarly: false });

  if (error) {
    const errors = error.details.filter(
      err => !err.message.endsWith('required')
    );

    if (errors.length)
      return throwValidationError(errors, res, req.originalUrl);
  }

  const updatedMovie = await movieService.updateMovie(movieId, movieData);

  sendResponse(200, updatedMovie, res);
});

export const deleteMovie = catchAsync(async (req, res, next) => {
  const { id: movieId } = req.params;

  const movie = await movieService.getMovie(movieId);

  if (!movie) return next(new AppError('No movie found with this ID', 404));

  await movieService.deleteMovie(movieId);

  res.status(204).end();
});
