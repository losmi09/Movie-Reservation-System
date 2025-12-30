import prisma from '../server.js';

export const getSeatsPerRow = async hallId =>
  await prisma.hall.findUnique({
    where: { id: hallId },
    select: { seatsPerRow: true },
  });
