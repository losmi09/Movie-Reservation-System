import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { sendResponse } from './utils/sendResponse.js';
import * as userService from '../services/userService.js';

export const saveUserPhoto = catchAsync(async (req, res, next) => {
  const { file } = req;

  if (!file) return next(new AppError('No image provided', 422));

  const user = await userService.saveUserPhoto(req.user.id, file.fileName);

  sendResponse(res, user);
});

export const getCurrentUser = catchAsync(async (req, res) => {
  const currentUser = await userService.getCurrentUser(req.user.id);

  sendResponse(res, currentUser);
});

export const updateCurrentUser = catchAsync(async (req, res) => {
  const { user, body } = req;

  const updatedUser = await userService.updateCurrentUser(user.id, { ...body });

  sendResponse(res, { ...updatedUser, updatedAt: new Date() });
});

export const deactivateCurrentUser = catchAsync(async (req, res) => {
  await userService.deactivateCurrentUser(req.user.id);

  sendResponse(res, null, 204);
});
