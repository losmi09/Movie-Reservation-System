import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import checkIfExists from '../middlewares/checkIfExists.js';
import * as hallController from '../controllers/hallController.js';
import * as authMiddleware from '../middlewares/auth.js';
import { router as seatRouter } from './seatRoutes.js';

export const router = Router({ mergeParams: true });

router
  .route('/')
  .get(hallController.getAllHalls)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    hallController.createHall
  );

export const idRouter = Router();

idRouter.use(authMiddleware.protect);

idRouter.use('/:id/seats', validateId, checkIfExists('hall'), seatRouter);

idRouter
  .route('/:id')
  .get(validateId, hallController.getHall)
  .patch(
    validateId,
    authMiddleware.restrictTo('admin'),
    hallController.updatehall
  )
  .delete(
    validateId,
    authMiddleware.restrictTo('admin'),
    hallController.deleteHall
  );
