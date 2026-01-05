import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import checkIfExists from '../middlewares/checkIfExists.js';
import setParentFilter from '../middlewares/setParentFilter.js';
import * as movieController from '../controllers/movieController.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as imageMiddleware from '../middlewares/image.js';
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

router.patch(
  '/:id/poster',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  validateId,
  checkIfExists('movie'),
  imageMiddleware.uploadMoviePoster,
  imageMiddleware.resizeImage('movie'),
  movieController.saveMoviePoster
);
