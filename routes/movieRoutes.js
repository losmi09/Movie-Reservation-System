import { Router } from 'express';
import validateUuid from '../middlewares/validateUuid.js';
import * as movieController from '../controllers/movieController.js';
import * as authMiddleware from '../middlewares/auth.js';

export const router = Router();

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
  .get(validateUuid, movieController.getMovie)
  .patch(
    validateUuid,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    movieController.updateMovie
  )
  .delete(
    validateUuid,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    movieController.deleteMovie
  );
