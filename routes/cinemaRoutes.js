import { Router } from 'express';
import * as cinemaController from '../controllers/cinemaController.js';
import * as authMiddleware from '../middlewares/auth.js';

export const router = Router();

router
  .route('/')
  .get(cinemaController.getAllCinemas)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    cinemaController.createCinema
  );
