import { Router } from 'express';
import validateUuid from '../middlewares/validateUuid.js';
import * as movieController from '../controllers/movieController.js';
import * as authMiddleware from '../middlewares/auth.js';

export const router = Router();

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(authMiddleware.protect, movieController.createMovie);

router
  .route('/:id')
  .get(validateUuid, movieController.getMovie)
  .patch(validateUuid, authMiddleware.protect, movieController.updateMovie)
  .delete(validateUuid, authMiddleware.protect, movieController.deleteMovie);
