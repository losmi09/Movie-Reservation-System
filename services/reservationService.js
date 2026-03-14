import { BusinessLogicError } from '../utils/BusinessLogicError.js';
import { AppError } from '../utils/appError.js';
import * as reservationRepository from '../repositories/reservationRepository.js';
import * as showtimeService from './showtimeService.js';
import * as rowService from './rowService.js';
import * as seatService from './seatService.js';

const throwReservationNotFoundError = () => {
  throw new AppError('No reservation found with this ID', 404);
};

export const getReservation = async (reservationId, userId) => {
  const reservation = await reservationRepository.getReservation(
    reservationId,
    null,
    true,
  );

  // Verify that reservation belongs to user
  if (reservation.userId !== userId) throwReservationNotFoundError();

  return reservation;
};

export const countShowtimeReservations = (showtimeId, userId) =>
  reservationRepository.countShowtimeReservations(showtimeId, userId);

export const addToWaitlist = (showtimeId, userId) =>
  reservationRepository.createReservation({
    showtimeId,
    userId,
    seatId: undefined,
    status: 'waitlist',
  });

const checkIfShowtimeHasStarted = startTime => new Date(startTime) < new Date();

const RESERVED_SEATS_LIMIT = 5;

export const createReservation = async (showtimeId, seatId, userId) => {
  // Verify that showtime exists
  const [showtime, seat] = await Promise.all([
    showtimeService.getShowtime(showtimeId, { hallId: true, startTime: true }),
    seatService.getSeat(seatId, { rowId: true }),
  ]);

  // Verify that showtime has not started/finished
  if (checkIfShowtimeHasStarted(showtime?.startTime))
    throw new BusinessLogicError(
      'showtimeId',
      'Reservations are closed for this showtime',
    );

  if (!showtime)
    throw new BusinessLogicError(
      'showtimeId',
      'No showtime found with this ID',
    );

  if (!seat)
    throw new BusinessLogicError('seatId', 'No seat found with this ID');

  // Check if the user has reserved the maximum number of seats allowed
  const reservedSeatsByUser = await countShowtimeReservations(
    showtimeId,
    userId,
  );

  if (reservedSeatsByUser >= RESERVED_SEATS_LIMIT)
    throw new BusinessLogicError(
      'reservationLimit',
      `You cannot reserve more than ${RESERVED_SEATS_LIMIT} seats`,
    );

  const [row, { isSeatReserved, areAllSeatsReserved }] = await Promise.all([
    rowService.getRow(seat.rowId, { hallId: true }),
    showtimeService.getSeatStatus(showtimeId, showtime.hallId, seatId),
  ]);

  // Verify that seat belongs to hall with provided ID
  if (row.hallId !== showtime.hallId)
    throw new BusinessLogicError(
      'seatId',
      'Seat with this ID does not belong to this hall',
    );

  // If all seats are reserved, make a reservation with status of waitlist
  if (areAllSeatsReserved) return addToWaitlist(showtimeId, userId);

  // Verify that seat is not reserved
  if (isSeatReserved)
    throw new BusinessLogicError('seatId', 'This seat is reserved');

  return await reservationRepository.createReservation({
    showtimeId,
    seatId,
    userId,
  });
};

export const cancelReservation = async (reservationId, userId) => {
  const reservation = await reservationRepository.getReservation(
    reservationId,
    userId,
  );

  // Verify that reservation exists and belongs to user
  if (reservation?.userId !== userId) throwReservationNotFoundError();

  const showtime = await showtimeService.getShowtime(reservation.showtimeId);

  if (checkIfShowtimeHasStarted(showtime?.startTime))
    throw new BusinessLogicError(
      'showtimeId',
      'You cannot cancel a reservation for a showtime that is ongoing or has ended',
    );

  // Check if reservation is already cancelled
  if (reservation.status === 'cancelled')
    throw new BusinessLogicError(
      'reservationId',
      'This reservation is already cancelled',
    );

  // Check if there are reservations with status of waitlist
  const firstInWaitlist = await reservationRepository.getFirstInWaitlist(
    reservation.showtimeId,
  );

  // Cancel reservation and reserve seat for first in waitlist
  if (firstInWaitlist && reservation.status !== 'waitlist')
    return await reservationRepository.waitlistTransaction(
      reservationId,
      firstInWaitlist.id,
      reservation.seatId,
    );

  return await reservationRepository.cancelReservation(reservationId);
};
