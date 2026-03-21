import { catchAsync } from '../utils/catchAsync.js';
import { formatResponse } from '../mappers/formatResponse.js';
import { sendResponse } from './utils/sendResponse.js';
import * as crudController from './crudController.js';
import * as reservationService from '../services/reservationService.js';

export const getAllReservations = crudController.getAll('reservation');

export const getReservation = catchAsync(async (req, res) => {
  const { params, user } = req;

  const reservation = await reservationService.getReservation(
    params.id,
    user.id,
  );

  sendResponse(res, formatResponse.reservation(reservation));
});

export const createReservation = catchAsync(async (req, res) => {
  const { showtimeId, seatId } = req.body;

  const reservation = await reservationService.createReservation(
    showtimeId,
    seatId,
    req.user.id,
  );

  sendResponse(res, formatResponse.reservation(reservation), 201);
});

export const cancelReservation = catchAsync(async (req, res) => {
  const { params, user } = req;

  const cancelledReservation = await reservationService.cancelReservation(
    params.id,
    user.id,
  );

  sendResponse(res, cancelledReservation);
});
