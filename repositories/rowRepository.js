import prisma from '../server.js';

export const getSeatCapacity = async rowId =>
  await prisma.row.findUnique({
    where: { id: rowId },
    select: { seatCapacity: true },
  });

export const getRowsInHall = async hallId =>
  await prisma.row.findMany({ where: { hallId } });
