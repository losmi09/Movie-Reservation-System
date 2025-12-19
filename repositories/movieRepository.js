import prepareQuery from '../utils/query/prepareQuery.js';
import prisma from '../server.js';

export const getAllMovies = async query => {
  const { queryClone, skip, limit, orderBy, selectFields } =
    prepareQuery(query);

  return await prisma.movie.findMany({
    skip,
    take: limit,
    where: queryClone,
    orderBy,
    select: selectFields,
  });
};

export const getMovie = async movieId =>
  await prisma.movie.findUnique({ where: { id: movieId } });

export const createMovie = async movieData =>
  await prisma.movie.create({ data: movieData });

export const updateMovie = async (movieId, movieData) =>
  await prisma.movie.update({ where: { id: movieId }, data: movieData });
