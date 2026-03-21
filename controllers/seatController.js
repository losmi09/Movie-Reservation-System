import { catchAsync } from '../utils/catchAsync.js';
import { formatResponse } from '../mappers/formatResponse.js';
import { sendResponse } from './utils/sendResponse.js';
import * as crudController from './crudController.js';
import * as seatService from '../services/seatService.js';

export const getAllSeats = crudController.getAll('seat');

export const getSeat = crudController.getOne('seat');

export const createSeat = catchAsync(async (req, res) => {
  const { body, params } = req;

  const seat = await seatService.createSeat({ ...body, rowId: params.id });

  sendResponse(res, formatResponse.seat(seat), 201);
});

export const updateSeat = crudController.updateOne('seat');

export const deleteSeat = crudController.deleteOne('seat');
