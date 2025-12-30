import * as seatRepository from '../repositories/seatRepository.js';

export const countSeatsInRow = async (hallId, row) =>
  await seatRepository.countSeatsInRow(hallId, row);
