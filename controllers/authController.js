import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { sendResponse } from './utils/sendResponse.js';
import * as authService from '../services/authService.js';
import * as redisService from '../services/redisService.js';

const { NODE_ENV, COOKIE_EXPIRES_IN } = process.env;

const cookieOptions = {
  httpOnly: true, // Ensure cookie is inaccessible via JavaScript on the client side
  secure: NODE_ENV === 'production', // Cookie is sent over HTTPS, not HTTP
  sameSite: 'Lax', // Allow cookie on top-level cross-site navigations (mainly GET)
};

const sendRefreshTokenCookie = (res, refreshToken) =>
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + Number(COOKIE_EXPIRES_IN)),
  });

const clearRefreshTokenCookie = res =>
  res.clearCookie('refreshToken', cookieOptions);

const sendAuthResponse = async (res, user, statusCode) => {
  const { accessToken, refreshToken } =
    await authService.prepareAccessAndRefreshToken(user.id);

  sendRefreshTokenCookie(res, refreshToken);

  res.status(statusCode).json({ accessToken, data: user });
};

const terminateUserSessions = async (res, userId) => {
  clearRefreshTokenCookie(res);

  await redisService.revokeAllUserJtis(userId);
};

export const register = catchAsync(async (req, res) => {
  const userData = { ...req.body };

  const newUser = await authService.register(userData);

  sendAuthResponse(res, newUser, 201);
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.login(email, password);

  sendAuthResponse(res, user, 200);
});

export const logout = catchAsync(async (req, res) => {
  clearRefreshTokenCookie(res);

  await authService.logout(req.cookies.refreshToken);

  sendResponse(res, null, 204);
});

export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return next(new AppError('Refresh token is required', 400));

  clearRefreshTokenCookie(res);

  const { newAccessToken, newRefreshToken } =
    await authService.refreshToken(refreshToken);

  sendRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({ accessToken: newAccessToken });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const user = await authService.verifyEmail(req.params.token);

  res.status(200).json({
    message: 'Email address has been successfully verified',
    data: { ...user, verifiedAt: new Date() },
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

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

export const resetPassword = catchAsync(async (req, res) => {
  const user = await authService.resetPassword(
    req.params.token,
    req.body.password,
    req.body.passwordConfirm,
  );

  await terminateUserSessions(res, user.id);

  sendPasswordUpdate(res, user);
});

export const updateUserPassword = catchAsync(async (req, res) => {
  const { passwordCurrent, password } = req.body;

  const { id: userId } = req.user;

  const user = await authService.updatePassword(
    userId,
    passwordCurrent,
    password,
  );

  await terminateUserSessions(res, userId);

  sendPasswordUpdate(res, user);
});
