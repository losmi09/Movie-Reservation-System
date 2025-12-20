import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import userSchema from '../schemas/userSchema.js';
import { throwValidationError } from './errorController.js';
import * as authService from '../services/authService.js';

const sendAuthResponse = async (user, statusCode, res) => {
  const { accessToken, refreshToken } =
    await authService.prepareAccessAndRefreshToken(user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES_IN)),
  });

  res.status(statusCode).json({ accessToken, data: user });
};

export const register = catchAsync(async (req, res, next) => {
  const { body: userData } = req;

  const { error } = userSchema.validate(userData, { abortEarly: false });

  if (error) return throwValidationError(error.details, res, req.originalUrl);

  const newUser = await authService.register(userData);

  sendAuthResponse(newUser, 201, res);
});
