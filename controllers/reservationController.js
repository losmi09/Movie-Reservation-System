import * as crudController from './crudController.js';

export const getAllReservations = crudController.getAll('reservation');

export const getReservation = crudController.getOne('reservation');

export const createReservation = crudController.createOne('reservation');

export const cancelReservation = crudController.updateOne('reservation');
