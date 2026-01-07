import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import checkIfExists from '../middlewares/checkIfExists.js';
import { cacheAll, cacheOne } from '../middlewares/caching.js';
import * as hallController from '../controllers/hallController.js';
import * as authMiddleware from '../middlewares/auth.js';
import { hallSeatRouter as seatRouter } from './seatRoutes.js';
import setParentFilter from '../middlewares/setParentFilter.js';

// Router for nested /cinemas/:id/halls route
export const cinemaHallRouter = Router({ mergeParams: true });

cinemaHallRouter
  .route('/')
  .get(checkIfExists('cinema'), cacheAll('hall'), hallController.getAllHalls)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    hallController.createHall
  );

// Separate router for non-nested route
export const hallRouter = Router();

hallRouter.use(authMiddleware.protect);

hallRouter.use('/:id/seats', validateId, setParentFilter('hall'), seatRouter);

hallRouter
  .route('/:id')
  .get(validateId, cacheOne('hall'), hallController.getHall)
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
