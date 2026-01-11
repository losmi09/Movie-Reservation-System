import { Router } from 'express';
import checkIfExists from '../middlewares/checkIfExists.js';
import validateId from '../middlewares/validateId.js';
import * as rowController from '../controllers/rowController.js';
import * as authMiddleware from '../middlewares/auth.js';
import { rowSeatRouter } from './seatRoutes.js';

// Separate row router
export const rowRouter = Router();

rowRouter.use(authMiddleware.protect);

rowRouter.use('/:id/seats', validateId, rowSeatRouter);

rowRouter
  .route('/:id')
  .get(rowController.getRow)
  .patch(authMiddleware.restrictTo('admin'), rowController.updateRow)
  .delete(authMiddleware.restrictTo('admin'), rowController.deleteRow);

// Used for nested /halls/:id/rows route
export const hallRowRouter = Router({ mergeParams: true });

hallRowRouter.use(authMiddleware.protect);

hallRowRouter
  .route('/')
  .get(checkIfExists('hall'), rowController.getAllRows)
  .post(authMiddleware.restrictTo('admin'), rowController.createRow);
