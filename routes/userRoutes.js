import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';

export const router = Router();

router.use(authMiddleware.protect);

router
  .route('/me')
  .patch(userController.updateUser)
  .delete(userController.deactivateUser);
