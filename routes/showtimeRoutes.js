import { Router } from 'express';
import * as showtimeController from '../controllers/showtimeController.js';
import * as authMiddleware from '../middlewares/auth.js';
import { router as reservationRouter } from './reservationRoutes.js';
import validateId from '../middlewares/validateId.js';

// Used for nested /movies/:id/showtimes and /cinemas/:id/showtimes routes
export const router = Router({ mergeParams: true });

router
  .route('/')
  .get(showtimeController.getAllShowtimes)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    showtimeController.createShowtime
  );

// Separate showtime router
export const secondRouter = Router();

secondRouter.use(authMiddleware.protect);

secondRouter.use('/:id/reservations', reservationRouter);

secondRouter.get('/', showtimeController.getAllShowtimes);

secondRouter
  .route('/:id')
  .get(validateId, showtimeController.getShowtime)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    showtimeController.updateShowtime
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    showtimeController.deleteShowtime
  );
