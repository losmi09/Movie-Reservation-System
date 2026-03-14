import { ensureParentExists } from './utils/ensureParentExists.js';
import * as hallRepository from '../repositories/hallRepository.js';
import * as redisService from '../services/redisService.js';

export const getHall = (hallId, fields) =>
  hallRepository.getHall(hallId, fields);

export const createHall = async data => {
  await ensureParentExists('cinema', data.cinemaId);

  await redisService.invalidateCache('hall');

  return await hallRepository.createHall(data);
};
