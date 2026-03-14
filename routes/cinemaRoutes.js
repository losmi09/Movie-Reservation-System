import { Router } from 'express';
import { validateId } from '../middlewares/validateId.js';
import { cacheAll, cacheOne } from '../middlewares/caching.js';
import * as cinemaController from '../controllers/cinemaController.js';
import * as authMiddleware from '../middlewares/auth.js';
import { cinemaHallRouter as hallRouter } from './hallRoutes.js';
import { cinemaShowtimeRouter as showtimeRouter } from './showtimeRoutes.js';
import { setParentFilter } from '../middlewares/setParentFilter.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { cinemaSchema } from '../schemas/cinemaSchema.js';

export const cinemaRouter = Router();

cinemaRouter.use(
  '/:id/showtimes',
  validateId,
  setParentFilter('cinema'),
  showtimeRouter,
);

cinemaRouter.use(
  '/:id/halls',
  validateId,
  setParentFilter('cinema'),
  hallRouter,
);

cinemaRouter
  .route('/')
  .get(cacheAll('cinema'), cinemaController.getAllCinemas)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    validateSchema(cinemaSchema),
    cinemaController.createCinema,
  );

cinemaRouter
  .route('/:id')
  .get(validateId, cacheOne('cinema'), cinemaController.getCinema)
  .patch(
    validateId,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    validateSchema(cinemaSchema, true),
    cinemaController.updateCinema,
  )
  .delete(
    validateId,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    cinemaController.deleteCinema,
  );
