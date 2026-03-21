import { Router } from 'express';
import { checkIfExists } from '../middlewares/checkIfExists.js';
import { validateId } from '../middlewares/validateId.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { rowSchema } from '../schemas/rowSchema.js';
import { cacheAll, cacheOne } from '../middlewares/caching.js';
import * as rowController from '../controllers/rowController.js';
import * as authMiddleware from '../middlewares/auth.js';
import { rowSeatRouter } from './seatRoutes.js';

// Separate row router
export const rowRouter = Router();

rowRouter.use(authMiddleware.protect);

rowRouter.use('/:id/seats', validateId, rowSeatRouter);

rowRouter
  .route('/:id')
  .get(cacheOne('row'), rowController.getRow)
  .patch(
    authMiddleware.restrictTo('admin'),
    validateId,
    validateSchema(rowSchema, true),
    rowController.updateRow,
  )
  .delete(authMiddleware.restrictTo('admin'), rowController.deleteRow);

// Used for nested /halls/:id/rows route
export const hallRowRouter = Router({ mergeParams: true });

hallRowRouter.use(authMiddleware.protect);

hallRowRouter
  .route('/')
  .get(checkIfExists('hall'), cacheAll('row'), rowController.getAllRows)
  .post(
    authMiddleware.restrictTo('admin'),
    validateSchema(rowSchema),
    rowController.createRow,
  );
