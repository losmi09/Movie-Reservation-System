import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from './utils/sendResponse.js';
import * as crudController from './crudController.js';
import * as cinemaService from '../services/cinemaService.js';

export const getAllCinemas = crudController.getAll('cinema');

export const getCinema = crudController.getOne('cinema');

export const createCinema = catchAsync(async (req, res) => {
  const cinema = await cinemaService.createCinema({ ...req.body });

  sendResponse(res, cinema, 201);
});

export const updateCinema = catchAsync(async (req, res) => {
  const updatedCinema = await cinemaService.updateCinema(req.params.id, {
    ...req.body,
  });

  sendResponse(res, updatedCinema);
});

export const deleteCinema = crudController.deleteOne('cinema');
