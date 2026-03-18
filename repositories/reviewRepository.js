import { selectSingleDoc } from './prismaSelects.js';
import { prisma } from '../server.js';

const reviewSelection = selectSingleDoc.review();

export const getReview = async (reviewId, fields) =>
  await prisma.review.findUnique({
    where: { id: reviewId },
    ...(fields && { select: fields }),
  });

export const createReview = async (tx, data) =>
  await tx.review.create({ data, select: reviewSelection });

export const updateReview = async ({ tx = prisma, reviewId, data }) =>
  await tx.review.update({
    where: { id: reviewId },
    data,
    select: reviewSelection,
  });

export const deleteReview = async (tx, reviewId) =>
  await tx.review.delete({
    where: { id: reviewId },
    select: { movieId: true },
  });
