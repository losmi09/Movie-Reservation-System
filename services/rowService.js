import { ensureCapacityAndExistance } from './utils/ensureCapacityAndExistance.js';
import * as redisService from '../services/redisService.js';
import * as rowRepository from '../repositories/rowRepository.js';

export const getRow = async (rowId, fields) =>
  await rowRepository.getRow(rowId, fields);

export const createRow = async data => {
  await ensureCapacityAndExistance('hall', data.hallId);

  await redisService.invalidateCache('row');

  return await rowRepository.createRow(data);
};
