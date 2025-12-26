import * as crudController from './crudController.js';

export const getAllMovies = crudController.getAll('movie');

export const getMovie = crudController.getOne('movie');

export const createMovie = crudController.createOne('movie');

export const updateMovie = crudController.updateOne('movie');

export const deleteMovie = crudController.deleteOne('movie');
