import * as showtimeRepository from '../repositories/showtimeRepository.js';
import * as rowService from '../services/rowService.js';
import * as seatService from '../services/seatService.js';
import * as reservationService from '../services/reservationService.js';

export const isShowtimeOngoing = async (cinemaId, hallId, startTime, endTime) =>
  await showtimeRepository.isShowtimeOngoing(
    cinemaId,
    hallId,
    startTime,
    endTime
  );

export const areAllSeatsReserved = async (showtimeId, hallId) => {
  const rowIds = (await rowService.getRowsInHall(hallId)).map(row => row.id);

  const [totalHallSeats, reservedSeats] = await Promise.all([
    seatService.countSeatsInHall(rowIds),
    reservationService.countShowtimeReservations(showtimeId),
  ]);

  return totalHallSeats <= reservedSeats;
};

export const convertShowtimeDatesToISOFormat = showtimeData => {
  showtimeData.startTime = new Date(showtimeData.startTime);
  showtimeData.endTime = new Date(showtimeData.endTime);
};
