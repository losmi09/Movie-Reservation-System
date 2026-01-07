import getMetaData from '../utils/query/getMetaData.js';
import { invalidateCache } from '../middlewares/caching.js';
import * as crudRepository from '../repositories/crudRepository.js';

export const getAll = async (model, query) => {
  const data = await crudRepository.getAll(model, query);

  const meta = await getMetaData(query, model);

  return { data, meta };
};

export const getOne = async (model, id) =>
  await crudRepository.getOne(model, id);

export const createOne = async (model, data) => {
  const newObj = {};

  // Convert showtime startTime and endTime from ISO 8601 format to date
  Object.entries(data).forEach(entry => {
    const [key, value] = entry;
    if (key === 'startTime' || key === 'endTime') newObj[key] = new Date(value);
    else newObj[key] = value;
  });

  const createdDoc = await crudRepository.createOne(model, newObj);

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
