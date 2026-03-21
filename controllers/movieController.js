import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { sendResponse } from './utils/sendResponse.js';
import * as crudController from './crudController.js';
import * as movieService from '../services/movieService.js';

export const getAllMovies = crudController.getAll('movie');

export const getMovie = crudController.getOne('movie');

export const createMovie = catchAsync(async (req, res) => {
  const movie = await movieService.createMovie({ ...req.body });

  sendResponse(res, movie, 201);
});

export const updateMovie = catchAsync(async (req, res) => {
  const { params, body } = req;

  const updatedMovie = await movieService.updateMovie(params.id, { ...body });

  sendResponse(res, updatedMovie);
});

export const deleteMovie = crudController.deleteOne('movie');

export const saveMoviePoster = catchAsync(async (req, res, next) => {
  const { file, params } = req;

  if (!file) return next(new AppError('No image provided', 422));

  const movie = await movieService.saveMoviePoster(params.id, file.fileName);

  sendResponse(res, movie);
});
