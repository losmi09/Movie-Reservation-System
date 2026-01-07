import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as authMiddleware from '../middlewares/auth.js';

export const authRouter = Router();

authRouter.post('/register', authController.register);

authRouter.post('/login', authController.login);

authRouter.patch('/verify-email/:token', authController.verifyEmail);

authRouter.post('/refresh-token', authController.refreshToken);

authRouter.post('/forgot-password', authController.forgotPassword);

authRouter.patch('/reset-password/:token', authController.resetPassword);

authRouter.use(authMiddleware.protect);

authRouter.post('/logout', authController.logout);

authRouter.patch('/me/password', authController.updateUserPassword);
