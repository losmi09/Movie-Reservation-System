import { ensureParentExists } from './utils/ensureParentExists.js';
import { AppError } from '../utils/appError.js';
import * as redisService from '../services/redisService.js';
import * as reviewRepository from '../repositories/reviewRepository.js';

const checkIfReviewExistsAndBelongsToUser = async (
  reviewId,
  userId,
  change,
) => {
  const review = await reviewRepository.getReview(reviewId, { userId: true });

  if (!review) throw new AppError('No review found with this ID', 404);

  if (review.userId !== userId)
    throw new AppError(`You can only ${change} your own reviews`, 403);
};

export const createReview = async data => {
  await ensureParentExists('movie', data.movieId);

  await redisService.invalidateCache('review');

  return await reviewRepository.createReview(data);
};

export const updateReview = async (reviewId, userId, data) => {
  await checkIfReviewExistsAndBelongsToUser(reviewId, userId, 'update');

  await redisService.invalidateCache('review');

  return await reviewRepository.updateReview(reviewId, data);
};

export const deleteReview = async (reviewId, userId) => {
  await checkIfReviewExistsAndBelongsToUser(reviewId, userId, 'delete');

  await redisService.invalidateCache('review');

  return await reviewRepository.deleteReview(reviewId);
};
