import { Router } from 'express';
import { validateId } from '../middlewares/validateId.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { hallSchema } from '../schemas/hallSchema.js';
import { setParentId } from '../middlewares/setParentId.js';
import { setParentFilter } from '../middlewares/setParentFilter.js';
import { checkIfExists } from '../middlewares/checkIfExists.js';
import { cacheAll, cacheOne } from '../middlewares/caching.js';
import * as hallController from '../controllers/hallController.js';
import * as authMiddleware from '../middlewares/auth.js';
import { hallRowRouter } from './rowRoutes.js';

// Router for nested /cinemas/:id/halls route
export const cinemaHallRouter = Router({ mergeParams: true });

cinemaHallRouter
  .route('/')
  .get(checkIfExists('cinema'), cacheAll('hall'), hallController.getAllHalls)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    setParentId('cinema'),
    validateSchema(hallSchema),
    hallController.createHall,
  );

// Separate hall router
export const hallRouter = Router();

hallRouter.use(authMiddleware.protect);

hallRouter.use('/:id/rows', validateId, setParentFilter('hall'), hallRowRouter);

hallRouter
  .route('/:id')
  .get(validateId, cacheOne('hall'), hallController.getHall)
  .patch(
    validateId,
    authMiddleware.restrictTo('admin'),
    validateSchema(hallSchema, true),
    hallController.updateHall,
  )
  .delete(
    validateId,
    authMiddleware.restrictTo('admin'),
    hallController.deleteHall,
  );
