import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import checkIfExists from '../middlewares/checkIfExists.js';
import * as hallController from '../controllers/hallController.js';
import * as authMiddleware from '../middlewares/auth.js';
import { router as seatRouter } from './seatRoutes.js';

// Router for nested /cinemas/:id/halls route
export const router = Router({ mergeParams: true });

router
  .route('/')
  .get(checkIfExists('cinema'), hallController.getAllHalls)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    hallController.createHall
  );

// Separate router for non-nested route
export const idRouter = Router();

idRouter.use(authMiddleware.protect);

idRouter.use('/:id/seats', validateId, seatRouter);

idRouter
  .route('/:id')
  .get(validateId, hallController.getHall)
  .patch(
    validateId,
    authMiddleware.restrictTo('admin'),
    hallController.updateHall
  )
  .delete(
    validateId,
    authMiddleware.restrictTo('admin'),
    hallController.deleteHall
  );
