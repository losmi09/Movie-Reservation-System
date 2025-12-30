import * as crudController from './crudController.js';

export const getAllSeats = crudController.getAll('seat');

export const getSeat = crudController.getOne('seat');

export const createSeat = crudController.createOne('seat');

export const updateSeat = crudController.updateOne('seat');

export const deleteSeat = crudController.deleteOne('seat');
