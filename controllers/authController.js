import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import userSchema from '../schemas/userSchema.js';
import * as authService from '../services/authService.js';
import * as userRepository from '../repositories/userRepository.js';
import { loginSchema } from '../schemas/userSchema.js';
import { passwordSchema, emailSchema } from '../schemas/userSchema.js';

const sendRefreshTokenCookie = (res, refreshToken) =>
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

const invalidateRefreshToken = async (res, userId) => {
  clearRefreshTokenCookie(res);

  await userRepository.revokeRefreshToken(userId);
};

const sendAuthResponse = async (res, user, statusCode) => {
  const { accessToken, refreshToken } =
    await authService.prepareAccessAndRefreshToken(user.id);

  sendRefreshTokenCookie(res, refreshToken);

  res.status(statusCode).json({ accessToken, data: user });
};

export const register = catchAsync(async (req, res, next) => {
  const { body: userData } = req;

  const { error } = userSchema.validate(userData, { abortEarly: false });

  if (error) return next(error);

  const newUser = await authService.register(userData);

  sendAuthResponse(res, newUser, 201);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate(
    { email, password },
    { abortEarly: false }
  );

  if (error) return next(error);

  const user = await authService.login(email, password);

  sendAuthResponse(res, user, 200);
});

export const logout = catchAsync(async (req, res, next) => {
  invalidateRefreshToken(res, req.user.id);

  res.status(204).end();
});

export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return next(new AppError('Refresh token is required', 400));

  clearRefreshTokenCookie(res);

  const { newAccessToken, newRefreshToken } = await authService.refreshToken(
    refreshToken
  );

  sendRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({ accessToken: newAccessToken });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const user = await authService.verifyEmail(req.params.token);

  await res.status(200).json({
    message: 'Email address has been successfully verified',
    data: { ...user, verifiedAt: new Date() },
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const { error } = emailSchema.validate({ email });

  if (error) return next(error);

  await authService.forgotPassword(email);

  res.status(200).json({
    message:
      'If a user with this email address exists, password reset email will be sent!',
  });
});

const sendPasswordUpdate = (res, user) =>
  res.status(200).json({
    message: 'Your password has been successfully updated!',
    data: { ...user, passwordChangedAt: new Date() },
  });

export const resetPassword = catchAsync(async (req, res, next) => {
  const user = await authService.resetPassword(
    req.params.token,
    req.body.password,
    req.body.passwordConfirm
  );

  invalidateRefreshToken(res, user.id);

  sendPasswordUpdate(res, user);
});

export const updateUserPassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;

  const { error } = passwordSchema.validate(
    { passwordCurrent, password, passwordConfirm },
    { abortEarly: false }
  );

  if (error) return next(error);

  const user = await authService.updatePassword(
    req.user.id,
    passwordCurrent,
    password
  );

  invalidateRefreshToken(res, req.user.id);

  sendPasswordUpdate(res, user);
});
