import * as reservationRepository from '../repositories/reservationRepository.js';

export const getReservationById = async reservationId =>
  await reservationRepository.getReservationById(reservationId);

export const getReservation = async (showtimeId, seatId) =>
  await reservationRepository.getReservation(showtimeId, seatId);

export const countShowtimeReservations = async showtimeId =>
  await reservationRepository.countShowtimeReservations(showtimeId);

export const getFirstInWaitlist = async () =>
  await reservationRepository.getFirstInWaitlist();

export const cancelReservation = reservationId =>
  reservationRepository.cancelReservation(reservationId);

export const reserveSeatForFirstInWaitlist = (waitlistId, seatId) =>
  reservationRepository.reserveSeatForFirstInWaitlist(waitlistId, seatId);
