import { selectSingleDoc } from '../repositories/prismaSelects.js';
import * as crudRepository from '../repositories/crudRepository.js';
import * as redisService from '../services/redisService.js';
import * as paginationService from '../services/paginationService.js';

export const getAll = async (model, query) => {
  const [data, meta] = await Promise.all([
    crudRepository.getAll(model, query),
    paginationService.getMetaData(model, query),
  ]);

  return { data, meta };
};

const selectConfig = model => selectSingleDoc?.[model]?.();

const invalidateModelCache = model => redisService.invalidateCache(model);

export const getOne = async (model, id) =>
  await crudRepository.getOne(model, id, selectConfig(model));

export const updateOne = async (model, id, data) => {
  const updatedDoc = await crudRepository.updateOne(
    model,
    id,
    data,
    selectConfig(model),
  );

  await invalidateModelCache(model);

  return updatedDoc;
};

export const deleteOne = async (model, id) => {
  await crudRepository.deleteOne(model, id);

  await invalidateModelCache(model);
};
