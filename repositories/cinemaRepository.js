import { prisma } from '../server.js';

export const getCinema = async (cinemaId, fields) =>
  await prisma.cinema.findUnique({
    where: { id: cinemaId },
    ...(fields && { select: fields }),
  });

export const createCinema = async data => await prisma.cinema.create({ data });

export const updateCinema = async (cinemaId, data) =>
  await prisma.cinema.update({ where: { id: cinemaId }, data });
