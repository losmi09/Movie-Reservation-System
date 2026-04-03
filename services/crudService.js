import { selectSingleDoc } from '../repositories/prismaSelects.js';
import { selectForManyDocs } from '../repositories/prismaSelects.js';
import * as crudRepository from '../repositories/crudRepository.js';
import * as redisService from '../services/redisService.js';
import * as queryService from '../services/queryService.js';
import * as paginationService from '../services/paginationService.js';

const filterData = (data, allowedFields) =>
  data.map(obj => {
    const newObj = {};

    Object.keys(obj).forEach(field => {
      if (allowedFields.includes(field)) newObj[field] = obj[field];
    });

    return newObj;
  });

export const getAll = async (model, query) => {
  const { cursor, pageSize, filters, selectFields } =
    queryService.prepareQuery(query);

  const decodedCursorToken = cursor
    ? paginationService.decodeCursorToken(cursor)
    : null;

  // Select fields that were specified in query or in model's select-config
  const select = selectFields ?? selectForManyDocs?.[model]?.();

  const data = await crudRepository.getAll(
    model,
    decodedCursorToken,
    pageSize,
    filters,
    select,
  );

  // data objects always contain createdAt and id fields (neccesary to determine next cursor), so if they are not specified in the select object - simply ignore them
  const allowedFields = Object.keys(select);

  let filteredData = filterData(data, allowedFields);

  let nextCursor = null;

  // Check if there are more records than the pageSize and if so - provide the next cursor
  const hasNextPage = data.length > pageSize;

  if (hasNextPage) {
    // Get createdAt and id from last document - based on pageSize
    const { createdAt, id } = data[pageSize - 1];

    nextCursor = paginationService.encodeCursorToken(createdAt, id);

    // Remove the extra record used to determine if next page exists
    filteredData = filteredData.slice(0, -1);
  }

  return { data: filteredData, meta: { nextCursor } };
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
