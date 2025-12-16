import prisma from '../server.js';

export const createMovie = async movieData =>
  await prisma.movie.create({ data: movieData });
