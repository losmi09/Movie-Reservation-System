import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import userSchema from '../schemas/userSchema.js';
import { throwValidationError } from './errorController.js';
import * as authService from '../services/authService.js';
import * as userRepository from '../repositories/userRepository.js';
import sanitizeOutput from '../utils/sanitizeOutput.js';

const sendRefreshTokenCookie = (refreshToken, res) =>
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES_IN)),
  });

const clearRefreshTokenCookie = res =>
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

const sendAuthResponse = async (user, statusCode, res) => {
  const { accessToken, refreshToken } =
    await authService.prepareAccessAndRefreshToken(user.id);

  sendRefreshTokenCookie(refreshToken, res);

  sanitizeOutput(user);

  res.status(statusCode).json({ accessToken, data: user });
};

export const register = catchAsync(async (req, res, next) => {
  const { body: userData } = req;

  const { error } = userSchema.validate(userData, { abortEarly: false });

  if (error) return throwValidationError(error.details, res, req.originalUrl);

  const newUser = await authService.register(userData);

  sendAuthResponse(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Email and password are required', 400));

  const user = await userRepository.findUserByEmail(email);

  if (!user || !(await authService.comparePasswords(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  sendAuthResponse(user, 200, res);
});

export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return next(new AppError('Refresh token is required', 400));

  clearRefreshTokenCookie(res);

  const { newAccessToken, newRefreshToken } = await authService.refreshToken(
    refreshToken
  );

  sendRefreshTokenCookie(newRefreshToken, res);

  res.status(200).json({ accessToken: newAccessToken });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const user = await authService.verifyEmail(req.params.token);

  sanitizeOutput(user);

  await res.status(200).json({
    message: 'Email address has been successfully verified',
    data: { ...user, verifiedAt: new Date() },
  });
});
