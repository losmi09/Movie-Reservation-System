import { selectSingleDoc } from './prismaSelects.js';
import { prisma } from '../server.js';

export const getSeat = async (seatId, fields) =>
  await prisma.seat.findUnique({
    where: { id: seatId },
    ...(fields && { select: fields }),
  });

export const createSeat = async data =>
  await prisma.seat.create({ data, select: selectSingleDoc.seat() });

export const countSeatsInRow = async rowId =>
  await prisma.seat.count({ where: { rowId } });
