import { selectSingleDoc } from './prismaSelects.js';
import { prisma } from '../server.js';

export const getHall = async (hallId, fields) =>
  await prisma.hall.findUnique({
    where: { id: hallId },
    ...(fields && { select: fields }),
  });

export const createHall = async data =>
  await prisma.hall.create({ data, select: selectSingleDoc.hall() });
