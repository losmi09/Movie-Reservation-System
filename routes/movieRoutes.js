import { Router } from 'express';
import validateUuid from '../middlewares/validateUuid.js';
import * as movieController from '../controllers/movieController.js';

export const router = Router();

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(movieController.createMovie);

router
  .route('/:id')
  .get(validateUuid, movieController.getMovie)
  .patch(validateUuid, movieController.updateMovie)
  .delete(validateUuid, movieController.deleteMovie);
