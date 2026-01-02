import * as crudController from './crudController.js';

export const getAllShowtimes = crudController.getAll('showtime');

export const getShowtime = crudController.getOne('showtime');

export const createShowtime = crudController.createOne('showtime');

export const updateShowtime = crudController.updateOne('showtime');

export const deleteShowtime = crudController.deleteOne('showtime');
