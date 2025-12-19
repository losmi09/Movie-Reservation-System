import { Router } from 'express';
import * as movieController from '../controllers/movieController.js';

export const router = Router();

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(movieController.createMovie);

router.route('/:id').get(movieController.getMovie);
