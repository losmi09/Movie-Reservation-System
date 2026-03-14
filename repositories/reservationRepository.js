import { selectSingleDoc } from './prismaSelects.js';
import { prisma } from '../server.js';

const reservationSelection = selectSingleDoc.reservation();

export const getReservation = async (reservationId, userId, format) =>
  await prisma.reservation.findFirst({
    where: { id: reservationId, ...(userId && { userId }) },
    ...(format && { select: { ...reservationSelection, userId: true } }),
  });

export const getReservedReservation = async (showtimeId, seatId) =>
  await prisma.reservation.findFirst({
    where: { showtimeId, seatId, status: 'reserved' },
  });

export const createReservation = async data =>
  await prisma.reservation.create({ data, select: reservationSelection });

export const countShowtimeReservations = async (showtimeId, userId) =>
  await prisma.reservation.count({
    where: { showtimeId, status: 'reserved', ...(userId && { userId }) },
  });

export const getFirstInWaitlist = async showtimeId =>
  await prisma.reservation.findFirst({
    where: { showtimeId, status: 'waitlist' },
    orderBy: { createdAt: 'asc' },
  });

export const cancelReservation = reservationId =>
  prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'cancelled' },
    select: reservationSelection,
  });

export const reserveSeatForFirstInWaitlist = (waitlistId, seatId) =>
  prisma.reservation.update({
    where: { id: waitlistId },
    data: { seatId, status: 'reserved' },
  });

export const waitlistTransaction = async (
  reservationId,
  waitlistId,
  seatId,
) => {
  const [cancelledReservation] = await prisma.$transaction([
    cancelReservation(reservationId),
    reserveSeatForFirstInWaitlist(waitlistId, seatId),
  ]);

  return cancelledReservation;
};
