import prisma from '../../server.js';
import convertNumericStringsToNumbers from '../convertNumericStrings.js';

const getMetaData = async (model, query) => {
  const { page = 1, limit = 20, sort, fields, ...filters } = query;

  const cleanFilters = convertNumericStringsToNumbers(filters);

  const totalCount = await prisma[model].count({ where: cleanFilters });

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
