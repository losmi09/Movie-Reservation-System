import prisma from '../server.js';

export const isShowtimeOngoing = async (cinemaId, hallId, startTime, endTime) =>
  await prisma.showtime.findFirst({
    where: {
      cinemaId,
      hallId,
      OR: [
        {
          startTime: { gte: startTime },
          endTime: { lte: endTime },
        },
        {
          startTime: { gte: startTime, lte: endTime },
          endTime: { gte: endTime, gte: startTime },
        },
        {
          endTime: { lte: endTime, gte: startTime },
        },
        {
          endTime: { gte: endTime, lte: startTime },
        },
      ],
    },
  });
