import prisma from '../server.js';

export const countSeatsInRow = async rowId =>
  await prisma.seat.count({ where: { rowId } });

export const countSeatsInHall = async rowIds =>
  await prisma.seat.count({ where: { rowId: { in: rowIds } } });
