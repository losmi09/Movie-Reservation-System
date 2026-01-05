import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';
import * as photoMiddleware from '../middlewares/photo.js';
import { secondRouter as reservationRouter } from './reservationRoutes.js';

export const router = Router();

router.use(authMiddleware.protect);

router.use(
  '/me/reservations',
  authMiddleware.restrictTo('user'),
  reservationRouter
);

router.use(authMiddleware.protect);

router.patch(
  '/me/photo',
  photoMiddleware.uploadUserPhoto,
  photoMiddleware.resizeUserPhoto,
  userController.saveUserPhoto
);

router
  .route('/me')
  .get(userController.getCurrentUser)
  .patch(userController.updateCurrentUser)
  .delete(userController.deactivateCurrentUser);
