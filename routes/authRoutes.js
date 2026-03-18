import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema.js';
import { userSchema } from '../schemas/userSchema.js';
import { emailSchema } from '../schemas/userSchema.js';
import { loginSchema } from '../schemas/userSchema.js';
import { passwordSchema } from '../schemas/userSchema.js';
import * as authController from '../controllers/authController.js';
import * as authMiddleware from '../middlewares/auth.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateSchema(userSchema),
  authController.register,
);

authRouter.post('/login', validateSchema(loginSchema), authController.login);

authRouter.patch('/verify-email/:token', authController.verifyEmail);

authRouter.post('/refresh-token', authController.refreshToken);

authRouter.post(
  '/forgot-password',
  validateSchema(emailSchema),
  authController.forgotPassword,
);

authRouter.patch('/reset-password/:token', authController.resetPassword);

authRouter.use(authMiddleware.protect);

authRouter.post('/logout', authController.logout);

authRouter.patch(
  '/me/password',
  validateSchema(passwordSchema),
  authController.updateUserPassword,
);
