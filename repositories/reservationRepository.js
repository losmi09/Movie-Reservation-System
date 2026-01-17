import prisma from '../server.js';

export const getReservationById = async reservationId =>
  await prisma.reservation.findUnique({
    where: { id: reservationId, status: 'reserved' },
  });

export const getReservation = async (showtimeId, seatId) =>
  await prisma.reservation.findFirst({
    where: { showtimeId, seatId, status: 'reserved' },
  });

export const countShowtimeReservations = async showtimeId =>
  await prisma.reservation.count({ where: { showtimeId, status: 'reserved' } });

export const getFirstInWaitlist = async showtimeId =>
  await prisma.reservation.findFirst({
    where: { showtimeId, status: 'waitlist' },
    orderBy: { id: 'asc' },
  });

export const cancelReservation = reservationId =>
  prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'cancelled' },
  });

export const reserveSeatForFirstInWaitlist = (waitlistId, seatId) =>
  prisma.reservation.update({
    where: { id: waitlistId },
    data: { seatId, status: 'reserved' },
  });
