import { catchAsync } from '../utils/catchAsync.js';
import { formatResponse } from '../mappers/formatResponse.js';
import { sendResponse } from './utils/sendResponse.js';
import * as crudController from './crudController.js';
import * as seatService from '../services/seatService.js';

export const getAllSeats = crudController.getAll('seat');

export const getSeat = crudController.getOne('seat');

export const createSeat = catchAsync(async (req, res) => {
  const seat = await seatService.createSeat({ ...req.body });

  sendResponse(res, formatResponse.seat(seat), 201);
});

export const updateSeat = crudController.updateOne('seat');

export const deleteSeat = crudController.deleteOne('seat');
