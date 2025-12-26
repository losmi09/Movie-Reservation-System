import { Router } from 'express';
import validateUuid from '../middlewares/validateUuid.js';
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

router
  .route('/:id')
  .get(validateUuid, cinemaController.getCinema)
  .patch(validateUuid, cinemaController.updateCinema)
  .delete(validateUuid, cinemaController.deleteCinema);
