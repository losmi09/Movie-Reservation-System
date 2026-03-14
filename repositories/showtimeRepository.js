import { selectSingleDoc } from './prismaSelects.js';
import { prisma } from '../server.js';

export const getShowtime = async (showtimeId, fields) =>
  await prisma.showtime.findUnique({
    where: { id: showtimeId },
    ...(fields && { select: fields }),
  });

const showtimeSelection = selectSingleDoc.showtime();

export const createShowtime = async data =>
  await prisma.showtime.create({ data, select: showtimeSelection });

export const updateShowtime = async (showtimeId, data) =>
  await prisma.showtime.update({
    where: { id: showtimeId },
    data,
    select: showtimeSelection,
  });

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

export const getSeatStatus = async (showtimeId, hallId, seatId) => {
  // Done using raw SQL because Prisma does not have native support for subqueries and this approach would not be possible without them. The main goal here is to check if a seat is reserved and if all seats are reserved in ONE query, which is much better for performance. Otherwise we would have separate database queries.
  const [status] = await prisma.$queryRaw`
    -- CHECK IF ALL SEATS THAT BELONG TO PROVIDED HALL ARE RESERVED
    SELECT
     CASE WHEN (SELECT COUNT(s.id) AS total_hall_seats_count FROM halls AS h INNER JOIN rows AS r ON r.hall_id = h.id INNER JOIN seats AS s ON s.row_id = r.id WHERE h.id = ${hallId})
      <= 
      (SELECT COUNT(id) AS reserved_seats_count FROM reservations AS r WHERE showtime_id = ${showtimeId} AND status = 'reserved') THEN TRUE
    ELSE FALSE
    END AS are_all_seats_reserved, 

    -- CHECK IF SEAT IS RESERVED
    CASE WHEN EXISTS (SELECT FROM reservations WHERE seat_id = ${seatId} AND showtime_id = ${showtimeId} AND status = 'reserved') THEN TRUE
    ELSE FALSE
    END AS is_seat_reserved`;

  const {
    are_all_seats_reserved: areAllSeatsReserved,
    is_seat_reserved: isSeatReserved,
  } = status;

  return { isSeatReserved, areAllSeatsReserved };
};
