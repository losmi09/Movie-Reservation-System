import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from './utils/sendResponse.js';
import * as crudController from './crudController.js';
import * as showtimeService from '../services/showtimeService.js';

export const getAllShowtimes = crudController.getAll('showtime');

export const getShowtime = crudController.getOne('showtime');

export const createShowtime = catchAsync(async (req, res) => {
  const showtime = await showtimeService.createShowtime({ ...req.body });

  sendResponse(res, showtime, 201);
});

export const updateShowtime = catchAsync(async (req, res) => {
  const updatedShowtime = await showtimeService.updateShowtime(req.params.id, {
    ...req.body,
  });

  sendResponse(res, updatedShowtime);
});

export const deleteShowtime = crudController.deleteOne('showtime');
