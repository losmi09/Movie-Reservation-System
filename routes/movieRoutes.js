import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import checkIfExists from '../middlewares/checkIfExists.js';
import setParentFilter from '../middlewares/setParentFilter.js';
import * as movieController from '../controllers/movieController.js';
import { cacheAll, cacheOne } from '../middlewares/caching.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as imageMiddleware from '../middlewares/image.js';
import { movieShowtimeRouter as showtimeRouter } from './showtimeRoutes.js';
import { movieReviewRouter as reviewRouter } from './reviewRoutes.js';

export const movieRouter = Router();

movieRouter.use('/:id/reviews', setParentFilter('movie'), reviewRouter);

movieRouter.use(
  '/:id/showtimes',
  validateId,
  setParentFilter('movie'),
  showtimeRouter,
);

movieRouter
  .route('/')
  .get(cacheAll('movie'), movieController.getAllMovies)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    movieController.createMovie,
  );

movieRouter
  .route('/:id')
  .get(validateId, cacheOne('movie'), movieController.getMovie)
  .patch(
    validateId,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    movieController.updateMovie,
  )
  .delete(
    validateId,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    movieController.deleteMovie,
  );

movieRouter.patch(
  '/:id/poster',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  validateId,
  checkIfExists('movie'),
  imageMiddleware.uploadMoviePoster,
  imageMiddleware.resizeImage('movie'),
  movieController.saveMoviePoster,
);
