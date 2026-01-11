import * as hallRepository from '../repositories/hallRepository.js';
import * as rowService from './rowService.js';

export const isHallFullOfRows = async hallId => {
  const [{ maxRows }, rowsInHall] = await Promise.all([
    await hallRepository.getMaxRows(hallId),
    await rowService.getRowsInHall(hallId),
  ]);

  return maxRows <= rowsInHall.length;
};
