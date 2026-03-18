import { ensureParentExists } from './utils/ensureParentExists.js';
import { AppError } from '../utils/appError.js';
import * as redisService from '../services/redisService.js';
import * as reviewRepository from '../repositories/reviewRepository.js';
import * as movieService from '../services/movieService.js';
import { prisma } from '../server.js';

const checkIfReviewExistsAndBelongsToUser = async (
  reviewId,
  userId,
  change,
  selectFields,
) => {
  const review = await reviewRepository.getReview(reviewId, {
    userId: true,
    ...selectFields,
  });

  if (!review) throw new AppError('No review found with this ID', 404);

  if (review.userId !== userId)
    throw new AppError(`You can only ${change} your own reviews`, 403);

  return review;
};

const invalidateReviewAndMovieCache = async () => {
  await redisService.invalidateCache('review');
  await redisService.invalidateCache('movie');
};

const reviewOperations = {
  create: ({ tx, data }) => reviewRepository.createReview(tx, data),

  update: ({ tx, data, reviewId }) =>
    reviewRepository.updateReview({ tx, reviewId, data }),

  delete: ({ tx, reviewId }) => reviewRepository.deleteReview(tx, reviewId),
};

const reviewTransaction = async ({ data, operation, reviewId, movieId }) =>
  await prisma.$transaction(async tx => {
    const review = await reviewOperations[operation]({ tx, data, reviewId });

    await movieService.updateMovieReviewStats(tx, movieId);

    await invalidateReviewAndMovieCache();

    return review;
  });

export const createReview = async data => {
  const { movieId } = data;

  await ensureParentExists('movie', movieId);

  const review = await reviewTransaction({
    data,
    operation: 'create',
    movieId,
  });

  return review;
};

export const updateReview = async (reviewId, userId, data) => {
  const review = await checkIfReviewExistsAndBelongsToUser(
    reviewId,
    userId,
    'update',
    { rating: true, movieId: true },
  );

  const { rating } = data;

  // If new rating is provided and it doesn't match the old one - update movie's review stats
  if (rating && rating !== review.rating)
    return await reviewTransaction({
      data,
      operation: 'update',
      reviewId,
      movieId: review.movieId,
    });

  const updatedReview = await reviewRepository.updateReview({ reviewId, data });

  await invalidateReviewAndMovieCache();

  return updatedReview;
};

export const deleteReview = async (reviewId, userId) => {
  const { movieId } = await checkIfReviewExistsAndBelongsToUser(
    reviewId,
    userId,
    'delete',
    { movieId: true },
  );

  await reviewTransaction({ operation: 'delete', reviewId, movieId });
};
