import getMetaData from '../utils/query/getMetaData.js';
import { invalidateCache } from '../middlewares/caching.js';
import * as crudRepository from '../repositories/crudRepository.js';
import * as showtimeService from '../services/showtimeService.js';

export const getAll = async (model, query) => {
  const data = await crudRepository.getAll(model, query);

  const meta = await getMetaData(query, model);

  return { data, meta };
};

export const getOne = async (model, id) =>
  await crudRepository.getOne(model, id);

export const createOne = async (model, data) => {
  if (model === 'showtime')
    showtimeService.convertShowtimeDatesToISOFormat(data);

  const createdDoc = await crudRepository.createOne(model, data);

  await invalidateCache(model);

  return createdDoc;
};

export const updateOne = async (model, id, data) => {
  const updatedDoc = await crudRepository.updateOne(model, id, data);

  await invalidateCache(model);

  return updatedDoc;
};

export const deleteOne = async (model, id) => {
  await crudRepository.deleteOne(model, id);

  await invalidateCache(model);
};
