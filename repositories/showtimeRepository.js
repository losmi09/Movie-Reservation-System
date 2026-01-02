import prisma from '../server.js';

export const isShowtimeOngoing = async (cinemaId, hallId, startTime, endTime) =>
  await prisma.showtime.findFirst({
    where: {
      cinemaId,
      hallId,
      startTime: { gte: startTime },
      endTime: { lte: endTime },
    },
  });
