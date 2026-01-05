import { Router } from 'express';
import validateId from '../middlewares/validateId.js';
import { getUserReservations } from '../middlewares/reservations.js';
import { checkIfReservationBelongsToUser } from '../middlewares/reservations.js';
import * as reservationController from '../controllers/reservationController.js';
import * as authMiddleware from '../middlewares/auth.js';

export const router = Router({ mergeParams: true }); // Used to create a reservation

router.use(authMiddleware.protect);

router.post(
  '/',
  authMiddleware.restrictTo('user'),
  reservationController.createReservation
);

export const secondRouter = Router(); // Used for /users/me/reservations route

secondRouter.use(authMiddleware.protect);

secondRouter.get(
  '/',
  getUserReservations,
  reservationController.getAllReservations
);

secondRouter
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

export const thirdRouter = Router(); // Used for admin to see all reservations

thirdRouter.use(authMiddleware.protect);

thirdRouter.use(authMiddleware.restrictTo('admin'));

thirdRouter.get('/', reservationController.getAllReservations);

thirdRouter.get('/:id', reservationController.getReservation);
