import * as hallRepository from '../repositories/hallRepository.js';
import * as seatService from './seatService.js';

export const isSeatRowFull = async (hallId, row) => {
  const [{ seatsPerRow }, seatsInRow] = await Promise.all([
    hallRepository.getSeatsPerRow(hallId),
    seatService.countSeatsInRow(hallId, row),
  ]);

  return seatsPerRow <= seatsInRow;
};
