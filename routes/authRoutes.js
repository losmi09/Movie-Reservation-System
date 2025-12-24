import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as authMiddleware from '../middlewares/auth.js';

export const router = Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.patch('/verify-email/:token', authController.verifyEmail);

router.post('/refresh-token', authController.refreshToken);

router.post('/forgot-password', authController.forgotPassword);

router.patch('/reset-password/:token', authController.resetPassword);

router.use(authMiddleware.protect);

router.post('/logout', authController.logout);

router.patch('/me/password', authController.updateUserPassword);
