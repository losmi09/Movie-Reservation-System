import prepareQuery from '../utils/query/prepareQuery.js';
import prisma from '../server.js';

export const getAllCinemas = async query => {
  const { queryClone, skip, limit, orderBy, selectFields } =
    prepareQuery(query);

  return await prisma.cinema.findMany({
    skip,
    take: limit,
    where: queryClone,
    orderBy,
    select: selectFields,
  });
};

export const createCinema = async cinemaData =>
  await prisma.cinema.create({ data: cinemaData });
