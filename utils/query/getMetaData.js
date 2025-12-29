import prisma from '../../server.js';
import convertNumericStringsToNumbers from '../convertNumericStrings.js';
import excludeFromQuery from './excludeFromQuery.js';

const getMetaData = async (query, model) => {
  let queryClone = structuredClone(query);

  queryClone = convertNumericStringsToNumbers(queryClone);

  excludeFromQuery(queryClone, 'page', 'limit', 'sort', 'fields');

  const totalCount = await prisma[model].count({ where: queryClone });

  const { page = 1, limit = 20 } = query;

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

export default getMetaData;
