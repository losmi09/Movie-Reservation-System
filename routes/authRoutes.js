import { Router } from 'express';
import * as authController from '../controllers/authController.js';

export const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshToken);

router.patch('/verify-email/:token', authController.verifyEmail);
