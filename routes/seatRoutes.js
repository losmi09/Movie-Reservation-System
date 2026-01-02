import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import checkIfExists from '../middlewares/checkIfExists.js';
import * as seatController from '../controllers/seatController.js';
import * as authMiddleware from '../middlewares/auth.js';

export const router = Router({ mergeParams: true });

router.use(authMiddleware.protect);

router
  .route('/')
  .get(checkIfExists('hall'), seatController.getAllSeats)
  .post(authMiddleware.restrictTo('admin'), seatController.createSeat);

export const idRouter = Router();

idRouter.use(authMiddleware.protect);

idRouter
  .route('/:id')
  .get(validateId, seatController.getSeat)
  .patch(
    authMiddleware.restrictTo('admin'),
    validateId,
    seatController.updateSeat
  )
  .delete(
    authMiddleware.restrictTo('admin'),
    validateId,
    seatController.deleteSeat
  );
