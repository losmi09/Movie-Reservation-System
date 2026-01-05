import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import setParentFilter from '../middlewares/setParentFilter.js';
import * as movieController from '../controllers/movieController.js';
import * as authMiddleware from '../middlewares/auth.js';
import { router as showtimeRouter } from './showtimeRoutes.js';

export const router = Router();

router.use(
  '/:id/showtimes',
  validateId,
  setParentFilter('movie'),
  showtimeRouter
);

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    movieController.createMovie
  );

router
  .route('/:id')
  .get(validateId, movieController.getMovie)
  .patch(
    validateId,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    movieController.updateMovie
  )
  .delete(
    validateId,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    movieController.deleteMovie
  );
