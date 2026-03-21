import { Router } from 'express';
import { validateId } from '../middlewares/validateId.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { reviewSchema } from '../schemas/reviewSchema.js';
import { checkIfExists } from '../middlewares/checkIfExists.js';
import { cacheAll, cacheOne } from '../middlewares/caching.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as reviewController from '../controllers/reviewController.js';

// Used to get all reviews on specific movie and to create review (/movies/:id/reviews route)
export const movieReviewRouter = Router({ mergeParams: true });

movieReviewRouter.use(authMiddleware.protect);

movieReviewRouter
  .route('/')
  .get(
    validateId,
    checkIfExists('movie'),
    cacheAll('review'),
    reviewController.getAllReviews,
  )
  .post(
    authMiddleware.restrictTo('user'),
    validateSchema(reviewSchema),
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
    validateSchema(reviewSchema, true),
    reviewController.updateReview,
  )
  .delete(validateId, reviewController.deleteReview);
