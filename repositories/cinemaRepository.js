import prisma from '../server.js';

export const createCinema = async cinemaData =>
  await prisma.cinema.create({ data: cinemaData });
