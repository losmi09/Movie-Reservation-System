import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import * as cinemaController from '../controllers/cinemaController.js';
import * as authMiddleware from '../middlewares/auth.js';
import { router as hallRouter } from './hallRoutes.js';

export const router = Router();

router.use('/:id/halls', validateId, hallRouter);

router
  .route('/')
  .get(cinemaController.getAllCinemas)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    cinemaController.createCinema
  );

router.use(authMiddleware.protect);

router
  .route('/:id')
  .get(validateId, cinemaController.getCinema)
  .patch(
    validateId,
    authMiddleware.restrictTo('admin'),
    cinemaController.updateCinema
  )
  .delete(
    validateId,
    authMiddleware.restrictTo('admin'),
    cinemaController.deleteCinema
  );
