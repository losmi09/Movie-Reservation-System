import catchAsync from '../utils/catchAsync.js';
import movieSchema from '../schemas/movieSchema.js';
import { throwValidationError } from './errorController.js';
import AppError from '../utils/appError.js';
import * as movieService from '../services/movieService.js';

export const getAllMovies = catchAsync(async (req, res, next) => {
  const { movies, metaData } = await movieService.getAllMovies(req.query);

  res.status(200).json({ data: movies, meta: metaData });
});

export const getMovie = catchAsync(async (req, res, next) => {
  const movie = await movieService.getMovie(req.params.id);

  if (!movie) return next(new AppError('No movie found with this ID', 404));

  res.status(200).json(movie);
});

export const createMovie = catchAsync(async (req, res, next) => {
  const { body: movieData } = req;

  const { error } = movieSchema.validate(movieData, { abortEarly: false });

  if (error) return throwValidationError(error.details, res, req.originalUrl);

  const movie = await movieService.createMovie(movieData);

  res.status(201).json(movie);
});
