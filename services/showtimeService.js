import * as showtimeRepository from '../repositories/showtimeRepository.js';

export const isShowtimeOngoing = async (cinemaId, hallId, starttime, endTime) =>
  await showtimeRepository.isShowtimeOngoing(
    cinemaId,
    hallId,
    starttime,
    endTime
  );
