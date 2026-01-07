import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import { cacheAll, cacheOne } from '../middlewares/caching.js';
import checkIfExists from '../middlewares/checkIfExists.js';
import * as seatController from '../controllers/seatController.js';
import * as authMiddleware from '../middlewares/auth.js';

// Used for nested /halls/:id/seats route
export const hallSeatRouter = Router({ mergeParams: true });

hallSeatRouter.use(authMiddleware.protect);

hallSeatRouter
  .route('/')
  .get(checkIfExists('hall'), cacheAll('seat'), seatController.getAllSeats)
  .post(authMiddleware.restrictTo('admin'), seatController.createSeat);

// Separate router for non-nested routes and /halls/:id/seats route
export const seatRouter = Router();

seatRouter.use(authMiddleware.protect);

seatRouter
  .route('/:id')
  .get(validateId, cacheOne('seat'), seatController.getSeat)
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
