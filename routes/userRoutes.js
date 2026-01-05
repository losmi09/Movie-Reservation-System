import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';
import * as imageMiddleware from '../middlewares/image.js';
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
  imageMiddleware.uploadUserPhoto,
  imageMiddleware.resizeImage('photo'),
  userController.saveUserPhoto
);

router
  .route('/me')
  .get(userController.getCurrentUser)
  .patch(userController.updateCurrentUser)
  .delete(userController.deactivateCurrentUser);
