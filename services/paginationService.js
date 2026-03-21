import { convertNumericStringsToNumbers } from '../utils/convertNumericStrings.js';
import * as crudRepository from '../repositories/crudRepository.js';

export const paginate = query => {
  const { page = 1, limit = 20 } = query;

  const skip = (Number(page) - 1) * Number(limit);

  return { skip, limit: Number(limit) };
};

export const getMetaData = async (model, query) => {
  const { page = 1, limit = 20, sort, fields, ...filters } = query;

  const cleanFilters = convertNumericStringsToNumbers(filters);

  const totalCount = await crudRepository.count(model, cleanFilters);

  const pageSize = Number(limit);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    totalCount,
    page: Number(page),
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1 && page <= totalPages,
  };
};
