import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import { getUserReservations } from '../middlewares/reservations.js';
import { checkIfReservationBelongsToUser } from '../middlewares/reservations.js';
import * as reservationController from '../controllers/reservationController.js';
import * as authMiddleware from '../middlewares/auth.js';

// Used to create a reservation
export const reservationRouter = Router({ mergeParams: true }); // Used to create a reservation

reservationRouter.post(
  '/',
  authMiddleware.protect,
  authMiddleware.restrictTo('user'),
  reservationController.createReservation
);

export const userReservationRouter = Router(); // Used for /users/me/reservations route

userReservationRouter.use(authMiddleware.protect);

userReservationRouter.get(
  '/',
  getUserReservations,
  reservationController.getAllReservations
);

userReservationRouter
  .route('/:id')
  .get(
    validateId,
    checkIfReservationBelongsToUser,
    reservationController.getReservation
  )
  .patch(
    validateId,
    checkIfReservationBelongsToUser,
    reservationController.cancelReservation
  );

export const allReservationRouter = Router(); // Used for admin to see all reservations

allReservationRouter.use(authMiddleware.protect);

allReservationRouter.use(authMiddleware.restrictTo('admin'));

allReservationRouter.get('/', reservationController.getAllReservations);

allReservationRouter.get('/:id', reservationController.getReservation);
