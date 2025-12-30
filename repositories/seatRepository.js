import prisma from '../server.js';

export const countSeatsInRow = async (hallId, row) =>
  await prisma.seat.count({ where: { hallId, row } });
