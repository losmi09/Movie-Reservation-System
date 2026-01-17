import * as reservationRepository from '../repositories/reservationRepository.js';
import * as showtimeService from './showtimeService.js';

export const getReservationById = async reservationId =>
  await reservationRepository.getReservationById(reservationId);

export const getReservation = async (showtimeId, seatId) =>
  await reservationRepository.getReservation(showtimeId, seatId);

export const countShowtimeReservations = async showtimeId =>
  await reservationRepository.countShowtimeReservations(showtimeId);

export const getFirstInWaitlist = async showtimeId =>
  await reservationRepository.getFirstInWaitlist(showtimeId);

export const cancelReservation = reservationId =>
  reservationRepository.cancelReservation(reservationId);

export const reserveSeatForFirstInWaitlist = (waitlistId, seatId) =>
  reservationRepository.reserveSeatForFirstInWaitlist(waitlistId, seatId);

export const addToWaitlist = async (showtimeId, hallId, data) => {
  // Check if all seats are reserved
  const allSeatsReserved = await showtimeService.areAllSeatsReserved(
    showtimeId,
    hallId,
  );

  if (allSeatsReserved) {
    data.seatId = undefined;
    data.status = 'waitlist';
  }
};
