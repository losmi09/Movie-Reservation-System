import { selectSingleDoc } from './prismaSelects.js';
import { prisma } from '../server.js';

const reviewSelection = selectSingleDoc.review();

export const getReview = async (reviewId, fields) =>
  await prisma.review.findUnique({
    where: { id: reviewId },
    ...(fields && { select: fields }),
  });

export const createReview = async data =>
  await prisma.review.create({ data, select: reviewSelection });

export const updateReview = async (reviewId, data) =>
  await prisma.review.update({
    where: { id: reviewId },
    data,
    select: reviewSelection,
  });

export const deleteReview = async reviewId =>
  await prisma.review.delete({ where: { id: reviewId } });
