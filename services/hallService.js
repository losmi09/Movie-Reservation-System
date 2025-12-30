import * as hallRepository from '../repositories/hallRepository.js';
import * as seatService from './seatService.js';

export const isSeatRowFull = async (hallId, row) => {
  const { seatsPerRow } = await hallRepository.getSeatsPerRow(hallId);

  const seatsInRow = await seatService.countSeatsInRow(hallId, row);

  return seatsPerRow === seatsInRow;
};
