import { Router } from 'express';
import setUserId from '../middlewares/setUserId.js';
import validateId from '../middlewares/validateId.js';
import { checkIfReviewBelongsToUser } from '../middlewares/reviews.js';
import { cacheAll, cacheOne } from '../middlewares/caching.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as reviewController from '../controllers/reviewController.js';

// Used to get all reviews on a specific movie (/movies/:id/reviews route)
export const movieReviewRouter = Router({ mergeParams: true });

movieReviewRouter.use(authMiddleware.protect);

movieReviewRouter
  .route('/')
  .get(validateId, cacheAll('review'), reviewController.getAllReviews)
  .post(
    authMiddleware.restrictTo('user'),
    setUserId,
    reviewController.createReview,
  );

// Used for single review (/reviews/:id route)
export const reviewRouter = Router();

reviewRouter.use(authMiddleware.protect);

reviewRouter
  .route('/:id')
  .get(validateId, cacheOne('review'), reviewController.getReview)
  .patch(
    validateId,
    checkIfReviewBelongsToUser('update'),
    reviewController.updateReview,
  )
  .delete(
    validateId,
    checkIfReviewBelongsToUser('delete'),
    reviewController.deleteReview,
  );
