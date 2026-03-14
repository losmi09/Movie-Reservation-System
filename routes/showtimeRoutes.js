import { Router } from 'express';
import * as showtimeController from '../controllers/showtimeController.js';
import * as authMiddleware from '../middlewares/auth.js';
import { reservationRouter } from './reservationRoutes.js';
import { validateId } from '../middlewares/validateId.js';
import { setParentId } from '../middlewares/setParentId.js';
import { cacheAll, cacheOne } from '../middlewares/caching.js';
import { checkIfExists } from '../middlewares/checkIfExists.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { showtimeSchema } from '../schemas/showtimeSchema.js';

// Used for nested /movies/:id/showtimes route
export const movieShowtimeRouter = Router({ mergeParams: true });

movieShowtimeRouter
  .route('/')
  .get(
    checkIfExists('movie'), // Check if parent movie from nested route exists
    cacheAll('showtime'),
    showtimeController.getAllShowtimes,
  )
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    setParentId('movie'),
    validateSchema(showtimeSchema),
    showtimeController.createShowtime,
  );

// Used for nested /cinemas/:id/showtimes route
export const cinemaShowtimeRouter = Router({ mergeParams: true });

cinemaShowtimeRouter.get(
  '/',
  checkIfExists('cinema'), // Check if parent cinema from nested route exists
  cacheAll('showtime'),
  showtimeController.getAllShowtimes,
);

// Separate showtime router
export const showtimeRouter = Router();

showtimeRouter.use(
  '/:id/reservations',
  authMiddleware.protect,
  reservationRouter,
);

showtimeRouter.get(
  '/',
  cacheAll('showtime'),
  showtimeController.getAllShowtimes,
);

showtimeRouter
  .route('/:id')
  .get(validateId, cacheOne('showtime'), showtimeController.getShowtime)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    validateId,
    validateSchema(showtimeSchema, true),
    showtimeController.updateShowtime,
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    validateId,
    showtimeController.deleteShowtime,
  );
