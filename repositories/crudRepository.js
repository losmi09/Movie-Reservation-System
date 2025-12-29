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

export const getOne = async (model, params) =>
  await prisma[model].findUnique({
    where: params,
  });

export const createOne = async (model, data) =>
  await prisma[model].create({ data });

export const updateOne = async (model, params, data) =>
  await prisma[model].update({ where: params, data });

export const deleteOne = async (model, params) =>
  await prisma[model].delete({ where: params });
