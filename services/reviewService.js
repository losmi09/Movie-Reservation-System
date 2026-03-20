import { ensureParentExists } from './utils/ensureParentExists.js';
import { AppError } from '../utils/appError.js';
import { BusinessLogicError } from '../utils/BusinessLogicError.js';
import * as redisService from '../services/redisService.js';
import * as reviewRepository from '../repositories/reviewRepository.js';
import * as movieService from '../services/movieService.js';
import * as reservationService from '../services/reservationService.js';
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

const invalidateReviewAndMovieCache = () =>
  Promise.all([
    redisService.invalidateCache('review'),
    redisService.invalidateCache('movie'),
  ]);

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

export const createReview = async (data, userId) => {
  const { movieId } = data;

  await ensureParentExists('movie', movieId);

  // Check if user has watched the movie that he wants to review, this function returns first user's reservation with status of reserved for a showtime where this movie was shown
  const reservation =
    await reservationService.getUserEarliestReservationForMovie(
      movieId,
      userId,
    );

  if (!reservation)
    throw new BusinessLogicError(
      'movieId',
      "You cannot review a movie that you haven't watched yet",
    );

  // Check if the first showtime where the user watched this movie is still ongoing
  if (reservation.showtime.endTime > new Date())
    throw new BusinessLogicError(
      'movieId',
      'You cannot review the movie until showtime ends',
    );

  const review = await reviewTransaction({
    data: { ...data, userId },
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
