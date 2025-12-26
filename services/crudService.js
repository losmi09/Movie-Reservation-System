import getMetaData from '../utils/query/getMetaData.js';
import * as crudRepository from '../repositories/crudRepository.js';

export const getAll = async (model, query) => {
  const docs = await crudRepository.getAll(model, query);

  const metaData = await getMetaData(query, model);

  return { docs, metaData };
};

export const getOne = async (model, id) =>
  await crudRepository.getOne(model, id);

export const createOne = async (model, data) =>
  await crudRepository.createOne(model, data);

export const updateOne = async (model, id, data) =>
  await crudRepository.updateOne(model, id, data);

export const deleteOne = async (model, id) =>
  await crudRepository.deleteOne(model, id);
