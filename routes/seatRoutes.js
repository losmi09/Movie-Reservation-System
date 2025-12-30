import { Router } from 'express';
import * as seatController from '../controllers/seatController.js';
import * as authMiddleware from '../middlewares/auth.js';

export const router = Router({ mergeParams: true });

router.use(authMiddleware.protect);

router
  .route('/')
  .get(seatController.getAllSeats)
  .post(authMiddleware.restrictTo('admin'), seatController.createSeat);

export const idRouter = Router();

idRouter.use(authMiddleware.protect);

idRouter
  .route('/:id')
  .get(authMiddleware.restrictTo('admin'), seatController.getSeat)
  .patch(authMiddleware.restrictTo('admin'), seatController.updateSeat)
  .delete(authMiddleware.restrictTo('admin'), seatController.deleteSeat);
