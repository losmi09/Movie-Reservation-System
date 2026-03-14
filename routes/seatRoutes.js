import { Router } from 'express';
import { validateId } from '../middlewares/validateId.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { setParentId } from '../middlewares/setParentId.js';
import { seatSchema } from '../schemas/seatSchema.js';
import { setParentFilter } from '../middlewares/setParentFilter.js';
import { cacheAll, cacheOne } from '../middlewares/caching.js';
import { checkIfExists } from '../middlewares/checkIfExists.js';
import * as seatController from '../controllers/seatController.js';
import * as authMiddleware from '../middlewares/auth.js';

// Used for nested /halls/:id/seats route
export const rowSeatRouter = Router({ mergeParams: true });

rowSeatRouter.use(authMiddleware.protect);

rowSeatRouter
  .route('/')
  .get(
    checkIfExists('row'),
    setParentFilter('row'),
    cacheAll('seat'),
    seatController.getAllSeats,
  )
  .post(
    authMiddleware.restrictTo('admin'),
    setParentId('row'),
    validateSchema(seatSchema),
    seatController.createSeat,
  );

// Separate router for non-nested routes
export const seatRouter = Router();

seatRouter.use(authMiddleware.protect);

seatRouter
  .route('/:id')
  .get(validateId, cacheOne('seat'), seatController.getSeat)
  .patch(
    authMiddleware.restrictTo('admin'),
    validateId,
    validateSchema(seatSchema, true),
    seatController.updateSeat,
  )
  .delete(
    authMiddleware.restrictTo('admin'),
    validateId,
    seatController.deleteSeat,
  );
