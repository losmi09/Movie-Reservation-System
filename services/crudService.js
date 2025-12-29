import getMetaData from '../utils/query/getMetaData.js';
import * as crudRepository from '../repositories/crudRepository.js';

export const getAll = async (model, query) => {
  const docs = await crudRepository.getAll(model, query);

  const metaData = await getMetaData(query, model);

  return { docs, metaData };
};

export const getOne = async (model, params) =>
  await crudRepository.getOne(model, params);

export const createOne = async (model, data) =>
  await crudRepository.createOne(model, data);

export const updateOne = async (model, params, data) =>
  await crudRepository.updateOne(model, params, data);

export const deleteOne = async (model, params) =>
  await crudRepository.deleteOne(model, params);
