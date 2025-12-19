import prisma from '../../server.js';
import excludeFromQuery from './excludeFromQuery.js';

const getMetaData = async (query, model) => {
  const queryClone = structuredClone(query);

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
