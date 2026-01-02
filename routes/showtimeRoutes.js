import { Router } from 'express';
import checkIfExists from '../middlewares/checkIfExists.js';
import * as showtimeController from '../controllers/showtimeController.js';
import * as authMiddleware from '../middlewares/auth.js';

export const router = Router({ mergeParams: true });

router
  .route('/')
  .get(checkIfExists('movie'), showtimeController.getAllShowtimes)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    showtimeController.createShowtime
  );

export const idRouter = Router();

idRouter
  .route('/:id')
  .get(showtimeController.getShowtime)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    showtimeController.updateShowtime
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    showtimeController.deleteShowtime
  );
