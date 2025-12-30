import prepareQuery from '../utils/query/prepareQuery.js';
import prisma from '../server.js';

export const getAll = async (model, query) => {
  const { queryClone, skip, limit, orderBy, selectFields } =
    prepareQuery(query);

  return await prisma[model].findMany({
    skip,
    take: limit,
    where: queryClone,
    orderBy,
    select: selectFields,
  });
};

export const getOne = async (model, id) =>
  await prisma[model].findUnique({ where: { id } });

export const createOne = async (model, data) =>
  await prisma[model].create({ data });

export const updateOne = async (model, id, data) =>
  await prisma[model].update({ where: { id }, data });

export const deleteOne = async (model, id) =>
  await prisma[model].delete({ where: { id } });
