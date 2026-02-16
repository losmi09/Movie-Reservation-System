import * as queryService from '../services/queryService.js';
import prisma from '../server.js';

export const getAll = async (model, query) => {
  const { filters, skip, limit, orderBy, selectFields } =
    queryService.prepareQuery(query);

  return await prisma[model].findMany({
    skip,
    take: limit,
    where: filters,
    orderBy,
    select: selectFields,
  });
};

// "baseConfig" refers to the object that would be passed without select config
const selectParents = (baseConfig, select) => {
  const finalConfig = { ...baseConfig };
  if (select) finalConfig.select = select;
  return finalConfig;
};

export const getOne = async (model, id, select) =>
  await prisma[model].findUnique(selectParents({ where: { id } }, select));

export const createOne = async (model, data, select) =>
  await prisma[model].create(selectParents({ data }, select));

export const updateOne = async (model, id, data, select) =>
  await prisma[model].update(selectParents({ where: { id }, data }, select));

export const deleteOne = async (model, id) =>
  await prisma[model].delete({ where: { id } });
