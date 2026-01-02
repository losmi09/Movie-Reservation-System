import { Router } from 'express';
import * as showtimeController from '../controllers/showtimeController.js';
import * as authMiddleware from '../middlewares/auth.js';

export const router = Router({ mergeParams: true });

router
  .route('/')
  .get(showtimeController.getAllShowtimes)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    showtimeController.createShowtime
  );

export const idRouter = Router();

idRouter
  .route('/:id')
  .get(showtimeController.getShowtime)
  .patch(showtimeController.updateShowtime)
  .delete(showtimeController.deleteShowtime);
