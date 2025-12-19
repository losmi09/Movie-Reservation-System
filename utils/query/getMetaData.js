import prisma from '../../server.js';

const getMetaData = async (query, model) => {
  const { page = 1, limit = 20 } = query;

  const totalCount = await prisma[model].count();

  const pageSize = Number(limit);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    totalCount,
    page: Number(page),
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1 && pageSize <= totalPages,
  };
};

export default getMetaData;
