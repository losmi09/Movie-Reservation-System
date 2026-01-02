import * as showtimeRepository from '../repositories/showtimeRepository.js';

export const isShowtimeOngoing = async (cinemaId, hallId, startTime, endTime) =>
  await showtimeRepository.isShowtimeOngoing(
    cinemaId,
    hallId,
    startTime,
    endTime
  );
