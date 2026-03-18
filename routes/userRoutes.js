import { Router } from 'express';
import { userReservationRouter as reservationRouter } from './reservationRoutes.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { updateUserSchema } from '../schemas/userSchema.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';
import * as imageMiddleware from '../middlewares/image.js';

export const userRouter = Router();

userRouter.use(authMiddleware.protect);

userRouter.use(
  '/me/reservations',
  authMiddleware.restrictTo('user'),
  reservationRouter,
);

userRouter.patch(
  '/me/photo',
  imageMiddleware.uploadUserPhoto,
  imageMiddleware.resizeImage('photo'),
  userController.saveUserPhoto,
);

userRouter
  .route('/me')
  .get(userController.getCurrentUser)
  .patch(validateSchema(updateUserSchema), userController.updateCurrentUser)
  .delete(userController.deactivateCurrentUser);
