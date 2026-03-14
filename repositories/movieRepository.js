import { prisma } from '../server.js';

export const createMovie = async data => await prisma.movie.create({ data });

export const updateMovie = async (movieId, data) =>
  await prisma.movie.update({ where: { id: movieId }, data });

export const saveMoviePoster = async (movieId, fileName) =>
  await prisma.movie.update({
    where: { id: movieId },
    data: { posterImage: fileName },
  });
