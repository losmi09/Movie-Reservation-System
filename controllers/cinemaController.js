import * as crudController from './crudController.js';

export const getAllCinemas = crudController.getAll('cinema');

export const getCinema = crudController.getOne('cinema');

export const createCinema = crudController.createOne('cinema');

export const updateCinema = crudController.updateOne('cinema');

export const deleteCinema = crudController.deleteOne('cinema');
