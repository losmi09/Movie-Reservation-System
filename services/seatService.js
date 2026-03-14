import { ensureCapacityAndExistance } from './utils/ensureCapacityAndExistance.js';
import * as redisService from '../services/redisService.js';
import * as seatRepository from '../repositories/seatRepository.js';

export const getSeat = async (seatId, fields) =>
  await seatRepository.getSeat(seatId, fields);

export const createSeat = async data => {
  await ensureCapacityAndExistance('row', data.rowId);

  await redisService.invalidateCache('seat');

  return await seatRepository.createSeat(data);
};
